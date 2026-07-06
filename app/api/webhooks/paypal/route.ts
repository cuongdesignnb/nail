import { prisma } from "@/lib/db";
import { verifyPayPalWebhookSignature } from "@/lib/payments/paypal/paypal.webhook";
import { issueGiftCardForPurchase } from "@/lib/gift-cards/gift-card.service";

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
      const purchase = orderId
        ? await prisma.giftCardPurchase.findUnique({ where: { paypalOrderId: orderId } })
        : null;
      if (purchase) {
        const amount = Number(resource?.amount?.value ?? 0);
        const currency = resource?.amount?.currency_code || purchase.currency;
        const result = await issueGiftCardForPurchase(purchase.id, {
          captureId,
          status: resource?.status,
          amount,
          currency,
        });
        await prisma.paymentWebhookEvent.update({
          where: { id: event.id },
          data: { processingStatus: "processed", processedAt: new Date() },
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
