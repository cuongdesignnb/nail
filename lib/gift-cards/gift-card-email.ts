import { GiftCard, GiftCardPurchase, TransactionalEmailKind } from "@prisma/client";
import { giftCardDeliveryEmail } from "@/emails/GiftCardDeliveryEmail";
import { giftCardPurchaseReceiptEmail } from "@/emails/GiftCardPurchaseReceiptEmail";
import { sendTransactionalEmail } from "@/lib/email/mail.service";
import { decryptGiftCardCode } from "./gift-card-code";

type ServiceItem = {
  serviceNameSnapshot: string;
  servicePriceSnapshot: unknown;
  serviceDurationSnapshot: number;
};

type GiftCardWithPurchase = GiftCard & {
  purchase: GiftCardPurchase & { items?: ServiceItem[] };
  serviceItems?: ServiceItem[];
};

function money(value: unknown, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(value || 0));
}

function serviceItems(card: GiftCardWithPurchase) {
  const items = card.serviceItems?.length ? card.serviceItems : card.purchase.items || [];
  if (items.length) return items;
  if (card.serviceNameSnapshot) {
    return [{
      serviceNameSnapshot: card.serviceNameSnapshot,
      servicePriceSnapshot: card.servicePriceSnapshot || card.initialAmount,
      serviceDurationSnapshot: card.serviceDurationSnapshot || 0,
    }];
  }
  return [];
}

function valueLabel(card: GiftCardWithPurchase) {
  if (card.type === "SERVICE") return "Service Voucher";
  return money(card.initialAmount, card.currency);
}

function totalPaid(card: GiftCardWithPurchase) {
  return money(Number(card.initialAmount || 0) + Number(card.gratuityAmount || 0), card.currency);
}

export async function sendGiftCardEmails(card: GiftCardWithPurchase) {
  const code = decryptGiftCardCode(card.codeCiphertext);
  const services = serviceItems(card);
  const delivery = giftCardDeliveryEmail({
    recipientName: card.recipientName,
    senderName: card.senderName,
    code,
    valueLabel: valueLabel(card),
    message: card.message || "A thoughtful gift from Aera Nail Lounge.",
    serviceItems: services,
    serviceSubtotal: money(card.initialAmount, card.currency),
    gratuity: money(card.gratuityAmount, card.currency),
    total: totalPaid(card),
  });
  const receipt = giftCardPurchaseReceiptEmail({
    orderNumber: card.purchase.orderNumber,
    recipientName: card.recipientName,
    recipientEmail: card.recipientEmail,
    giftType: card.type === "SERVICE" ? "Service Gift Card" : "Amount Gift Card",
    valueLabel: valueLabel(card),
    serviceItems: services,
    serviceSubtotal: money(card.initialAmount, card.currency),
    gratuity: money(card.gratuityAmount, card.currency),
    total: totalPaid(card),
    paymentStatus: card.purchase.paypalStatus || (card.purchase.paypalOrderId ? "COMPLETED" : "Issued by Aera Nail Lounge"),
    purchaseDate: card.purchase.paidAt || card.purchase.createdAt,
  });

  await sendTransactionalEmail({
    kind: TransactionalEmailKind.GIFT_CARD_DELIVERY,
    to: card.recipientEmail,
    subject: delivery.subject,
    html: delivery.html,
    entityType: "GiftCard",
    entityId: card.id,
    metadata: { orderNumber: card.purchase.orderNumber },
  });
  await sendTransactionalEmail({
    kind: TransactionalEmailKind.GIFT_CARD_PURCHASE_RECEIPT,
    to: card.senderEmail,
    subject: receipt.subject,
    html: receipt.html,
    entityType: "GiftCardPurchase",
    entityId: card.purchaseId,
    metadata: { orderNumber: card.purchase.orderNumber },
  });
}

export async function sendGiftCardResendEmail(card: GiftCardWithPurchase) {
  const code = decryptGiftCardCode(card.codeCiphertext);
  const delivery = giftCardDeliveryEmail({
    recipientName: card.recipientName,
    senderName: card.senderName,
    code,
    valueLabel: valueLabel(card),
    message: card.message || "A thoughtful gift from Aera Nail Lounge.",
    serviceItems: serviceItems(card),
    serviceSubtotal: money(card.initialAmount, card.currency),
    gratuity: money(card.gratuityAmount, card.currency),
    total: totalPaid(card),
    subject: "Your Aera Nail Lounge Gift Card",
  });
  await sendTransactionalEmail({
    kind: TransactionalEmailKind.GIFT_CARD_RESEND,
    to: card.recipientEmail,
    subject: delivery.subject,
    html: delivery.html,
    entityType: "GiftCard",
    entityId: card.id,
    metadata: { resend: true },
  });
}
