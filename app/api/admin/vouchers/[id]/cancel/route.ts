import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  const body = await req.json().catch(() => ({}));
  const voucher = await prisma.voucherCode.update({
    where: { id: params.id },
    data: { status: "CANCELLED", cancelledAt: new Date(), cancelReason: String(body.reason || "Cancelled by admin").slice(0, 300) },
  });
  return Response.json({ success: true, data: voucher });
}
