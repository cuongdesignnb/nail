export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { z } from "zod";
import { createGiftCardPayPalOrder } from "@/lib/gift-cards/gift-card.service";
import { purchaseIdSchema } from "@/lib/gift-cards/gift-card-validation";

export async function POST(req: Request) {
  try {
    const { purchaseId } = purchaseIdSchema.parse(await req.json());
    const paypalOrderId = await createGiftCardPayPalOrder(purchaseId);
    return Response.json({ success: true, data: { paypalOrderId } });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ success: false, error: "Validation failed" }, { status: 400 });
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to create PayPal order." }, { status: 400 });
  }
}
