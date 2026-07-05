import { getBookingCatalog } from "@/lib/payments/booking-checkout/checkout.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getBookingCatalog();
    return Response.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Booking catalog error:", error);
    return Response.json({ success: false, error: "Unable to load booking catalog" }, { status: 500 });
  }
}
