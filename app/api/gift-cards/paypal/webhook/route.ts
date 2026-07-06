export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { issueGiftCardForPurchase } from "@/lib/gift-cards/gift-card.service";

export async function POST(req: Request) {
  const payload = await req.json();
  const eventId = payload?.id;
  const eventType = payload?.event_type || "unknown";
  const resource = payload?.resource || {};
  const orderId = resource?.supplementary_data?.related_ids?.order_id || resource?.id;
  const captureId = resource?.id;

  if (!eventId) return Response.json({ success: false }, { status: 400 });

  try {
    await prisma.paymentWebhookEvent.create({
      data: {
        provider: "paypal",
        providerEventId: eventId,
        eventType,
        verificationStatus: "not_verified",
        processingStatus: "received",
        providerOrderId: orderId,
        providerCaptureId: captureId,
        payload,
      },
    });
  } catch {
    return Response.json({ success: true, duplicate: true });
  }

  try {
    if (eventType === "PAYMENT.CAPTURE.COMPLETED" && orderId) {
      const purchase = await prisma.giftCardPurchase.findUnique({ where: { paypalOrderId: orderId } });
      if (purchase) {
        await issueGiftCardForPurchase(purchase.id, {
          captureId,
          status: "COMPLETED",
          amount: Number(resource?.amount?.value || purchase.amount),
          currency: resource?.amount?.currency_code || purchase.currency,
        });
      }
    }
    await prisma.paymentWebhookEvent.update({ where: { providerEventId: eventId }, data: { processingStatus: "processed", processedAt: new Date() } });
    return Response.json({ success: true });
  } catch (error) {
    await prisma.paymentWebhookEvent.update({
      where: { providerEventId: eventId },
      data: { processingStatus: "failed", processingError: error instanceof Error ? error.message : "Webhook processing failed" },
    }).catch(() => undefined);
    return Response.json({ success: true });
  }
}
