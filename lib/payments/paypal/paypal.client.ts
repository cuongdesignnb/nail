import { PAYPAL_ENDPOINTS } from "./paypal.constants";
import { getPayPalCredentials } from "./paypal.config";

let cachedToken: { accessToken: string; expiresAt: number; environment: string } | null = null;

export async function getPayPalBaseUrl() {
  const { config } = await getPayPalCredentials();
  return PAYPAL_ENDPOINTS[config.environment === "live" ? "live" : "sandbox"];
}

export async function getPayPalAccessToken(): Promise<string> {
  const { config, clientId, clientSecret } = await getPayPalCredentials();
  const environment = config.environment === "live" ? "live" : "sandbox";
  if (cachedToken && cachedToken.environment === environment && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const baseUrl = PAYPAL_ENDPOINTS[environment];
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.access_token) {
    throw new Error("Unable to authenticate with PayPal credentials.");
  }

  cachedToken = {
    accessToken: json.access_token,
    expiresAt: Date.now() + Math.max(60, Number(json.expires_in || 300) - 60) * 1000,
    environment,
  };
  return cachedToken.accessToken;
}

export async function paypalFetch<T>(
  path: string,
  init: RequestInit & { idempotencyKey?: string } = {}
): Promise<T> {
  const baseUrl = await getPayPalBaseUrl();
  const accessToken = await getPayPalAccessToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("Content-Type", "application/json");
  if (init.idempotencyKey) headers.set("PayPal-Request-Id", init.idempotencyKey);

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof json?.message === "string" ? json.message : "PayPal API request failed.");
  }
  return json as T;
}
