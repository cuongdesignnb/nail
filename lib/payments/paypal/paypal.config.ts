import type { PaymentGatewayConfig } from "@prisma/client";
import { prisma } from "@/lib/db";
import { DEFAULT_PAYMENT_CONFIG, PAYPAL_PROVIDER } from "./paypal.constants";
import { decryptSecret, encryptSecret, maskValue } from "./paypal.crypto";
import type { PayPalChargeMode, PayPalConfigView, PayPalEnvironment } from "./paypal.types";

export async function getOrCreatePayPalConfig() {
  return prisma.paymentGatewayConfig.upsert({
    where: { provider: PAYPAL_PROVIDER },
    update: {},
    create: { provider: PAYPAL_PROVIDER },
  });
}

export function serializePayPalConfig(config: PaymentGatewayConfig): PayPalConfigView {
  const environment = (config.environment === "live" ? "live" : "sandbox") as PayPalEnvironment;
  const chargeMode = (config.chargeMode === "full" ? "full" : "deposit") as PayPalChargeMode;
  const ready = Boolean(
    config.isEnabled &&
      config.clientId &&
      config.encryptedClientSecret &&
      config.webhookId
  );
  return {
    provider: PAYPAL_PROVIDER,
    isEnabled: config.isEnabled,
    environment,
    clientId: config.clientId,
    maskedClientId: maskValue(config.clientId),
    clientSecretConfigured: Boolean(config.encryptedClientSecret),
    webhookId: config.webhookId,
    currency: config.currency || DEFAULT_PAYMENT_CONFIG.currency,
    chargeMode,
    depositPercentage: Number(config.depositPercentage),
    bookingHoldMinutes: config.bookingHoldMinutes,
    autoConfirmAfterPayment: config.autoConfirmAfterPayment,
    ready,
  };
}

export async function getPublicPayPalConfig() {
  const config = await getOrCreatePayPalConfig();
  return {
    enabled: Boolean(config.isEnabled && config.clientId && config.encryptedClientSecret),
    clientId: config.clientId,
    currency: config.currency,
    intent: "capture" as const,
    chargeMode: config.chargeMode,
    depositPercentage: Number(config.depositPercentage),
  };
}

export async function updatePayPalConfig(input: {
  isEnabled?: boolean;
  environment?: string;
  clientId?: string;
  clientSecret?: string;
  webhookId?: string;
  currency?: string;
  chargeMode?: string;
  depositPercentage?: number;
  bookingHoldMinutes?: number;
  autoConfirmAfterPayment?: boolean;
}) {
  const existing = await getOrCreatePayPalConfig();
  const encryptedClientSecret = input.clientSecret?.trim()
    ? encryptSecret(input.clientSecret.trim())
    : existing.encryptedClientSecret;

  const nextIsEnabled = input.isEnabled ?? existing.isEnabled;
  if (
    nextIsEnabled &&
    ((!input.clientId && !existing.clientId) ||
      !encryptedClientSecret ||
      (!input.webhookId && !existing.webhookId))
  ) {
    throw new Error("PayPal cannot be enabled until Client ID, Client Secret and Webhook ID are configured.");
  }

  return prisma.paymentGatewayConfig.update({
    where: { provider: PAYPAL_PROVIDER },
    data: {
      isEnabled: nextIsEnabled,
      environment: input.environment ?? existing.environment,
      clientId: input.clientId?.trim() || existing.clientId,
      encryptedClientSecret,
      webhookId: input.webhookId?.trim() || existing.webhookId,
      currency: input.currency ?? existing.currency,
      chargeMode: input.chargeMode ?? existing.chargeMode,
      depositPercentage: input.depositPercentage ?? existing.depositPercentage,
      bookingHoldMinutes: input.bookingHoldMinutes ?? existing.bookingHoldMinutes,
      autoConfirmAfterPayment:
        input.autoConfirmAfterPayment ?? existing.autoConfirmAfterPayment,
    },
  });
}

export async function removePayPalSecret() {
  return prisma.paymentGatewayConfig.update({
    where: { provider: PAYPAL_PROVIDER },
    data: { isEnabled: false, encryptedClientSecret: null },
  });
}

export async function getPayPalCredentials() {
  const config = await getOrCreatePayPalConfig();
  if (!config.clientId || !config.encryptedClientSecret) {
    throw new Error("PayPal credentials are not configured.");
  }
  return {
    config,
    clientId: config.clientId,
    clientSecret: decryptSecret(config.encryptedClientSecret),
  };
}
