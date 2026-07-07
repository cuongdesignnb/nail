import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

export function bookingCancelledEmail(input: { customerName: string; bookingCode: string }) {
  return {
    subject: "Your Appointment Has Been Cancelled | Aera Nail Lounge",
    html: wrapAeraEmail(`
      <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">Appointment cancelled</h1>
      <p>Hi ${input.customerName}, booking ${input.bookingCode} has been cancelled.</p>
      <p>Contact Aera Nail Lounge if you would like to schedule a new visit.</p>
    `),
  };
}
