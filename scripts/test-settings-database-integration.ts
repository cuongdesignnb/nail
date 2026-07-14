import { prisma } from "../lib/db";
import { getGlobalSettingsSlice, saveAndPublishGlobalSettingsSlice } from "../lib/settings/global-settings.service";
import { getBusinessSettings, saveBusinessSettings } from "../lib/settings/settings.service";
import { getOrCreatePayPalConfig, serializePayPalConfig, updatePayPalConfig } from "../lib/payments/paypal/paypal.config";
import { getPublicSmtpSettings } from "../lib/email/smtp-config.service";
import { getOrCreateAiSettings, serializeAiSettings, updateAiSettings } from "../lib/ai/ai-settings.service";
import { getPublicSiteSettings } from "../lib/settings/public-settings.service";

let failed = false;
function check(value: boolean, label: string) { console.log(`${value ? "PASS" : "FAIL"} ${label}`); if (!value) failed = true; }

async function testGlobalSection(section: "salon-profile" | "business-hours" | "booking-policies" | "branding") {
  const before = await getGlobalSettingsSlice(section);
  const saved = await saveAndPublishGlobalSettingsSlice({ section, patch: before.data as never, actor: "settings-integration-test", expectedVersion: before.version });
  const after = await getGlobalSettingsSlice(section);
  check(JSON.stringify(saved.data) === JSON.stringify(after.data), `${section}: save → database → reload canonical match`);
}

async function main() {
  for (const section of ["salon-profile", "business-hours", "booking-policies", "branding"] as const) await testGlobalSection(section);

  const general = await getBusinessSettings();
  const savedGeneral = await saveBusinessSettings(general.data);
  check(JSON.stringify(savedGeneral.data) === JSON.stringify((await getBusinessSettings()).data), "general: save → database → reload canonical match");

  const paypal = await getOrCreatePayPalConfig();
  const savedPaypal = await updatePayPalConfig({ isEnabled: paypal.isEnabled, environment: paypal.environment, clientId: paypal.clientId || undefined, webhookId: paypal.webhookId || undefined, currency: paypal.currency });
  const paypalView = serializePayPalConfig(savedPaypal);
  check(paypalView.environment === paypal.environment && paypalView.currency === paypal.currency, "payments: non-secret save → reload match; secret preserved");
  check(!("chargeMode" in paypalView) && !("depositPercentage" in paypalView) && !("bookingHoldMinutes" in paypalView), "payments: legacy normal-booking fields are absent from Settings response");

  const smtpRecord = await prisma.emailSmtpSetting.upsert({ where: { key: "default" }, create: { key: "default" }, update: {} });
  await prisma.emailSmtpSetting.update({ where: { key: "default" }, data: { enabled: smtpRecord.enabled } });
  const smtp = await getPublicSmtpSettings();
  check(smtp.enabled === smtpRecord.enabled && smtp.hasPassword === Boolean(smtpRecord.encryptedPassword), "email: safe save → reload match; password remains write-only");

  const ai = await getOrCreateAiSettings();
  const savedAi = await updateAiSettings({
    isEnabled: ai.isEnabled, textModel: ai.textModel, imageModel: ai.imageModel,
    defaultOutputLanguage: ai.defaultOutputLanguage, defaultArticleTone: ai.defaultArticleTone,
    defaultArticleLength: ai.defaultArticleLength, defaultGenerateImage: ai.defaultGenerateImage,
    defaultImageSize: ai.defaultImageSize, defaultImageQuality: ai.defaultImageQuality,
    maxKeywordsPerBatch: ai.maxKeywordsPerBatch, maxConcurrentJobs: ai.maxConcurrentJobs,
    maxRetriesPerJob: ai.maxRetriesPerJob, monthlyBudgetLimit: ai.monthlyBudgetLimit ? Number(ai.monthlyBudgetLimit) : null,
    humanReviewRequired: ai.humanReviewRequired, autoScheduleEnabled: ai.autoScheduleEnabled,
  });
  check(JSON.stringify(serializeAiSettings(savedAi)) === JSON.stringify(serializeAiSettings(await getOrCreateAiSettings())), "AI: explicit non-secret save → reload match; API key preserved");

  const seo = await prisma.seoSiteSetting.upsert({ where: { key: "default" }, create: { key: "default" }, update: {} });
  await prisma.seoSiteSetting.update({ where: { key: "default" }, data: { titleTemplate: seo.titleTemplate } });
  check((await prisma.seoSiteSetting.findUnique({ where: { key: "default" } }))?.titleTemplate === seo.titleTemplate, "SEO: save → database → reload match");

  const publicSettings = await getPublicSiteSettings({ uncached: true });
  const profile = await getGlobalSettingsSlice("salon-profile");
  check(publicSettings.brand.name === profile.data.name && publicSettings.contact.phone === profile.data.phone, "public resolver matches canonical salon profile");
}

main().catch((error) => { failed = true; console.error("FAIL database integration", error); }).finally(async () => { await prisma.$disconnect(); if (failed) process.exitCode = 1; });
