import { z } from "zod";
import { calculateBookingQuote } from "@/lib/payments/booking-checkout/checkout.service";
import { quoteRequestSchema } from "@/lib/payments/booking-checkout/checkout.validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const input = quoteRequestSchema.parse(await req.json());
    const data = await calculateBookingQuote(input);
    return Response.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    }
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to calculate quote" }, { status: 400 });
  }
}
