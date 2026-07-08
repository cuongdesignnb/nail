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
    const status = searchParams.get("status") || undefined;
    const campaignId = searchParams.get("campaignId") || undefined;
    const q = searchParams.get("q")?.trim();
    const where: any = {
      ...(campaignId ? { campaignId } : {}),
      ...(status && status !== "ALL" ? { status } : {}),
      ...(q ? { code: { contains: q, mode: "insensitive" } } : {}),
    };
    const [total, data] = await prisma.$transaction([
      prisma.voucherCode.count({ where }),
      prisma.voucherCode.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          campaign: { select: { id: true, title: true, badge: true } },
          lead: { select: { id: true, fullName: true, email: true, phone: true } },
        },
      }),
    ]);
    return Response.json({ success: true, data, pagination: { page, limit, total } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Voucher list error:", error);
    return Response.json({ success: false, error: "Failed to fetch vouchers" }, { status: 500 });
  }
}
