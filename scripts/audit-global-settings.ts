import { prisma } from "../lib/db";
import { globalContentSchema } from "../validations/content/global.schema";
import { changedGlobalPaths, normalizeGlobalContent } from "../lib/settings/normalize-global-content";
import { zodFieldErrors } from "../lib/settings/settings-validation-errors";

function reportValidation(label: string, value: unknown) {
  const result = globalContentSchema.safeParse(value);
  console.log(`${label}_VALID: ${result.success}`);
  if (!result.success) {
    console.log(`${label}_ISSUES:`);
    for (const [path, messages] of Object.entries(zodFieldErrors(result.error))) {
      for (const message of messages) console.log(`- ${path}: ${message}`);
    }
  }
  return result;
}

async function main() {
  const record = await prisma.sitePageContent.findUnique({ where: { slug: "global" } });
  if (!record) throw new Error("SitePageContent.global does not exist.");

  reportValidation("RAW_DRAFT", record.draftContent);
  reportValidation("RAW_PUBLISHED", record.publishedContent ?? record.draftContent);

  const normalizedDraft = normalizeGlobalContent(record.draftContent);
  const normalizedPublished = normalizeGlobalContent(record.publishedContent ?? record.draftContent);
  const draftResult = reportValidation("NORMALIZED_DRAFT", normalizedDraft);
  const publishedResult = reportValidation("NORMALIZED_PUBLISHED", normalizedPublished);
  const canonicalDraft = draftResult.success ? draftResult.data : normalizedDraft;
  const canonicalPublished = publishedResult.success ? publishedResult.data : normalizedPublished;
  const changed = Array.from(new Set([
    ...changedGlobalPaths(record.draftContent, canonicalDraft),
    ...changedGlobalPaths(record.publishedContent ?? record.draftContent, canonicalPublished),
  ])).sort();
  console.log("NORMALIZED_CHANGED_PATHS:");
  if (!changed.length) console.log("- none");
  else for (const path of changed) console.log(`- ${path}`);

  if (!draftResult.success || !publishedResult.success) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
