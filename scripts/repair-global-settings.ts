import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { globalContentSchema } from "../validations/content/global.schema";
import { changedGlobalPaths, normalizeGlobalContent } from "../lib/settings/normalize-global-content";
import { zodFieldErrors } from "../lib/settings/settings-validation-errors";

function hash(value: unknown) {
  function stable(input: unknown): unknown {
    if (Array.isArray(input)) return input.map(stable);
    if (input && typeof input === "object") {
      return Object.fromEntries(
        Object.entries(input as Record<string, unknown>)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, nested]) => [key, stable(nested)]),
      );
    }
    return input;
  }
  return createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}

function requireValid(label: string, value: unknown) {
  const result = globalContentSchema.safeParse(value);
  if (!result.success) {
    console.error(`${label}_INVALID`);
    for (const [path, messages] of Object.entries(zodFieldErrors(result.error))) {
      for (const message of messages) console.error(`- ${path}: ${message}`);
    }
    throw new Error(`${label} remains invalid after normalization.`);
  }
  return result.data;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const unknownFlag = process.argv.slice(2).find((arg) => !["--apply", "--dry-run"].includes(arg));
  if (unknownFlag) throw new Error(`Unknown option: ${unknownFlag}`);

  const record = await prisma.sitePageContent.findUnique({ where: { slug: "global" } });
  if (!record) throw new Error("SitePageContent.global does not exist.");
  const rawPublished = record.publishedContent ?? record.draftContent;
  const normalizedDraft = requireValid("NORMALIZED_DRAFT", normalizeGlobalContent(record.draftContent));
  const normalizedPublished = requireValid("NORMALIZED_PUBLISHED", normalizeGlobalContent(rawPublished));
  const changedPaths = Array.from(new Set([
    ...changedGlobalPaths(record.draftContent, normalizedDraft),
    ...changedGlobalPaths(rawPublished, normalizedPublished),
  ])).sort();
  const beforeHashes = { draft: hash(record.draftContent), published: hash(rawPublished) };
  const afterHashes = { draft: hash(normalizedDraft), published: hash(normalizedPublished) };

  console.log(`MODE: ${apply ? "APPLY" : "DRY_RUN"}`);
  console.log(`VERSION: ${record.version}`);
  console.log(`BEFORE_DRAFT_SHA256: ${beforeHashes.draft}`);
  console.log(`BEFORE_PUBLISHED_SHA256: ${beforeHashes.published}`);
  console.log(`AFTER_DRAFT_SHA256: ${afterHashes.draft}`);
  console.log(`AFTER_PUBLISHED_SHA256: ${afterHashes.published}`);
  console.log("CHANGED_PATHS:");
  if (!changedPaths.length) console.log("- none");
  else for (const path of changedPaths) console.log(`- ${path}`);
  if (!apply) {
    console.log("No database changes were made. Re-run with --apply only after a verified backup.");
    return;
  }
  if (!changedPaths.length) {
    console.log("No semantic changes are required; database version was not incremented.");
    return;
  }

  const actor = process.env.GLOBAL_SETTINGS_REPAIR_ACTOR || "settings-repair-script";
  await prisma.$transaction(async (tx) => {
    const updated = await tx.sitePageContent.updateMany({
      where: { id: record.id, version: record.version },
      data: {
        draftContent: normalizedDraft as Prisma.InputJsonValue,
        publishedContent: normalizedPublished as Prisma.InputJsonValue,
        version: { increment: 1 },
        publishedAt: new Date(),
      },
    });
    if (updated.count !== 1) throw new Error("Global settings changed during repair; no repair was applied.");
    await tx.auditLog.create({
      data: {
        actor,
        action: "REPAIR_GLOBAL_SETTINGS",
        entity: "SitePageContent:global",
        entityType: "SitePageContent",
        entityId: record.id,
        performedBy: actor,
        details: { beforeHashes, afterHashes, changedPaths, previousVersion: record.version },
      },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  console.log("Global settings repair committed atomically and recorded in AuditLog.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
