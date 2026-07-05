export const PAYPAL_PROVIDER = "paypal";

export const PAYPAL_ENDPOINTS = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
} as const;

export const PAYPAL_CAPTURE_EVENTS = [
  "PAYMENT.CAPTURE.COMPLETED",
  "PAYMENT.CAPTURE.DENIED",
  "PAYMENT.CAPTURE.REFUNDED",
  "PAYMENT.CAPTURE.REVERSED",
] as const;

export const DEFAULT_PAYMENT_CONFIG = {
  environment: "sandbox",
  currency: "USD",
  chargeMode: "deposit",
  depositPercentage: 25,
  bookingHoldMinutes: 15,
  autoConfirmAfterPayment: true,
} as const;
