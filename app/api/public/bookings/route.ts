export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { z } from "zod";
import { createManualBookingRequest } from "@/lib/payments/booking-checkout/checkout.service";
import { createCheckoutSchema } from "@/lib/payments/booking-checkout/checkout.validation";

export async function POST(req: Request) {
  try {
    const input = createCheckoutSchema.parse(await req.json());
    const data = await createManualBookingRequest(input);
    return Response.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    }
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to create booking request" }, { status: 400 });
  }
}
