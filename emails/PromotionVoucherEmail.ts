import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

function replaceVars(template: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce((html, [key, value]) => html.replaceAll(`{{${key}}}`, value), template);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char] || char));
}

export function promotionVoucherEmail(input: {
  customerName: string;
  campaignTitle: string;
  offerSummary: string;
  voucherCode: string;
  expiresAt: string;
  subject?: string | null;
  bodyHtml?: string | null;
  bodyText?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
}) {
  const vars = {
    customerName: escapeHtml(input.customerName),
    campaignTitle: escapeHtml(input.campaignTitle),
    offerSummary: escapeHtml(input.offerSummary),
    voucherCode: escapeHtml(input.voucherCode),
    expiresAt: escapeHtml(input.expiresAt),
    bookingUrl: "https://aeranailounge.com/booking",
    salonName: "Aera Nail Lounge",
    salonPhone: "(830) 900-8889",
    salonAddress: "1932 S. Seguin Ave. #203, New Braunfels, TX 78130",
  };
  const defaultHtml = `
    <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">Your voucher is here</h1>
    <p>Hi {{customerName}},</p>
    <p>Thank you for your interest in <strong>{{campaignTitle}}</strong>.</p>
    <div style="margin:24px 0;padding:18px;border:1px dashed #b8754d;border-radius:16px;background:#fff8ed;text-align:center">
      <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#9a6a46">Voucher Code</div>
      <div style="font-size:28px;font-weight:800;color:#5c3a28;letter-spacing:.08em">{{voucherCode}}</div>
    </div>
    <p><strong>Offer:</strong><br />{{offerSummary}}</p>
    <p><strong>Valid until:</strong><br />{{expiresAt}}</p>
    <p><a href="{{bookingUrl}}" style="display:inline-block;background:#7a4f32;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px">Book your appointment</a></p>
    <p>With love,<br />Aera Nail Lounge</p>
  `;
  const html = wrapAeraEmail(replaceVars(input.bodyHtml || defaultHtml, vars));
  const text = replaceVars(input.bodyText || `Hi {{customerName}},\n\nYour voucher code is {{voucherCode}}.\n\nOffer: {{offerSummary}}\nValid until: {{expiresAt}}\n\nBook: {{bookingUrl}}\n\nAera Nail Lounge`, {
    ...vars,
    customerName: input.customerName,
    campaignTitle: input.campaignTitle,
    offerSummary: input.offerSummary,
    voucherCode: input.voucherCode,
    expiresAt: input.expiresAt,
  });
  return { subject: input.subject || "Your Aera Nail Lounge Voucher Is Here", html, text };
}
