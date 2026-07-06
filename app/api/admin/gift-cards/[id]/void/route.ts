export const dynamic = "force-dynamic";

import { voidGiftCard } from "@/lib/gift-cards/gift-card.service";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { note } = await req.json().catch(() => ({ note: "" }));
    const data = await voidGiftCard(params.id, note);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to void Gift Card." }, { status: 400 });
  }
}
