import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

export function bookingCompletedEmail(input: { customerName: string; bookingCode: string }) {
  return {
    subject: "Thank You for Visiting Aera Nail Lounge",
    html: wrapAeraEmail(`
      <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">Thank you for visiting</h1>
      <p>Hi ${input.customerName}, thank you for choosing Aera Nail Lounge.</p>
      <p><strong>Booking code:</strong> ${input.bookingCode}</p>
      <p>We hope to welcome you back soon.</p>
    `),
  };
}
