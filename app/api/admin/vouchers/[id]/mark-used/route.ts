import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  const voucher = await prisma.voucherCode.update({
    where: { id: params.id },
    data: { status: "USED", usedAt: new Date() },
  });
  return Response.json({ success: true, data: voucher });
}
