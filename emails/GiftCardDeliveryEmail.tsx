export function giftCardDeliveryEmail(input: {
  recipientName: string;
  senderName: string;
  code: string;
  valueLabel: string;
  message: string;
}) {
  return {
    subject: "You Received a Gift from Aera Nail Lounge",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;color:#3b2f2a;line-height:1.6">
        <h1 style="font-family:Georgia,serif;color:#7a4f32">Aera Nail Lounge</h1>
        <p>Dear ${input.recipientName},</p>
        <p>${input.senderName} sent you a gift of luxury.</p>
        <p><strong>${input.valueLabel}</strong></p>
        <p style="font-size:22px;letter-spacing:2px"><strong>${input.code}</strong></p>
        <blockquote style="border-left:3px solid #c9a46b;padding-left:16px">${input.message}</blockquote>
        <p>To redeem, present this code at Aera Nail Lounge during checkout. Gift card terms are available at /gift-cards/terms.</p>
      </div>
    `,
  };
}
