import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

export function bookingRescheduledEmail(input: { customerName: string; bookingCode: string; when: string; services: string }) {
  return {
    subject: "Your Appointment Has Been Updated | Aera Nail Lounge",
    html: wrapAeraEmail(`
      <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">Appointment updated</h1>
      <p>Hi ${input.customerName}, your appointment details were updated.</p>
      <p><strong>Booking code:</strong> ${input.bookingCode}</p>
      <p><strong>Services:</strong> ${input.services}</p>
      <p><strong>New date/time:</strong> ${input.when}</p>
      <p>Payment is collected at the salon after your appointment.</p>
    `),
  };
}
