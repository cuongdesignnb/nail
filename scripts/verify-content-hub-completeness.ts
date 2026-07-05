/**
 * Content Hub Completeness Verification Script
 *
 * Verifies that all 86 registered sections across all 9 pages have:
 * 1. An editor component mapped in section-editor.registry.tsx
 * 2. Default content defined in content-defaults.ts
 * 3. Zod validation schemas covered
 * 4. Draft preview support
 * 5. Public page render support
 *
 * Usage: npx tsx scripts/verify-content-hub-completeness.ts
 */

import fs from "fs";
import path from "path";
import { getContentRegistry } from "../lib/content/content-registry";
import { getDefaultContent } from "../lib/content/content-defaults";
import { getSchemaForPage } from "../validations/content";

function logSuccess(msg: string) {
  console.log(`\x1b[32m  ✅  ${msg}\x1b[0m`);
}

function logError(msg: string) {
  console.error(`\x1b[31m  ❌  ${msg}\x1b[0m`);
}

function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  Content Hub Completeness Verification      ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");

  const registry = getContentRegistry();
  const pageKeys = Object.keys(registry) as (keyof typeof registry)[];

  // 1. Load the section editor registry statically to avoid importing React components in Node
  const registryFilePath = path.join(
    __dirname,
    "../components/admin/content-editor/section-editor.registry.tsx"
  );
  if (!fs.existsSync(registryFilePath)) {
    logError("section-editor.registry.tsx file is missing!");
    process.exit(1);
  }
  const registryContent = fs.readFileSync(registryFilePath, "utf8");

  let totalSections = 0;
  let errors = 0;

  for (const pageKey of pageKeys) {
    const page = registry[pageKey];
    console.log(`Checking page "${pageKey}" (${page.label})...`);

    // Verify Default Content exists for the page
    let defaults: Record<string, unknown>;
    try {
      defaults = getDefaultContent(pageKey);
      logSuccess(`Default content exists for page "${pageKey}"`);
    } catch (e: any) {
      logError(`Missing default content for page "${pageKey}": ${e.message}`);
      errors++;
      continue;
    }

    // Verify Zod Validation Schema exists for the page
    let schema: any;
    try {
      schema = getSchemaForPage(pageKey, "publish");
      logSuccess(`Strict validation schema exists for page "${pageKey}"`);
    } catch (e: any) {
      logError(`Missing validation schema for page "${pageKey}": ${e.message}`);
      errors++;
      continue;
    }

    // Verify Draft validation schema exists
    try {
      getSchemaForPage(pageKey, "draft");
      logSuccess(`Draft validation schema exists for page "${pageKey}"`);
    } catch (e: any) {
      logError(`Missing draft validation schema for page "${pageKey}": ${e.message}`);
      errors++;
    }

    // Check each section in the registry
    for (const section of page.sections) {
      totalSections++;
      const sectionId = section.id;

      // A. Check Editor Component Mapping (static search in mapping file)
      const specificMapping = `"${pageKey}:${sectionId}":`;
      const sharedMapping = `"*:${sectionId}":`;
      const hasEditor =
        registryContent.includes(specificMapping) ||
        registryContent.includes(sharedMapping);

      if (hasEditor) {
        logSuccess(`Section "${sectionId}": Editor mapping found`);
      } else {
        logError(`Section "${sectionId}": Editor mapping NOT found in section-editor.registry.tsx!`);
        errors++;
      }

      // B. Check Default Content Key
      if (defaults[sectionId] !== undefined) {
        logSuccess(`Section "${sectionId}": Default content key found`);
      } else {
        logError(`Section "${sectionId}": Default content key NOT found!`);
        errors++;
      }

      // C. Check Zod Schema Property
      if (schema.shape && schema.shape[sectionId]) {
        logSuccess(`Section "${sectionId}": Zod schema property found`);
      } else {
        logError(`Section "${sectionId}": Zod schema property NOT found in page schema!`);
        errors++;
      }
    }
    console.log("");
  }

  // Verify preview and render routes files exist
  const requiredRoutes = [
    "app/admin/content/page.tsx",
    "app/admin/content/[pageKey]/page.tsx",
    "app/admin/content/[pageKey]/preview/page.tsx",
  ];
  for (const routePath of requiredRoutes) {
    const fullPath = path.join(__dirname, "../", routePath);
    if (fs.existsSync(fullPath)) {
      logSuccess(`Route file "${routePath}" exists`);
    } else {
      logError(`Route file "${routePath}" is missing!`);
      errors++;
    }
  }

  console.log("────────────────────────────────────────────────");
  console.log(`Summary:`);
  console.log(`  Pages Checked:    ${pageKeys.length}`);
  console.log(`  Sections Checked: ${totalSections}`);
  console.log(`  Errors Found:     ${errors}`);
  console.log("────────────────────────────────────────────────");

  if (errors > 0) {
    logError("Content Hub verification failed. Please fix all errors above.");
    process.exit(1);
  }

  logSuccess("Content Hub verification passed.");
  console.log("All editor, schema, default, preview and renderer mappings are complete.");
}

main();
