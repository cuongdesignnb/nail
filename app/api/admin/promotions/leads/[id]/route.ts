import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  const lead = await prisma.promotionLead.findUnique({
    where: { id: params.id },
    include: { campaign: true, voucherCode: true },
  });
  if (!lead) return Response.json({ success: false, error: "Lead not found" }, { status: 404 });
  return Response.json({ success: true, data: lead }, { headers: { "Cache-Control": "no-store" } });
}
