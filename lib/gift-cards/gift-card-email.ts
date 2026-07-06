import { GiftCard, GiftCardPurchase } from "@prisma/client";
import { giftCardDeliveryEmail } from "@/emails/GiftCardDeliveryEmail";
import { giftCardPurchaseReceiptEmail } from "@/emails/GiftCardPurchaseReceiptEmail";
import { decryptGiftCardCode } from "./gift-card-code";

type GiftCardWithPurchase = GiftCard & { purchase: GiftCardPurchase };

function valueLabel(card: GiftCard) {
  if (card.type === "SERVICE") return card.serviceNameSnapshot || "Selected Aera service";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: card.currency }).format(Number(card.initialAmount));
}

async function sendMail(input: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Aera Nail Lounge <hello@example.com>";
  if (!apiKey) throw new Error("Email provider is not configured.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: input.to, subject: input.subject, html: input.html }),
  });
  if (!response.ok) throw new Error("Email provider rejected the message.");
}

export async function sendGiftCardEmails(card: GiftCardWithPurchase) {
  const code = decryptGiftCardCode(card.codeCiphertext);
  const delivery = giftCardDeliveryEmail({
    recipientName: card.recipientName,
    senderName: card.senderName,
    code,
    valueLabel: valueLabel(card),
    message: card.message,
  });
  const receipt = giftCardPurchaseReceiptEmail({
    orderNumber: card.purchase.orderNumber,
    recipientName: card.recipientName,
    giftType: card.type === "SERVICE" ? "Service Gift Card" : "Amount Gift Card",
    valueLabel: valueLabel(card),
    paymentStatus: card.purchase.paypalStatus || "COMPLETED",
    purchaseDate: card.purchase.paidAt || card.purchase.createdAt,
  });
  await sendMail({ to: card.recipientEmail, ...delivery });
  await sendMail({ to: card.senderEmail, ...receipt });
}
