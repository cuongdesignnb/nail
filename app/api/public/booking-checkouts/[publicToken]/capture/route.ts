import { z } from "zod";
import { prisma } from "@/lib/db";
import { capturePayPalOrder } from "@/lib/payments/paypal/paypal.orders";
import { finalizePaidCheckout } from "@/lib/payments/booking-checkout/checkout-finalizer";
import { captureCheckoutSchema } from "@/lib/payments/booking-checkout/checkout.validation";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: { publicToken: string } }) {
  const limit = rateLimit(getRateLimitKey(req, "booking-checkout-capture"), 30, 60_000);
  if (!limit.ok) return Response.json({ success: false, error: "Too many capture attempts." }, { status: 429 });
  try {
    const body = captureCheckoutSchema.parse(await req.json());
    const session = await prisma.bookingCheckoutSession.findUnique({ where: { publicToken: params.publicToken } });
    if (!session) return Response.json({ success: false, error: "Checkout not found" }, { status: 404 });
    if (session.paypalOrderId !== body.paypalOrderId) {
      return Response.json({ success: false, error: "PayPal order mismatch" }, { status: 400 });
    }
    if (session.bookingId) {
      const booking = await prisma.booking.findUnique({ where: { id: session.bookingId } });
      return Response.json({ success: true, data: { status: "finalized", booking } });
    }
    const capture = await capturePayPalOrder(body.paypalOrderId, `capture-${session.id}`);
    if (capture.status !== "COMPLETED") {
      await prisma.bookingCheckoutSession.update({
        where: { id: session.id },
        data: { status: "failed", failedAt: new Date(), failureCode: capture.status, failureReason: "PayPal capture was not completed." },
      });
      return Response.json({ success: false, error: "PayPal capture was not completed." }, { status: 400 });
    }
    const booking = await finalizePaidCheckout({
      checkoutSessionId: session.id,
      paypalOrderId: capture.orderId,
      paypalCaptureId: capture.captureId,
      payer: capture.payer,
      amount: capture.amount,
      currency: capture.currency,
      providerStatus: capture.status,
      providerPayload: capture.raw,
      source: "capture_api",
    });
    return Response.json({ success: true, data: { status: "finalized", booking } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    }
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to capture PayPal payment" }, { status: 400 });
  }
}
