import { z } from "zod";
import { createBookingCheckout } from "@/lib/payments/booking-checkout/checkout.service";
import { createCheckoutSchema } from "@/lib/payments/booking-checkout/checkout.validation";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const limit = rateLimit(getRateLimitKey(req, "booking-checkout-create"), 20, 60_000);
  if (!limit.ok) return Response.json({ success: false, error: "Too many checkout attempts. Please wait a moment." }, { status: 429 });
  try {
    const input = createCheckoutSchema.parse(await req.json());
    const data = await createBookingCheckout(input);
    return Response.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    }
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to create checkout" }, { status: 400 });
  }
}
