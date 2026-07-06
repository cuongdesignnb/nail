export const dynamic = "force-dynamic";

import { redeemGiftCard } from "@/lib/gift-cards/gift-card.service";
import { adminGiftCardActionSchema } from "@/lib/gift-cards/gift-card-validation";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const input = adminGiftCardActionSchema.parse(await req.json());
    const data = await redeemGiftCard(params.id, input.amount, input.note, input.bookingId);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to redeem Gift Card." }, { status: 400 });
  }
}
