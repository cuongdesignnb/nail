import { Prisma } from "@prisma/client";
import sanitizeHtml from "sanitize-html";
import { prisma } from "@/lib/db";
import { defaultGlobalContent } from "@/lib/content/content-defaults";
import { mergeWithDefaults } from "@/lib/content/content-mapper";
import { globalContentSchema } from "@/validations/content/global.schema";
import type { MediaReference } from "@/lib/media/media.types";
import type {
  BookingPolicies,
  BrandingSettings,
  BusinessHour,
  GlobalSettingsSection,
  SalonProfileSettings,
} from "./settings.types";
import { hydrateBrandingContent } from "./branding-persistence";
import {
  buildBusinessHoursSummary,
  canonicalizeBusinessHours,
  DEFAULT_BUSINESS_HOURS,
} from "./schemas/business-hours.schema";

type GlobalRecord = Record<string, unknown>;

export type GlobalSettingsSliceMap = {
  "salon-profile": SalonProfileSettings;
  "business-hours": { businessHours: BusinessHour[]; summary: string };
  "booking-policies": BookingPolicies;
  branding: BrandingSettings;
};

function mergedGlobal(content: unknown): GlobalRecord {
  const persisted = content && typeof content === "object" && !Array.isArray(content)
    ? content as GlobalRecord
    : {};
  return mergeWithDefaults(
    persisted,
    defaultGlobalContent as unknown as GlobalRecord,
  );
}

function recordValue(value: unknown): GlobalRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as GlobalRecord
    : {};
}

export function extractGlobalSettingsSlice<S extends GlobalSettingsSection>(
  content: GlobalRecord,
  section: S,
): GlobalSettingsSliceMap[S] {
  const brand = recordValue(content.brand);
  const contact = recordValue(content.defaultContact);
  const footer = recordValue(content.footer);
  if (section === "salon-profile") {
    return {
      name: String(brand.name ?? ""),
      phone: String(contact.phone ?? ""),
      email: String(contact.email ?? ""),
      address: String(contact.address ?? ""),
      website: String(contact.website ?? ""),
      description: String(footer.brandText ?? ""),
    } as GlobalSettingsSliceMap[S];
  }
  if (section === "business-hours") {
    const hours = Array.isArray(content.businessHours) && content.businessHours.length === 7
      ? content.businessHours as BusinessHour[]
      : DEFAULT_BUSINESS_HOURS as BusinessHour[];
    const summary = String(contact.hours ?? buildBusinessHoursSummary(hours as never));
    return { businessHours: hours, summary } as GlobalSettingsSliceMap[S];
  }
  if (section === "booking-policies") {
    const policies = recordValue(content.bookingPolicies);
    return {
      minAdvanceHours: Number(policies.minAdvanceHours ?? 2),
      maxAdvanceDays: Number(policies.maxAdvanceDays ?? 30),
      cancellationWindowHours: Number(policies.cancellationWindowHours ?? 24),
      bufferMinutes: Number(policies.bufferMinutes ?? 15),
    } as GlobalSettingsSliceMap[S];
  }
  return hydrateBrandingContent(content) as GlobalSettingsSliceMap[S];
}

export function applyGlobalSettingsSlice<S extends GlobalSettingsSection>(
  content: GlobalRecord,
  section: S,
  patch: GlobalSettingsSliceMap[S],
): GlobalRecord {
  if (section === "salon-profile") {
    const profile = patch as GlobalSettingsSliceMap["salon-profile"];
    const footer = recordValue(content.footer);
    return {
      ...content,
      brand: { ...recordValue(content.brand), name: profile.name },
      defaultContact: {
        ...recordValue(content.defaultContact),
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        website: profile.website,
      },
      footer: {
        ...footer,
        brandText: sanitizeHtml(profile.description, {
          allowedTags: ["p", "br", "strong", "em", "ul", "ol", "li", "a"],
          allowedAttributes: { a: ["href", "target", "rel"] },
        }),
        contact: {
          ...recordValue(footer.contact),
          phone: profile.phone,
          email: profile.email,
          address: profile.address,
        },
      },
    };
  }
  if (section === "business-hours") {
    const input = patch as GlobalSettingsSliceMap["business-hours"];
    const hours = canonicalizeBusinessHours(input.businessHours as Parameters<typeof canonicalizeBusinessHours>[0]);
    const summary = buildBusinessHoursSummary(hours);
    const footer = recordValue(content.footer);
    return {
      ...content,
      businessHours: hours,
      defaultContact: { ...recordValue(content.defaultContact), hours: summary },
      footer: {
        ...footer,
        contact: { ...recordValue(footer.contact), hours: summary },
      },
    };
  }
  if (section === "booking-policies") {
    return { ...content, bookingPolicies: { ...(patch as BookingPolicies) } };
  }
  const branding = patch as BrandingSettings;
  return {
    ...content,
    brand: {
      ...recordValue(content.brand),
      logo: branding.logo ? { ...branding.logo } : null,
      favicon: branding.favicon ? { ...branding.favicon } : null,
    },
  };
}

async function verifyMediaReference(reference: MediaReference | null, field: string) {
  if (!reference?.mediaId) return;
  const asset = await prisma.mediaAsset.findFirst({
    where: { id: reference.mediaId, isDeleted: false },
    select: { url: true },
  });
  if (!asset) {
    throw Object.assign(new Error(`${field} references a media asset that does not exist.`), {
      name: "MEDIA_REFERENCE_ERROR", field,
    });
  }
  if (asset.url !== reference.src) {
    throw Object.assign(new Error(`${field} URL does not match the selected media asset.`), {
      name: "MEDIA_REFERENCE_ERROR", field: `${field}.src`,
    });
  }
}

export async function getGlobalSettingsSlice<S extends GlobalSettingsSection>(section: S) {
  const record = await prisma.sitePageContent.upsert({
    where: { slug: "global" },
    update: {},
    create: {
      slug: "global",
      draftContent: defaultGlobalContent as unknown as Prisma.InputJsonValue,
      publishedContent: defaultGlobalContent as unknown as Prisma.InputJsonValue,
    },
  });
  const canonical = mergedGlobal(record.publishedContent ?? record.draftContent);
  return {
    data: extractGlobalSettingsSlice(canonical, section),
    version: record.version,
    updatedAt: record.updatedAt.toISOString(),
    updatedBy: record.updatedBy,
  };
}

export async function saveAndPublishGlobalSettingsSlice<S extends GlobalSettingsSection>(input: {
  section: S;
  patch: GlobalSettingsSliceMap[S];
  actor: string;
  expectedVersion?: number;
}) {
  if (input.section === "branding") {
    const branding = input.patch as BrandingSettings;
    await Promise.all([
      verifyMediaReference(branding.logo, "logo"),
      verifyMediaReference(branding.favicon, "favicon"),
    ]);
  }

  const saved = await prisma.$transaction(async (tx) => {
    const record = await tx.sitePageContent.upsert({
      where: { slug: "global" },
      update: {},
      create: {
        slug: "global",
        draftContent: defaultGlobalContent as unknown as Prisma.InputJsonValue,
        publishedContent: defaultGlobalContent as unknown as Prisma.InputJsonValue,
      },
    });
    if (input.expectedVersion !== undefined && record.version !== input.expectedVersion) {
      throw Object.assign(new Error("Settings were updated by another administrator."), { name: "VERSION_CONFLICT" });
    }

    const nextDraft = applyGlobalSettingsSlice(mergedGlobal(record.draftContent), input.section, input.patch);
    const nextPublished = applyGlobalSettingsSlice(
      mergedGlobal(record.publishedContent ?? record.draftContent),
      input.section,
      input.patch,
    );
    const draftValidation = globalContentSchema.safeParse(nextDraft);
    const publishedValidation = globalContentSchema.safeParse(nextPublished);
    if (!draftValidation.success || !publishedValidation.success) {
      const error = !draftValidation.success ? draftValidation.error : publishedValidation.error;
      throw Object.assign(new Error("The complete global settings document is invalid."), {
        name: "GLOBAL_VALIDATION_ERROR", zodError: error,
      });
    }

    const result = await tx.sitePageContent.updateMany({
      where: { slug: "global", version: record.version },
      data: {
        draftContent: nextDraft as Prisma.InputJsonValue,
        publishedContent: nextPublished as Prisma.InputJsonValue,
        version: { increment: 1 },
        updatedBy: input.actor,
        publishedBy: input.actor,
        publishedAt: new Date(),
      },
    });
    if (result.count !== 1) {
      throw Object.assign(new Error("Settings were updated by another administrator."), { name: "VERSION_CONFLICT" });
    }
    return tx.sitePageContent.findUniqueOrThrow({ where: { slug: "global" } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  const canonical = mergedGlobal(saved.publishedContent ?? saved.draftContent);
  const data = extractGlobalSettingsSlice(canonical, input.section);
  const draftData = extractGlobalSettingsSlice(mergedGlobal(saved.draftContent), input.section);
  if (JSON.stringify(data) !== JSON.stringify(draftData)) {
    throw Object.assign(new Error("Draft and published settings do not match."), {
      name: "PERSISTENCE_VERIFICATION_FAILED",
    });
  }
  return {
    data,
    version: saved.version,
    updatedAt: saved.updatedAt.toISOString(),
    updatedBy: saved.updatedBy,
  };
}
