import { wrapAeraEmail } from "@/lib/email/mail-template-layout";

export function emailTestMessage() {
  return {
    subject: "Aera Nail Lounge SMTP Test",
    html: wrapAeraEmail(`
      <h1 style="font-family:Georgia,serif;color:#7a4f32;margin:0 0 12px">SMTP is ready</h1>
      <p>This test confirms Aera Nail Lounge transactional email can send booking and Gift Card notifications.</p>
    `),
  };
}
