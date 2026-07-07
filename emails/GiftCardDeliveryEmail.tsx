import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

type ServiceItem = {
  serviceNameSnapshot: string;
  servicePriceSnapshot: unknown;
  serviceDurationSnapshot: number;
};

function serviceList(items: ServiceItem[] = []) {
  if (!items.length) return "";
  return `
    <div style="margin:18px 0;padding:16px;border:1px solid #eadfd5;border-radius:14px;background:#fffaf2">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.16em;color:#9a6a46">Selected Services</div>
      ${items.map((item) => `
        <div style="margin-top:12px">
          <strong>${item.serviceNameSnapshot}</strong><br />
          <span style="color:#725744">${item.serviceDurationSnapshot} min</span>
        </div>
      `).join("")}
    </div>
  `;
}

export function giftCardDeliveryEmail(input: {
  recipientName: string;
  senderName: string;
  code: string;
  valueLabel: string;
  message: string;
  serviceItems?: ServiceItem[];
  serviceSubtotal?: string;
  gratuity?: string;
  total?: string;
  subject?: string;
}) {
  const hasServices = Boolean(input.serviceItems?.length);
  return {
    subject: input.subject || "You Received a Gift from Aera Nail Lounge",
    html: wrapAeraEmail(`
      <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">You received a gift</h1>
      <p>Dear ${input.recipientName},</p>
      <p>${input.senderName} sent you a gift from Aera Nail Lounge.</p>
      <p style="font-size:20px"><strong>${input.valueLabel}</strong></p>
      ${serviceList(input.serviceItems)}
      ${hasServices ? `<p><strong>Services Subtotal:</strong> ${input.serviceSubtotal}</p><p><strong>Included Gratuity:</strong> ${input.gratuity}</p><p><strong>Total Gift:</strong> ${input.total}</p>` : ""}
      <p style="font-size:22px;letter-spacing:2px"><strong>${input.code}</strong></p>
      <blockquote style="border-left:3px solid #c9a46b;padding-left:16px;color:#5d3a27">${input.message || "A thoughtful gift from Aera Nail Lounge."}</blockquote>
      <p>Redeem this Gift Card in salon at Aera Nail Lounge. Present the code and recipient email during checkout.</p>
      <p>Gift Card terms are available at <a href="/gift-cards/terms">/gift-cards/terms</a>.</p>
    `),
  };
}
