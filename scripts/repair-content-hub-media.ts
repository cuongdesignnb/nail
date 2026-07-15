import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { CONTENT_PAGE_KEYS, type ContentPageKey } from "../lib/content/content.types";
import { normalizeMediaReferences } from "../lib/content/normalize-page-content";

const apply = process.argv.includes("--apply");
const backupConfirmed = process.argv.includes("--backup-confirmed");

function changedPaths(before: unknown, after: unknown, base = ""): string[] {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (!before || !after || typeof before !== "object" || typeof after !== "object") return [base || "root"];
  if (Array.isArray(before) || Array.isArray(after)) {
    const left = Array.isArray(before) ? before : [];
    const right = Array.isArray(after) ? after : [];
    return Array.from({ length: Math.max(left.length, right.length) }).flatMap((_, index) => changedPaths(left[index], right[index], `${base}.${index}`));
  }
  const left = before as Record<string, unknown>;
  const right = after as Record<string, unknown>;
  return Array.from(new Set([...Object.keys(left), ...Object.keys(right)])).flatMap((key) => changedPaths(left[key], right[key], base ? `${base}.${key}` : key));
}

async function main() {
  console.log(apply ? "APPLY mode requested." : "DRY RUN (default): no database writes will occur.");
  console.log("A verified production database backup is required before any --apply run.");
  if (apply && !backupConfirmed) throw new Error("Refusing --apply without --backup-confirmed.");

  const records = await prisma.sitePageContent.findMany({ where: { slug: { in: CONTENT_PAGE_KEYS } } });
  const changes = records.flatMap((record) => {
    const pageKey = record.slug as ContentPageKey;
    const draft = normalizeMediaReferences(record.draftContent as Record<string, unknown>, pageKey);
    const published = record.publishedContent
      ? normalizeMediaReferences(record.publishedContent as Record<string, unknown>, pageKey)
      : null;
    const draftPaths = changedPaths(record.draftContent, draft).map((item) => `draftContent.${item}`);
    const publishedPaths = changedPaths(record.publishedContent, published).map((item) => `publishedContent.${item}`);
    const paths = [...draftPaths, ...publishedPaths];
    return paths.length ? [{ id: record.id, pageKey, draft, published, paths }] : [];
  });

  changes.forEach((change) => console.log(`${change.pageKey}: ${change.paths.join(", ")}`));
  console.log(`${changes.length} SitePageContent row(s) require media-shape canonicalization.`);
  if (!apply || !changes.length) return;

  await prisma.$transaction(async (tx) => {
    for (const change of changes) {
      await tx.sitePageContent.update({
        where: { id: change.id },
        data: {
          draftContent: change.draft as Prisma.InputJsonValue,
          publishedContent: change.published as Prisma.InputJsonValue | undefined,
          version: { increment: 1 },
          updatedBy: "repair-content-hub-media",
        },
      });
      await tx.auditLog.create({
        data: {
          actor: "repair-content-hub-media",
          action: "CONTENT_MEDIA_CANONICALIZED",
          entity: `SitePageContent:${change.pageKey}`,
          entityType: "SitePageContent",
          entityId: change.id,
          performedBy: "repair-content-hub-media",
          details: { changedPaths: change.paths },
        },
      });
    }
  });
  console.log(`Applied canonical media shape to ${changes.length} row(s). No URLs or MediaAsset rows were deleted.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
