export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { resendGiftCardEmail } from "@/lib/gift-cards/gift-card.service";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    await resendGiftCardEmail(String(id || ""));
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false, error: "Unable to resend Gift Card email." }, { status: 400 });
  }
}
