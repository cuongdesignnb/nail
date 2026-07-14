import type { GlobalContent } from "@/lib/content/content.types";
import type { BusinessSettings, BusinessHour } from "./settings.types";
import type { PublicSiteSettings } from "./public-settings.types";
import { hydrateBrandingContent } from "./branding-persistence";
import { buildBusinessHoursSummary, DEFAULT_BUSINESS_HOURS } from "./schemas/business-hours.schema";

export function normalizePhone(value: string) {
  const input = value.trim();
  let digits = input.replace(/\D/g, "");
  if (digits.length === 10) digits = `1${digits}`;
  return {
    display: input,
    e164: digits ? `+${digits}` : "",
    digits,
  };
}

export function mapPublicSiteSettings(input: {
  global: GlobalContent;
  business: BusinessSettings;
  googleMapsUrl?: string | null;
}): PublicSiteSettings {
  const global = input.global;
  const contact = global.defaultContact as typeof global.defaultContact & { website?: string };
  const phone = normalizePhone(contact?.phone || "");
  const hours = Array.isArray(global.businessHours) && global.businessHours.length === 7
    ? global.businessHours as BusinessHour[]
    : DEFAULT_BUSINESS_HOURS as BusinessHour[];
  const branding = hydrateBrandingContent(global as unknown as Record<string, unknown>);
  const mapsUrl = input.googleMapsUrl?.trim()
    || (contact?.address ? `https://maps.google.com/?q=${encodeURIComponent(contact.address)}` : "");
  return {
    brand: {
      name: global.brand?.name || "Aera Nail Lounge",
      tagline: global.brand?.tagline || "",
      logo: branding.logo,
      favicon: branding.favicon,
    },
    contact: {
      phone: phone.display,
      phoneE164: phone.e164,
      phoneDigits: phone.digits,
      email: contact?.email || "",
      address: contact?.address || "",
      website: contact?.website || "",
      mapsUrl,
    },
    businessHours: hours,
    businessHoursSummary: contact?.hours || buildBusinessHoursSummary(hours as never),
    bookingPolicies: {
      minAdvanceHours: global.bookingPolicies?.minAdvanceHours ?? 2,
      maxAdvanceDays: global.bookingPolicies?.maxAdvanceDays ?? 30,
      cancellationWindowHours: global.bookingPolicies?.cancellationWindowHours ?? 24,
      bufferMinutes: global.bookingPolicies?.bufferMinutes ?? 15,
    },
    timezone: input.business.timezone,
    currency: input.business.currency,
    socialLinks: {
      instagramUrl: global.socialLinks?.instagramUrl || undefined,
      facebookUrl: global.socialLinks?.facebookUrl || undefined,
      tiktokUrl: global.socialLinks?.tiktokUrl || undefined,
    },
  };
}
