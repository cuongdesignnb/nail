import { paypalFetch } from "./paypal.client";
import type { PayPalCaptureResult } from "./paypal.types";

function money(value: number): string {
  return value.toFixed(2);
}

export async function createPayPalOrder(input: {
  sessionId: string;
  publicToken: string;
  amount: number;
  currency: string;
  description: string;
  idempotencyKey: string;
}) {
  const order = await paypalFetch<{ id: string; status: string }>("/v2/checkout/orders", {
    method: "POST",
    idempotencyKey: input.idempotencyKey,
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.sessionId,
          custom_id: input.publicToken,
          description: input.description,
          amount: {
            currency_code: input.currency,
            value: money(input.amount),
          },
        },
      ],
    }),
  });
  return order;
}

export async function capturePayPalOrder(orderId: string, idempotencyKey: string): Promise<PayPalCaptureResult> {
  const payload = await paypalFetch<any>(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    idempotencyKey,
    body: "{}",
  });
  return normalizeCapture(payload);
}

export function normalizeCapture(payload: any): PayPalCaptureResult {
  const purchaseUnit = payload?.purchase_units?.[0];
  const capture = purchaseUnit?.payments?.captures?.[0];
  const payerName = [payload?.payer?.name?.given_name, payload?.payer?.name?.surname].filter(Boolean).join(" ");
  return {
    orderId: payload?.id,
    captureId: capture?.id,
    status: capture?.status || payload?.status,
    amount: Number(capture?.amount?.value ?? 0),
    currency: capture?.amount?.currency_code || "",
    payer: {
      id: payload?.payer?.payer_id ?? null,
      email: payload?.payer?.email_address ?? null,
      name: payerName || null,
    },
    raw: payload,
  };
}
