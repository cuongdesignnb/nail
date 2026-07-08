import { NextRequest } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { sendPromotionVoucherEmail } from "@/lib/promotions/promotion-email.service";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  const sent = await sendPromotionVoucherEmail(params.id);
  return Response.json({
    success: sent,
    message: sent ? "Voucher email resent." : "Email could not be sent. Check SMTP settings.",
  });
}
