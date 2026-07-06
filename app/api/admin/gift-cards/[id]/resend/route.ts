export const dynamic = "force-dynamic";

import { resendGiftCardEmail } from "@/lib/gift-cards/gift-card.service";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const data = await resendGiftCardEmail(params.id);
    return Response.json({ success: true, data });
  } catch {
    return Response.json({ success: false, error: "Unable to resend Gift Card email." }, { status: 400 });
  }
}
