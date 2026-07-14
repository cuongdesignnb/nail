import assert from "node:assert/strict";
import test from "node:test";
import { mergeWithDefaults } from "../lib/content/content-mapper";
import { applyGlobalSettingsSlice } from "../lib/settings/global-settings.service";
import { businessHoursSettingsSchema, buildBusinessHoursSummary, DEFAULT_BUSINESS_HOURS } from "../lib/settings/schemas/business-hours.schema";
import { brandingSettingsSchema } from "../lib/settings/schemas/branding.schema";
import { normalizePhone, mapPublicSiteSettings } from "../lib/settings/public-settings.mapper";
import { validateBookingWindow, isCancellationAllowed } from "../lib/settings/booking-policy";
import { settingsConsumerTags } from "../lib/settings/settings-cache";
import { normalizeMediaUrl } from "../lib/media/resolve-media";
import legacyFixture from "./fixtures/global-content.legacy.json";
import { normalizeGlobalContent, normalizeMediaReference } from "../lib/settings/normalize-global-content";
import { globalContentSchema } from "../validations/content/global.schema";

test("settings slice merge preserves unrelated global content", () => {
  const source = { brand: { name: "Old", tagline: "Keep" }, footer: { brandText: "Old", copyright: "Keep" }, custom: 7 };
  const result = applyGlobalSettingsSlice(source, "salon-profile", { name: "New", phone: "1234567", email: "a@b.com", address: "A", website: "https://example.com", description: "New text" });
  assert.equal((result.brand as any).tagline, "Keep");
  assert.equal((result.footer as any).copyright, "Keep");
  assert.equal(result.custom, 7);
});

test("global defaults merge never overwrites persisted values", () => {
  assert.deepEqual(mergeWithDefaults({ nested: { saved: "yes" } } as any, { nested: { saved: "no", fallback: true } }), { nested: { saved: "yes", fallback: true } });
});

test("business hours require seven unique valid days and build a summary", () => {
  const parsed = businessHoursSettingsSchema.parse({ businessHours: DEFAULT_BUSINESS_HOURS });
  assert.equal(parsed.businessHours.length, 7);
  assert.match(buildBusinessHoursSummary(parsed.businessHours), /Mon/);
  assert.equal(businessHoursSettingsSchema.safeParse({ businessHours: parsed.businessHours.slice(0, 6) }).success, false);
  const invalid = parsed.businessHours.map((entry, index) => index === 0 ? { ...entry, endTime: "08:00" } : entry);
  assert.equal(businessHoursSettingsSchema.safeParse({ businessHours: invalid }).success, false);
});

test("branding validation requires canonical alt text", () => {
  assert.equal(brandingSettingsSchema.safeParse({ logo: { mediaId: "id", src: "/uploads/a.webp", alt: "" }, favicon: null }).success, false);
});

test("phone normalization derives display, E164, and digits", () => {
  assert.deepEqual(normalizePhone("(626) 555-7890"), { display: "(626) 555-7890", e164: "+16265557890", digits: "16265557890" });
});

test("booking policy enforces advance window and cancellation", () => {
  const now = new Date("2026-07-13T00:00:00Z");
  const policies = { minAdvanceHours: 2, maxAdvanceDays: 30, cancellationWindowHours: 24, bufferMinutes: 15 };
  assert.equal(validateBookingWindow({ start: new Date("2026-07-13T01:00:00Z"), now, policies }).reason, "MIN_ADVANCE");
  assert.equal(validateBookingWindow({ start: new Date("2026-08-20T00:00:00Z"), now, policies }).reason, "MAX_ADVANCE");
  assert.equal(isCancellationAllowed({ scheduledStart: new Date("2026-07-15T00:00:00Z"), now, policies }), true);
});

test("public settings mapper uses canonical values", () => {
  const mapped = mapPublicSiteSettings({
    global: {
      brand: { name: "Test Salon", tagline: "Tag", logo: null, favicon: null },
      defaultContact: { phone: "6265557890", email: "a@b.com", address: "Address", hours: "Summary" },
      footer: {} as any, headerNav: {} as any, socialLinks: {} as any, defaultShareImage: { src: "/x", alt: "x" },
    },
    business: { timezone: "America/Los_Angeles", currency: "USD" },
  });
  assert.equal(mapped.brand.name, "Test Salon");
  assert.equal(mapped.contact.phoneE164, "+16265557890");
  assert.equal(mapped.businessHours.length, 7);
});

test("cache selection includes specialized and shared tags", () => {
  const tags = settingsConsumerTags(["business-hours", "general"]);
  assert.ok(tags.includes("public-settings"));
  assert.ok(tags.includes("business-hours"));
  assert.ok(tags.includes("general-settings"));
});

test("Unicode settings remain UTF-8 safe", () => {
  const value = "Sang trọng — Tiệm móng Aéra ✨";
  assert.equal(Buffer.from(value, "utf8").toString("utf8"), value);
  assert.equal(value.includes("�"), false);
});

test("media URL normalization preserves canonical root-relative URLs", () => {
  assert.equal(normalizeMediaUrl("/aera-mark.svg"), "/aera-mark.svg");
  assert.equal(normalizeMediaUrl("branding/logo.webp"), "/uploads/branding/logo.webp");
});

test("legacy fixture reproduces exact raw global validation paths", () => {
  const raw = globalContentSchema.safeParse(legacyFixture);
  assert.equal(raw.success, false);
  if (raw.success) return;
  const paths = raw.error.issues.map((issue) => issue.path.join("."));
  assert.ok(paths.includes("brand.logo.alt"));
  assert.ok(paths.includes("brand.favicon.alt"));
  assert.ok(paths.includes("headerNav"));
  assert.ok(paths.includes("footer.brandText"));
  assert.ok(paths.includes("defaultContact.hours"));
  assert.ok(paths.includes("defaultShareImage.alt"));
  assert.ok(paths.some((path) => path.startsWith("businessHours")));
});

test("normalizes logo string and fills canonical media fields", () => {
  assert.deepEqual(normalizeMediaReference("/uploads/logo.webp", "Salon logo"), {
    mediaId: null, src: "/uploads/logo.webp", alt: "Salon logo", title: null,
  });
});

test("normalizes logo object without replacing its selected URL", () => {
  assert.deepEqual(normalizeMediaReference({ src: "/uploads/selected.webp" }, "Salon logo"), {
    mediaId: null, src: "/uploads/selected.webp", alt: "Salon logo", title: null,
  });
});

test("normalizes favicon string and preserves mediaId", () => {
  const normalized = normalizeGlobalContent({
    brand: {
      name: "Saved Salon",
      logo: { mediaId: "logo-id", src: "/uploads/saved.webp", alt: "Saved alt" },
      favicon: "/uploads/favicon.png",
    },
  }) as any;
  assert.equal(normalized.brand.logo.mediaId, "logo-id");
  assert.equal(normalized.brand.logo.src, "/uploads/saved.webp");
  assert.equal(normalized.brand.favicon.src, "/uploads/favicon.png");
  assert.equal(normalized.brand.favicon.alt, "Saved Salon favicon");
});

test("maps legacy header to headerNav and preserves extended link fields", () => {
  const normalized = normalizeGlobalContent(legacyFixture) as any;
  assert.equal(normalized.headerNav.items[0].id, "legacy-home");
  assert.equal(normalized.headerNav.items[0].label, "Home");
  assert.equal(normalized.headerNav.items[0].target, "_self");
  assert.equal(normalized.headerNav.cta.trackingId, "legacy-cta");
});

test("maps legacy footer while preserving expanded menus", () => {
  const normalized = normalizeGlobalContent(legacyFixture) as any;
  assert.equal(normalized.footer.brandText, "Legacy production footer copy");
  assert.equal(normalized.footer.quickLinks[0].href, "/about");
  assert.equal(normalized.footer.serviceLinks[0].href, "/services/manicure");
  assert.equal(normalized.footer.companyMenu.items[0].url, "/about");
  assert.equal(normalized.footer.customFooterFlag, "preserve-me");
});

test("fills only missing defaults and preserves production values and extras", () => {
  const normalized = normalizeGlobalContent(legacyFixture) as any;
  assert.equal(normalized.brand.name, "Aera Legacy Production");
  assert.equal(normalized.brand.tagline, "Production legacy tagline");
  assert.equal(normalized.extraProductionField.preserve, true);
  assert.equal(normalized.bookingPolicies.legacyPolicyLabel, "preserve-policy-metadata");
});

test("normalizes business hours to seven ordered unique days without losing legacy times", () => {
  const hours = (normalizeGlobalContent(legacyFixture) as any).businessHours;
  assert.deepEqual(hours.map((entry: any) => entry.day), ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
  assert.equal(hours[0].startTime, "09:30");
  assert.equal(hours[0].endTime, "18:30");
  assert.equal(hours[5].startTime, "10:00");
  assert.equal(hours[5].endTime, "17:00");
});

test("fills only missing booking policy fields", () => {
  const policies = (normalizeGlobalContent(legacyFixture) as any).bookingPolicies;
  assert.deepEqual(
    { minAdvanceHours: policies.minAdvanceHours, maxAdvanceDays: policies.maxAdvanceDays, cancellationWindowHours: policies.cancellationWindowHours, bufferMinutes: policies.bufferMinutes },
    { minAdvanceHours: 4, maxAdvanceDays: 30, cancellationWindowHours: 24, bufferMinutes: 15 },
  );
  assert.equal("depositRequired" in policies, false);
});

test("fills contact, share-image alt, and legacy social aliases", () => {
  const normalized = normalizeGlobalContent(legacyFixture) as any;
  assert.equal(normalized.defaultContact.phone, "(626) 555-9911");
  assert.equal(normalized.defaultContact.website, "");
  assert.match(normalized.defaultContact.hours, /Mon/);
  assert.equal(normalized.footer.contact.phone, "(626) 555-9911");
  assert.equal(normalized.defaultShareImage.alt, "Aera Legacy Production share image");
  assert.equal(normalized.socialLinks.instagramUrl, "https://instagram.com/aera-legacy");
});

test("legacy normalization passes strict schema and is idempotent", () => {
  const once = normalizeGlobalContent(legacyFixture);
  const strict = globalContentSchema.safeParse(once);
  assert.equal(strict.success, true, strict.success ? undefined : JSON.stringify(strict.error.issues));
  assert.deepEqual(normalizeGlobalContent(once), once);
});
