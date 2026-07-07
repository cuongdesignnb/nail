import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

type ServiceItem = {
  serviceNameSnapshot: string;
  servicePriceSnapshot: unknown;
  serviceDurationSnapshot: number;
};

export function giftCardPurchaseReceiptEmail(input: {
  orderNumber: string;
  recipientName: string;
  recipientEmail?: string;
  giftType: string;
  valueLabel: string;
  serviceItems?: ServiceItem[];
  serviceSubtotal?: string;
  gratuity?: string;
  total?: string;
  paymentStatus: string;
  purchaseDate: Date;
}) {
  return {
    subject: "Your Aera Nail Lounge Gift Card Purchase",
    html: wrapAeraEmail(`
      <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">Gift Card Receipt</h1>
      <p>Thank you for your Gift Card purchase.</p>
      <p><strong>Order:</strong> ${input.orderNumber}</p>
      <p><strong>Recipient:</strong> ${input.recipientName}${input.recipientEmail ? ` (${input.recipientEmail})` : ""}</p>
      <p><strong>Gift type:</strong> ${input.giftType}</p>
      <p><strong>Value:</strong> ${input.valueLabel}</p>
      ${input.serviceItems?.length ? `<p><strong>Services Subtotal:</strong> ${input.serviceSubtotal}</p><p><strong>Gratuity:</strong> ${input.gratuity}</p><p><strong>Total Paid:</strong> ${input.total}</p>` : ""}
      <p><strong>Payment status:</strong> ${input.paymentStatus}</p>
      <p><strong>Purchase date:</strong> ${input.purchaseDate.toLocaleDateString("en-US")}</p>
    `),
  };
}
