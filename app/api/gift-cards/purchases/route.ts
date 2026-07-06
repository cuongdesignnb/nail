export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { z } from "zod";
import { createGiftCardPurchase, getGiftCardCatalog } from "@/lib/gift-cards/gift-card.service";
import { createGiftCardPurchaseSchema } from "@/lib/gift-cards/gift-card-validation";

export async function GET() {
  try {
    return Response.json({ success: true, data: await getGiftCardCatalog() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ success: false, error: "Unable to load Gift Card options." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const input = createGiftCardPurchaseSchema.parse(await req.json());
    const purchase = await createGiftCardPurchase(input);
    return Response.json({ success: true, data: { purchaseId: purchase.id, orderNumber: purchase.orderNumber, amount: Number(purchase.amount), currency: purchase.currency } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to create Gift Card purchase." }, { status: 400 });
  }
}
