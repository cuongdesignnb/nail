import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 25)));
    const campaignId = searchParams.get("campaignId") || undefined;
    const emailStatus = searchParams.get("emailStatus") || undefined;
    const q = searchParams.get("q")?.trim();
    const where: any = {
      ...(campaignId ? { campaignId } : {}),
      ...(emailStatus && emailStatus !== "ALL" ? { emailStatus } : {}),
      ...(q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const [total, data] = await prisma.$transaction([
      prisma.promotionLead.count({ where }),
      prisma.promotionLead.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          campaign: { select: { id: true, title: true, badge: true } },
          voucherCode: true,
        },
      }),
    ]);
    return Response.json({ success: true, data, pagination: { page, limit, total } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Promotion leads list error:", error);
    return Response.json({ success: false, error: "Failed to fetch leads" }, { status: 500 });
  }
}
