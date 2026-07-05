import { prisma } from "@/lib/db";
import { verifyPayPalWebhookSignature } from "@/lib/payments/paypal/paypal.webhook";
import { finalizePaidCheckout } from "@/lib/payments/booking-checkout/checkout-finalizer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);
  const eventId = payload?.id;
  const eventType = payload?.event_type || "UNKNOWN";
  if (!eventId) return Response.json({ success: false, error: "Missing PayPal event id" }, { status: 400 });

  const verified = await verifyPayPalWebhookSignature(req.headers, payload).catch(() => false);
  const existing = await prisma.paymentWebhookEvent.findUnique({ where: { providerEventId: eventId } });
  if (existing) {
    return Response.json({ success: true, data: { duplicate: true } });
  }

  const resource = payload?.resource || {};
  const captureId = resource?.id || null;
  const orderId =
    resource?.supplementary_data?.related_ids?.order_id ||
    resource?.invoice_id ||
    null;

  const event = await prisma.paymentWebhookEvent.create({
    data: {
      provider: "paypal",
      providerEventId: eventId,
      eventType,
      verificationStatus: verified ? "success" : "failure",
      processingStatus: verified ? "received" : "ignored",
      providerOrderId: orderId,
      providerCaptureId: captureId,
      payload,
    },
  });

  if (!verified) {
    return Response.json({ success: true, data: { ignored: true } });
  }

  try {
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const session = orderId
        ? await prisma.bookingCheckoutSession.findUnique({ where: { paypalOrderId: orderId } })
        : null;
      if (session) {
        const amount = Number(resource?.amount?.value ?? 0);
        const currency = resource?.amount?.currency_code || session.currency;
        const result = await finalizePaidCheckout({
          checkoutSessionId: session.id,
          paypalOrderId: orderId,
          paypalCaptureId: captureId,
          payer: {
            email: resource?.payer?.email_address ?? null,
            name: resource?.payer?.name ? String(resource.payer.name) : null,
          },
          amount,
          currency,
          providerStatus: resource?.status,
          providerPayload: payload,
          source: "paypal_webhook",
        });
        await prisma.paymentWebhookEvent.update({
          where: { id: event.id },
          data: { processingStatus: "processed", checkoutSessionId: session.id, processedAt: new Date() },
        });
        return Response.json({ success: true, data: result });
      }
    }

    await prisma.paymentWebhookEvent.update({
      where: { id: event.id },
      data: { processingStatus: "ignored", processedAt: new Date() },
    });
    return Response.json({ success: true, data: { ignored: true } });
  } catch (error) {
    await prisma.paymentWebhookEvent.update({
      where: { id: event.id },
      data: {
        processingStatus: "failed",
        processingError: error instanceof Error ? error.message : "Webhook processing failed",
        processedAt: new Date(),
      },
    });
    return Response.json({ success: false, error: "Webhook processing failed" }, { status: 500 });
  }
}
