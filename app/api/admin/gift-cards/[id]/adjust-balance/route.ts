export const dynamic = "force-dynamic";

import { adjustGiftCardBalance } from "@/lib/gift-cards/gift-card.service";
import { adminGiftCardActionSchema } from "@/lib/gift-cards/gift-card-validation";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const input = adminGiftCardActionSchema.parse(await req.json());
    if (typeof input.amount !== "number") throw new Error("Adjustment amount is required.");
    const data = await adjustGiftCardBalance(params.id, input.amount, input.note);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to adjust Gift Card." }, { status: 400 });
  }
}
