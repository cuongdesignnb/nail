export function giftCardPurchaseReceiptEmail(input: {
  orderNumber: string;
  recipientName: string;
  giftType: string;
  valueLabel: string;
  paymentStatus: string;
  purchaseDate: Date;
}) {
  return {
    subject: "Your Aera Nail Lounge Gift Card Purchase",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;color:#3b2f2a;line-height:1.6">
        <h1 style="font-family:Georgia,serif;color:#7a4f32">Aera Nail Lounge</h1>
        <p>Thank you for your gift card purchase.</p>
        <p><strong>Order:</strong> ${input.orderNumber}</p>
        <p><strong>Recipient:</strong> ${input.recipientName}</p>
        <p><strong>Gift type:</strong> ${input.giftType}</p>
        <p><strong>Value:</strong> ${input.valueLabel}</p>
        <p><strong>Payment status:</strong> ${input.paymentStatus}</p>
        <p><strong>Purchase date:</strong> ${input.purchaseDate.toLocaleDateString("en-US")}</p>
      </div>
    `,
  };
}
