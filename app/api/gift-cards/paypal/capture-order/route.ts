export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { z } from "zod";
import { captureGiftCardPayPalOrder } from "@/lib/gift-cards/gift-card.service";
import { captureOrderSchema } from "@/lib/gift-cards/gift-card-validation";

export async function POST(req: Request) {
  try {
    const input = captureOrderSchema.parse(await req.json());
    const data = await captureGiftCardPayPalOrder(input.purchaseId, input.paypalOrderId);
    return Response.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ success: false, error: "Validation failed" }, { status: 400 });
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to capture Gift Card payment." }, { status: 400 });
  }
}
