import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { getGlobalSettingsSlice, saveAndPublishGlobalSettingsSlice } from "../lib/settings/global-settings.service";
import { getBusinessSettings, saveBusinessSettings } from "../lib/settings/settings.service";
import { getOrCreatePayPalConfig, serializePayPalConfig, updatePayPalConfig } from "../lib/payments/paypal/paypal.config";
import { getPublicSmtpSettings } from "../lib/email/smtp-config.service";
import { getOrCreateAiSettings, serializeAiSettings, updateAiSettings } from "../lib/ai/ai-settings.service";
import { getPublicSiteSettings } from "../lib/settings/public-settings.service";
import legacyFixture from "../tests/fixtures/global-content.legacy.json";
import { globalContentSchema } from "../validations/content/global.schema";
import { businessHoursSettingsSchema } from "../lib/settings/schemas/business-hours.schema";

let failed = false;
function check(value: boolean, label: string) { console.log(`${value ? "PASS" : "FAIL"} ${label}`); if (!value) failed = true; }

async function testGlobalSection(section: "salon-profile" | "business-hours" | "booking-policies" | "branding") {
  const before = await getGlobalSettingsSlice(section);
  const saved = await saveAndPublishGlobalSettingsSlice({ section, patch: before.data as never, actor: "settings-integration-test", expectedVersion: before.version });
  const after = await getGlobalSettingsSlice(section);
  check(JSON.stringify(saved.data) === JSON.stringify(after.data), `${section}: save → database → reload canonical match`);
}

async function testLegacyGlobalCompatibility() {
  const original = await prisma.sitePageContent.findUnique({ where: { slug: "global" } });
  if (!original) throw new Error("SitePageContent.global is required for the legacy integration test.");
  await prisma.sitePageContent.update({
    where: { slug: "global" },
    data: {
      draftContent: legacyFixture as Prisma.InputJsonValue,
      publishedContent: legacyFixture as Prisma.InputJsonValue,
      version: { increment: 1 },
      updatedBy: "legacy-fixture-test",
      publishedBy: "legacy-fixture-test",
    },
  });

  try {
    const profile = await getGlobalSettingsSlice("salon-profile");
    await saveAndPublishGlobalSettingsSlice({
      section: "salon-profile",
      patch: { ...profile.data, name: "Aera Legacy Save Verified" },
      actor: "settings-integration-test",
      expectedVersion: profile.version,
    });
    check((await getGlobalSettingsSlice("salon-profile")).data.name === "Aera Legacy Save Verified", "legacy salon-profile: PUT slice → reload match");

    const hours = await getGlobalSettingsSlice("business-hours");
    const updatedHours = hours.data.businessHours.map((entry) => entry.day === "Saturday"
      ? { ...entry, isOpen: true, startTime: "11:00", endTime: "17:30" }
      : entry);
    await saveAndPublishGlobalSettingsSlice({
      section: "business-hours",
      patch: { businessHours: updatedHours, summary: "" },
      actor: "settings-integration-test",
      expectedVersion: hours.version,
    });
    check((await getGlobalSettingsSlice("business-hours")).data.businessHours.find((entry) => entry.day === "Saturday")?.startTime === "11:00", "legacy business-hours: PUT slice → reload match");

    const policies = await getGlobalSettingsSlice("booking-policies");
    await saveAndPublishGlobalSettingsSlice({
      section: "booking-policies",
      patch: { ...policies.data, bufferMinutes: 25 },
      actor: "settings-integration-test",
      expectedVersion: policies.version,
    });
    check((await getGlobalSettingsSlice("booking-policies")).data.bufferMinutes === 25, "legacy booking-policies: PUT slice → reload match");

    const branding = await getGlobalSettingsSlice("branding");
    await saveAndPublishGlobalSettingsSlice({
      section: "branding",
      patch: {
        logo: branding.data.logo ? { ...branding.data.logo, alt: "Legacy logo verified" } : null,
        favicon: branding.data.favicon,
      },
      actor: "settings-integration-test",
      expectedVersion: branding.version,
    });
    check((await getGlobalSettingsSlice("branding")).data.logo?.alt === "Legacy logo verified", "legacy branding: PUT slice → reload match");

    const persisted = await prisma.sitePageContent.findUniqueOrThrow({ where: { slug: "global" } });
    check(globalContentSchema.safeParse(persisted.draftContent).success, "legacy save: draft is strict-valid");
    check(globalContentSchema.safeParse(persisted.publishedContent).success, "legacy save: published is strict-valid");
    const draft = persisted.draftContent as Record<string, any>;
    const published = persisted.publishedContent as Record<string, any>;
    check(draft.brand.logo.src === "/uploads/production-logo.webp" && published.brand.logo.src === draft.brand.logo.src, "legacy save: production logo URL preserved in draft/published");
    check(draft.headerNav.items[0].target === "_self" && draft.footer.companyMenu.items[0].url === "/about", "legacy save: unrelated header/footer menus preserved");
    check(draft.defaultContact.phone === "(626) 555-9911" && draft.extraProductionField.preserve === true, "legacy save: contact and extra production fields preserved");

    const publicSettings = await getPublicSiteSettings({ uncached: true });
    check(publicSettings.brand.name === "Aera Legacy Save Verified", "legacy save: public settings resolve saved salon name");
    check(publicSettings.businessHours.find((entry) => entry.day === "Saturday")?.startTime === "11:00", "legacy save: public settings resolve saved business hours");

    let conflict = false;
    try {
      const current = await getGlobalSettingsSlice("booking-policies");
      await saveAndPublishGlobalSettingsSlice({ section: "booking-policies", patch: current.data, actor: "settings-integration-test", expectedVersion: current.version - 1 });
    } catch (error) {
      conflict = (error as Error).name === "VERSION_CONFLICT";
    }
    check(conflict, "legacy save: stale expectedVersion is rejected as VERSION_CONFLICT");

    const invalidHours = updatedHours.map((entry, index) => index === 0 ? { ...entry, startTime: "18:00", endTime: "17:00" } : entry);
    const invalid = businessHoursSettingsSchema.safeParse({ businessHours: invalidHours });
    check(!invalid.success && invalid.error.issues.some((issue) => issue.path.join(".") === "businessHours.0.endTime"), "legacy save: invalid hours returns exact field path");
  } finally {
    await prisma.sitePageContent.update({
      where: { id: original.id },
      data: {
        draftContent: original.draftContent as Prisma.InputJsonValue,
        publishedContent: original.publishedContent === null ? Prisma.DbNull : original.publishedContent as Prisma.InputJsonValue,
        version: original.version,
        updatedBy: original.updatedBy,
        publishedBy: original.publishedBy,
        publishedAt: original.publishedAt,
      },
    });
  }
}

async function main() {
  await testLegacyGlobalCompatibility();
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
