import type { GlobalContent } from "@/lib/content/content.types";
import { defaultGlobalContent } from "@/lib/content/content-defaults";
import { mergeWithDefaults } from "@/lib/content/content-mapper";
import type { MediaReference } from "@/lib/media/media.types";
import {
  BUSINESS_DAYS,
  DEFAULT_BUSINESS_HOURS,
  buildBusinessHoursSummary,
} from "./schemas/business-hours.schema";

type UnknownRecord = Record<string, unknown>;

const DEFAULT_POLICIES = {
  minAdvanceHours: 2,
  maxAdvanceDays: 30,
  cancellationWindowHours: 24,
  bufferMinutes: 15,
};

const DAY_ALIASES: Record<string, (typeof BUSINESS_DAYS)[number]> = {
  mon: "Monday", monday: "Monday",
  tue: "Tuesday", tues: "Tuesday", tuesday: "Tuesday",
  wed: "Wednesday", weds: "Wednesday", wednesday: "Wednesday",
  thu: "Thursday", thur: "Thursday", thurs: "Thursday", thursday: "Thursday",
  fri: "Friday", friday: "Friday",
  sat: "Saturday", saturday: "Saturday",
  sun: "Sunday", sunday: "Sunday",
};

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord
    : {};
}

function nonEmptyString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function finiteNumber(value: unknown, fallback: number): number {
  if (value === "" || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function validPublicUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmed : null;
  } catch {
    return null;
  }
}

export function normalizeMediaReference(
  value: unknown,
  fallbackAlt: string,
): MediaReference | null {
  if (typeof value === "string") {
    const src = value.trim();
    return src ? { mediaId: null, src, alt: fallbackAlt, title: null } : null;
  }
  const media = record(value);
  const src = typeof media.src === "string" ? media.src.trim() : "";
  if (!src) return null;
  return {
    mediaId: typeof media.mediaId === "string" && media.mediaId.trim()
      ? media.mediaId.trim()
      : null,
    src,
    alt: nonEmptyString(media.alt, fallbackAlt),
    title: typeof media.title === "string" && media.title.trim()
      ? media.title.trim()
      : null,
  };
}

function menuItems(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) return value;
  const source = record(value);
  for (const key of ["items", "links", "menuItems"]) {
    if (Array.isArray(source[key])) return source[key] as unknown[];
  }
  return undefined;
}

function normalizeNavItems(value: unknown, fallback: unknown[]): UnknownRecord[] {
  const source = menuItems(value);
  if (source === undefined) return fallback.map((item) => ({ ...record(item) }));
  return source.map((item, index) => {
    const link = record(item);
    const label = nonEmptyString(link.label ?? link.name ?? link.title, `Menu item ${index + 1}`);
    const href = nonEmptyString(link.href ?? link.url ?? link.path, "#");
    return {
      ...link,
      id: nonEmptyString(link.id ?? link.key, `legacy-nav-${index + 1}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`),
      label,
      href,
    };
  });
}

function normalizeTime(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.trim()) return fallback;
  const trimmed = value.trim();
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/^(\d{1,2})(?::([0-5]\d))?\s*([ap])\.?m\.?$/i);
  if (!match) return trimmed;
  let hour = Number(match[1]) % 12;
  if (match[3].toLowerCase() === "p") hour += 12;
  return `${String(hour).padStart(2, "0")}:${match[2] ?? "00"}`;
}

function normalizeBusinessHours(value: unknown) {
  const source = Array.isArray(value) ? value : [];
  const byDay = new Map<string, UnknownRecord>();
  for (const item of source) {
    const hour = record(item);
    const rawDay = typeof hour.day === "string" ? hour.day.trim().toLowerCase() : "";
    const day = DAY_ALIASES[rawDay];
    if (day && !byDay.has(day)) byDay.set(day, hour);
  }
  return DEFAULT_BUSINESS_HOURS.map((fallback) => {
    const persisted = byDay.get(fallback.day);
    if (!persisted) return { ...fallback };
    const legacyClosed = typeof persisted.closed === "boolean" ? persisted.closed : undefined;
    const isOpen = typeof persisted.isOpen === "boolean"
      ? persisted.isOpen
      : legacyClosed !== undefined
        ? !legacyClosed
        : fallback.isOpen;
    return {
      ...persisted,
      day: fallback.day,
      isOpen,
      startTime: normalizeTime(
        persisted.startTime ?? persisted.openTime ?? persisted.open,
        fallback.startTime,
      ),
      endTime: normalizeTime(
        persisted.endTime ?? persisted.closeTime ?? persisted.close,
        fallback.endTime,
      ),
    };
  });
}

function legacyFooterLinks(footer: UnknownRecord, keys: string[]): unknown[] | undefined {
  for (const key of keys) {
    const items = menuItems(footer[key]);
    if (items !== undefined) return items;
  }
  return undefined;
}

export function normalizeGlobalContent(input: unknown): GlobalContent {
  const persisted = record(input);
  const defaults = defaultGlobalContent as unknown as UnknownRecord;
  const legacyBrand = record(persisted.brand);
  const brandName = nonEmptyString(legacyBrand.name ?? persisted.salonName, "Aera Nail Lounge");

  const legacyHeader = record(persisted.header);
  const canonicalHeader = record(persisted.headerNav);
  const headerItems = menuItems(canonicalHeader.items) !== undefined
    ? canonicalHeader.items
    : menuItems(legacyHeader.primaryMenu) !== undefined
      ? legacyHeader.primaryMenu
      : legacyHeader.mobileMenu;
  const defaultHeader = record(defaults.headerNav);
  const headerNav = {
    ...legacyHeader,
    ...canonicalHeader,
    items: normalizeNavItems(headerItems, menuItems(defaultHeader.items) ?? []),
    cta: {
      ...record(defaultHeader.cta),
      ...record(legacyHeader.cta),
      ...record(canonicalHeader.cta),
    },
  };

  const legacyFooter = record(persisted.footer);
  const defaultFooter = record(defaults.footer);
  const defaultContact = record(defaults.defaultContact);
  const persistedContact = record(persisted.defaultContact);
  const canonicalContact = {
    ...defaultContact,
    ...persistedContact,
    phone: stringValue(persistedContact.phone, String(defaultContact.phone ?? "")),
    email: stringValue(persistedContact.email, String(defaultContact.email ?? "")),
    address: stringValue(persistedContact.address, String(defaultContact.address ?? "")),
    website: stringValue(persistedContact.website, String(defaultContact.website ?? "")),
    hours: stringValue(persistedContact.hours, String(defaultContact.hours ?? "")),
  };

  const rawHours = persisted.businessHours ?? persisted.hours ?? legacyFooter.businessHours;
  const businessHours = normalizeBusinessHours(rawHours);
  const hoursSummary = rawHours === undefined
    ? canonicalContact.hours
    : buildBusinessHoursSummary(businessHours as never);
  canonicalContact.hours = nonEmptyString(hoursSummary, String(defaultContact.hours ?? ""));

  const footerContact = record(legacyFooter.contact);
  const quickSource = menuItems(legacyFooter.quickLinks) !== undefined
    ? legacyFooter.quickLinks
    : legacyFooterLinks(legacyFooter, ["companyMenu", "exploreMenu", "legalMenu"]);
  const serviceSource = menuItems(legacyFooter.serviceLinks) !== undefined
    ? legacyFooter.serviceLinks
    : legacyFooterLinks(legacyFooter, ["servicesMenu"]);
  const footer = {
    ...defaultFooter,
    ...legacyFooter,
    brandText: stringValue(legacyFooter.brandText ?? legacyFooter.description, String(defaultFooter.brandText ?? "")),
    quickLinks: normalizeNavItems(quickSource, menuItems(defaultFooter.quickLinks) ?? []),
    serviceLinks: normalizeNavItems(serviceSource, menuItems(defaultFooter.serviceLinks) ?? []),
    contact: {
      ...record(defaultFooter.contact),
      ...footerContact,
      phone: stringValue(footerContact.phone, canonicalContact.phone),
      email: stringValue(footerContact.email, canonicalContact.email),
      address: stringValue(footerContact.address, canonicalContact.address),
      hours: stringValue(footerContact.hours, canonicalContact.hours),
    },
    newsletter: {
      ...record(defaultFooter.newsletter),
      ...record(legacyFooter.newsletter),
    },
    copyright: nonEmptyString(legacyFooter.copyright, String(defaultFooter.copyright ?? "")),
  };

  const policyInput = record(persisted.bookingPolicies);
  const bookingPolicies = {
    ...policyInput,
    minAdvanceHours: finiteNumber(policyInput.minAdvanceHours, DEFAULT_POLICIES.minAdvanceHours),
    maxAdvanceDays: finiteNumber(policyInput.maxAdvanceDays, DEFAULT_POLICIES.maxAdvanceDays),
    cancellationWindowHours: finiteNumber(policyInput.cancellationWindowHours, DEFAULT_POLICIES.cancellationWindowHours),
    bufferMinutes: finiteNumber(policyInput.bufferMinutes, DEFAULT_POLICIES.bufferMinutes),
  };

  const legacySocial = {
    ...record(legacyFooter.socialLinks),
    ...record(persisted.social),
    ...record(persisted.socialLinks),
  };
  const defaultSocial = record(defaults.socialLinks);
  const socialLinks = {
    ...defaultSocial,
    ...legacySocial,
    instagramUrl: validPublicUrl(legacySocial.instagramUrl ?? legacySocial.instagram)
      ?? String(defaultSocial.instagramUrl ?? ""),
    facebookUrl: validPublicUrl(legacySocial.facebookUrl ?? legacySocial.facebook)
      ?? String(defaultSocial.facebookUrl ?? ""),
    tiktokUrl: validPublicUrl(legacySocial.tiktokUrl ?? legacySocial.tiktok)
      ?? String(defaultSocial.tiktokUrl ?? ""),
  };

  const defaultShare = record(defaults.defaultShareImage);
  const shareSource = persisted.defaultShareImage ?? persisted.shareImage ?? persisted.ogImage;
  const defaultShareImage = normalizeMediaReference(
    shareSource === undefined ? defaultShare : shareSource,
    `${brandName} share image`,
  ) ?? normalizeMediaReference(defaultShare, `${brandName} share image`)!;

  const legacyMapped: UnknownRecord = {
    ...persisted,
    brand: {
      ...record(defaults.brand),
      ...legacyBrand,
      name: brandName,
      tagline: nonEmptyString(legacyBrand.tagline, "Luxury Nail Care & Art"),
      logo: normalizeMediaReference(
        Object.prototype.hasOwnProperty.call(legacyBrand, "logo")
          ? legacyBrand.logo
          : record(defaults.brand).logo,
        `${brandName} logo`,
      ),
      favicon: normalizeMediaReference(legacyBrand.favicon, `${brandName} favicon`),
    },
    headerNav,
    footer,
    socialLinks,
    defaultContact: canonicalContact,
    businessHours,
    bookingPolicies,
    defaultShareImage,
  };

  return mergeWithDefaults(legacyMapped, defaults) as unknown as GlobalContent;
}

export function changedGlobalPaths(before: unknown, after: unknown): string[] {
  const changed: string[] = [];
  function visit(left: unknown, right: unknown, path: string) {
    if (Object.is(left, right)) return;
    if (Array.isArray(left) || Array.isArray(right)) {
      if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
        changed.push(path || "_root");
        return;
      }
      for (let index = 0; index < left.length; index += 1) {
        visit(left[index], right[index], path ? `${path}.${index}` : String(index));
      }
      return;
    }
    const leftRecord = record(left);
    const rightRecord = record(right);
    if ((left && typeof left === "object") || (right && typeof right === "object")) {
      const keys = new Set([...Object.keys(leftRecord), ...Object.keys(rightRecord)]);
      for (const key of Array.from(keys).sort()) visit(leftRecord[key], rightRecord[key], path ? `${path}.${key}` : key);
      return;
    }
    changed.push(path || "_root");
  }
  visit(before, after, "");
  return changed;
}
