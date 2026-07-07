import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

export function bookingConfirmedEmail(input: { customerName: string; bookingCode: string; when: string; services: string }) {
  return {
    subject: "Your Appointment Is Confirmed | Aera Nail Lounge",
    html: wrapAeraEmail(`
      <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">Your appointment is confirmed</h1>
      <p>Hi ${input.customerName}, your Aera Nail Lounge appointment is confirmed.</p>
      <p><strong>Booking code:</strong> ${input.bookingCode}</p>
      <p><strong>Services:</strong> ${input.services}</p>
      <p><strong>Date/time:</strong> ${input.when}</p>
      <p>Please arrive a few minutes early. Payment is collected at the salon after your appointment.</p>
    `),
  };
}
