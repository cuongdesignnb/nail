import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);
}

export function adminBookingRequestEmail(input: {
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  services: string;
  technician?: string | null;
  when: string;
  status: string;
  notes?: string | null;
  adminBookingUrl: string;
}) {
  const notes = input.notes?.trim()
    ? `<p><strong>Customer notes:</strong><br />${escapeHtml(input.notes).replace(/\r?\n/g, "<br />")}</p>`
    : "";

  return {
    subject: `New Appointment Request ${input.bookingCode} | Aera Nail Lounge`,
    html: wrapAeraEmail(`
      <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">New appointment request</h1>
      <p>A customer submitted a new booking request.</p>
      <p><strong>Booking code:</strong> ${escapeHtml(input.bookingCode)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(input.customerName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.customerEmail)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(input.customerPhone)}</p>
      <p><strong>Services:</strong> ${escapeHtml(input.services)}</p>
      <p><strong>Technician:</strong> ${escapeHtml(input.technician || "Any available technician")}</p>
      <p><strong>Date/time:</strong> ${escapeHtml(input.when)}</p>
      <p><strong>Status:</strong> ${escapeHtml(input.status)}</p>
      ${notes}
      <p style="margin-top:24px"><a href="${escapeHtml(input.adminBookingUrl)}" style="display:inline-block;border-radius:999px;background:#7a4f32;color:#fff;padding:11px 18px;text-decoration:none;font-weight:700">Open booking in Admin</a></p>
    `),
  };
}
