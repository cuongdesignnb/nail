export type ChargeMode = "deposit" | "full" | "pay_at_salon";

export type BookingCustomerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reminderConsent: boolean;
  marketingConsent: boolean;
};

export type BookingPayload = {
  serviceIds: string[];
  addonIds: string[];
  technicianId: string;
  date: string;
  time: string;
  promotionCode?: string;
  notes?: string;
  policyAccepted: boolean;
  policyVersion: string;
};

export type QuoteSnapshot = {
  services: Array<{ id: string; name: string; price: number; duration: number }>;
  addons: Array<{ id: string; name: string; price: number; duration: number }>;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentAmount: number;
  remainingAmount: number;
  chargeMode: ChargeMode;
  depositPercentage: number;
  currency: string;
  durationMinutes: number;
  promotionCode?: string | null;
};

export type FinalizeSource = "capture_api" | "paypal_webhook" | "admin_reconciliation";
