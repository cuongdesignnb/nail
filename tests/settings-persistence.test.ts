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
