# Gift Card Email Flow

Gift Cards are email-only for this release.

## Public Purchase

1. The customer configures an Amount Gift Card or a Service Gift Card.
2. Service Gift Cards can include one or more active services and an optional gratuity.
3. The server recalculates service subtotal, gratuity, and total payable.
4. PayPal checkout is available only when SMTP is configured and verified.
5. After PayPal capture, the Gift Card code is generated and encrypted.
6. Recipient delivery and purchaser receipt emails are sent through the central SMTP mail service.
7. Email failures are logged and do not invalidate the issued Gift Card.

## Admin Manual Issue

Admin issue does not use PayPal. It creates:

- a `GiftCardPurchase` audit record,
- a `GiftCard`,
- service item snapshots when applicable,
- a transaction timeline entry,
- transactional email logs when email sending is requested.

## Service Voucher Rules

Service Gift Cards store the service subtotal separately from gratuity. They display as `Service Voucher` instead of showing an invalid cash balance.

Existing single-service Gift Cards remain readable through legacy snapshot fields and migration-created service item rows.
