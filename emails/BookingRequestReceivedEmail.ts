import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

export function bookingRequestReceivedEmail(input: {
  customerName: string;
  bookingCode: string;
  services: string;
  technician?: string | null;
  when: string;
  status: string;
}) {
  return {
    subject: "We Received Your Appointment Request | Aera Nail Lounge",
    html: wrapAeraEmail(`
      <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">Appointment request received</h1>
      <p>Hi ${input.customerName},</p>
      <p>We received your appointment request.</p>
      <p><strong>Booking code:</strong> ${input.bookingCode}</p>
      <p><strong>Services:</strong> ${input.services}</p>
      <p><strong>Technician:</strong> ${input.technician || "Any available technician"}</p>
      <p><strong>Date/time:</strong> ${input.when}</p>
      <p><strong>Status:</strong> ${input.status}</p>
      <p><strong>Payment is collected at the salon after your appointment.</strong></p>
    `),
  };
}
