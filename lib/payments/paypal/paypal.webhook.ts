import { getPayPalCredentials } from "./paypal.config";
import { paypalFetch } from "./paypal.client";

export function getPayPalWebhookHeaders(headers: Headers) {
  return {
    transmission_id: headers.get("paypal-transmission-id") || "",
    transmission_time: headers.get("paypal-transmission-time") || "",
    cert_url: headers.get("paypal-cert-url") || "",
    auth_algo: headers.get("paypal-auth-algo") || "",
    transmission_sig: headers.get("paypal-transmission-sig") || "",
  };
}

export async function verifyPayPalWebhookSignature(headers: Headers, webhookEvent: unknown): Promise<boolean> {
  const { config } = await getPayPalCredentials();
  if (!config.webhookId) return false;
  const result = await paypalFetch<{ verification_status?: string }>("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      ...getPayPalWebhookHeaders(headers),
      webhook_id: config.webhookId,
      webhook_event: webhookEvent,
    }),
  });
  return result.verification_status === "SUCCESS";
}
