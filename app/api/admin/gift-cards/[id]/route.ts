export const dynamic = "force-dynamic";

import { getAdminGiftCard } from "@/lib/gift-cards/gift-card.service";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await getAdminGiftCard(params.id);
  if (!data) return Response.json({ success: false, error: "Gift Card not found." }, { status: 404 });
  return Response.json({ success: true, data });
}
