import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/db";
import { getPublicSiteSettings } from "@/lib/settings/public-settings.service";
import { getPublicSmtpSettings } from "@/lib/email/smtp-config.service";
import { getOrCreatePayPalConfig, serializePayPalConfig } from "@/lib/payments/paypal/paypal.config";
import { getOrCreateAiSettings, serializeAiSettings } from "@/lib/ai/ai-settings.service";
import { settingsFailure, SETTINGS_NO_STORE_HEADERS } from "@/lib/settings/settings-api";

export const dynamic = "force-dynamic";

function read(object: unknown, path: string) {
  return path.split(".").reduce<unknown>((value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, object);
}

async function healthCheck() {
  const [global, publicSettings, smtp, paypalRecord, aiRecord, seo] = await Promise.all([
    prisma.sitePageContent.findUnique({ where: { slug: "global" } }),
    getPublicSiteSettings({ uncached: true }),
    getPublicSmtpSettings(),
    getOrCreatePayPalConfig(),
    getOrCreateAiSettings(),
    prisma.seoSiteSetting.findUnique({ where: { key: "default" } }),
  ]);
  const draft = global?.draftContent;
  const published = global?.publishedContent;
  const paypal = serializePayPalConfig(paypalRecord);
  const ai = serializeAiSettings(aiRecord);
  const rows = [
    ["Brand name", read(draft, "brand.name"), read(published, "brand.name"), publicSettings.brand.name],
    ["Logo URL", read(draft, "brand.logo.src"), read(published, "brand.logo.src"), publicSettings.brand.logo?.src],
    ["Logo mediaId", read(draft, "brand.logo.mediaId"), read(published, "brand.logo.mediaId"), publicSettings.brand.logo?.mediaId],
    ["Favicon URL", read(draft, "brand.favicon.src"), read(published, "brand.favicon.src"), publicSettings.brand.favicon?.src],
    ["Phone", read(draft, "defaultContact.phone"), read(published, "defaultContact.phone"), publicSettings.contact.phone],
    ["Email", read(draft, "defaultContact.email"), read(published, "defaultContact.email"), publicSettings.contact.email],
    ["Address", read(draft, "defaultContact.address"), read(published, "defaultContact.address"), publicSettings.contact.address],
    ["Hours summary", read(draft, "defaultContact.hours"), read(published, "defaultContact.hours"), publicSettings.businessHoursSummary],
    ["Timezone", publicSettings.timezone, publicSettings.timezone, publicSettings.timezone],
    ["Currency", publicSettings.currency, publicSettings.currency, publicSettings.currency],
    ["Booking buffer", read(draft, "bookingPolicies.bufferMinutes"), read(published, "bookingPolicies.bufferMinutes"), publicSettings.bookingPolicies.bufferMinutes],
    ["SMTP enabled/verified", `${smtp.enabled}/${Boolean(smtp.verifiedAt)}`, `${smtp.enabled}/${Boolean(smtp.verifiedAt)}`, `${smtp.enabled}/${Boolean(smtp.verifiedAt)}`],
    ["PayPal Gift Card enabled/ready", `${paypal.isEnabled}/${paypal.ready}`, `${paypal.isEnabled}/${paypal.ready}`, `${paypal.isEnabled}/${paypal.ready}`],
    ["AI enabled/key configured", `${ai.isEnabled}/${ai.apiKeyConfigured}`, `${ai.isEnabled}/${ai.apiKeyConfigured}`, `${ai.isEnabled}/${ai.apiKeyConfigured}`],
    ["SEO title template", seo?.titleTemplate, seo?.titleTemplate, seo?.titleTemplate],
  ].map(([setting, adminValue, databaseValue, publicValue]) => ({
    setting,
    adminValue: adminValue ?? null,
    databaseValue: databaseValue ?? null,
    publishedValue: databaseValue ?? null,
    publicValue: publicValue ?? null,
    status: JSON.stringify(databaseValue ?? null) === JSON.stringify(publicValue ?? null) ? "OK" : "MISMATCH",
  }));
  return { rows, checkedAt: new Date().toISOString() };
}

export async function GET() {
  try {
    requireRole(["Owner"]);
    return Response.json({ success: true, data: await healthCheck(), meta: { updatedAt: new Date().toISOString(), updatedBy: null, publicRevalidated: true } }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    return roleErrorResponse(error) || authErrorResponse(error) || settingsFailure("Unable to run settings diagnostics.", "DATABASE_ERROR", 500);
  }
}

export const POST = GET;
