import { z } from "zod";
import { getAvailability } from "@/lib/payments/booking-checkout/checkout.service";
import { availabilityRequestSchema } from "@/lib/payments/booking-checkout/checkout.validation";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const limit = rateLimit(getRateLimitKey(req, "booking-availability"), 120, 60_000);
  if (!limit.ok) return Response.json({ success: false, error: "Too many requests" }, { status: 429 });
  try {
    const url = new URL(req.url);
    const input = availabilityRequestSchema.parse({
      serviceIds: url.searchParams.getAll("serviceIds").length
        ? url.searchParams.getAll("serviceIds")
        : (url.searchParams.get("serviceIds") || "").split(",").filter(Boolean),
      addonIds: url.searchParams.getAll("addonIds").length
        ? url.searchParams.getAll("addonIds")
        : (url.searchParams.get("addonIds") || "").split(",").filter(Boolean),
      technicianId: url.searchParams.get("technicianId") || "no-preference",
      date: url.searchParams.get("date"),
    });
    const data = await getAvailability(input);
    return Response.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    }
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to load availability" }, { status: 400 });
  }
}
