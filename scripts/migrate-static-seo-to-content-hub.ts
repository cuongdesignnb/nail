import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/db";
import { STATIC_SEO_PAGE_KEYS } from "@/lib/seo/seo.constants";

const reportsDir = path.join(process.cwd(), "reports");
fs.mkdirSync(reportsDir, { recursive: true });

function asRecord(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value) ? { ...(value as Record<string, any>) } : {};
}

function mergeSeo(target: Record<string, any>, legacy: any) {
  const existing = asRecord(target.seo);
  const migrated: string[] = [];
  const preserved: string[] = [];

  const map: Array<[string, any]> = [
    ["title", legacy.title],
    ["description", legacy.description],
    ["focusKeyphrase", legacy.focusKeyphrase],
    ["keywords", legacy.keywords ? String(legacy.keywords).split(",").map((item) => item.trim()).filter(Boolean) : undefined],
    ["canonicalUrl", legacy.canonicalPath],
    ["robotsDirective", legacy.robots],
    ["ogTitle", legacy.ogTitle],
    ["ogDescription", legacy.ogDescription],
    ["twitterCard", legacy.twitterCard],
    ["structuredData", legacy.schemaJson],
  ];

  for (const [key, value] of map) {
    if (value === undefined || value === null || value === "") continue;
    if (existing[key]) {
      preserved.push(key);
      continue;
    }
    existing[key] = value;
    migrated.push(key);
  }

  if (legacy.ogImage && !existing.ogImage) {
    existing.ogImage = {
      mediaId: legacy.ogImageMediaId || null,
      src: legacy.ogImage,
      alt: legacy.ogImageAlt || legacy.ogTitle || legacy.title || "Open Graph image",
    };
    migrated.push("ogImage");
  } else if (legacy.ogImage) {
    preserved.push("ogImage");
  }

  return { next: { ...target, seo: existing }, migrated, preserved };
}

async function main() {
  const report: any[] = [];
  const legacyRecords = await prisma.seoMetadata.findMany({
    where: { scopeKey: { in: STATIC_SEO_PAGE_KEYS } },
  });

  for (const legacy of legacyRecords) {
    const page = await prisma.sitePageContent.findUnique({ where: { slug: legacy.scopeKey } });
    if (!page) {
      report.push({
        pageKey: legacy.scopeKey,
        legacyScopeKey: legacy.scopeKey,
        migratedFields: [],
        existingContentHubFieldsPreserved: [],
        mediaAssetResolved: false,
        conflictWarnings: ["Matching SitePageContent record not found."],
        removedLegacyRecord: false,
      });
      continue;
    }

    const draft = mergeSeo(asRecord(page.draftContent), legacy);
    const published = page.publishedContent ? mergeSeo(asRecord(page.publishedContent), legacy) : null;
    const conflicts = [...draft.preserved, ...(published?.preserved || [])];

    await prisma.sitePageContent.update({
      where: { id: page.id },
      data: {
        draftContent: draft.next as any,
        publishedContent: (published?.next ?? page.publishedContent ?? undefined) as any,
      },
    });

    if (conflicts.length === 0) {
      await prisma.seoMetadata.delete({ where: { id: legacy.id } });
    }

    report.push({
      pageKey: legacy.scopeKey,
      legacyScopeKey: legacy.scopeKey,
      migratedFields: Array.from(new Set([...draft.migrated, ...(published?.migrated || [])])),
      existingContentHubFieldsPreserved: Array.from(new Set(conflicts)),
      mediaAssetResolved: Boolean(legacy.ogImageMediaId),
      conflictWarnings: conflicts.length ? [`Preserved existing Content Hub fields: ${conflicts.join(", ")}`] : [],
      removedLegacyRecord: conflicts.length === 0,
    });
  }

  fs.writeFileSync(path.join(reportsDir, "static-seo-migration.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(
    path.join(reportsDir, "static-seo-migration.md"),
    `# Static SEO Migration\n\n${report.map((row) => `- ${row.pageKey}: migrated ${row.migratedFields.length} field(s); removed legacy record: ${row.removedLegacyRecord}`).join("\n")}\n`,
  );
  console.log(`Static SEO migration complete. ${report.length} record(s) processed.`);
}

main().finally(() => prisma.$disconnect());
