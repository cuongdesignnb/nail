export type PayPalEnvironment = "sandbox" | "live";
export type PayPalChargeMode = "deposit" | "full";

export type PayPalConfigView = {
  provider: "paypal";
  isEnabled: boolean;
  environment: PayPalEnvironment;
  clientId: string | null;
  maskedClientId: string | null;
  clientSecretConfigured: boolean;
  webhookId: string | null;
  currency: string;
  chargeMode: PayPalChargeMode;
  depositPercentage: number;
  bookingHoldMinutes: number;
  autoConfirmAfterPayment: boolean;
  ready: boolean;
};

export type PayPalPayer = {
  id?: string | null;
  email?: string | null;
  name?: string | null;
};

export type PayPalCaptureResult = {
  orderId: string;
  captureId: string;
  status: string;
  amount: number;
  currency: string;
  payer: PayPalPayer;
  raw: unknown;
};
