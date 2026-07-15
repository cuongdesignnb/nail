import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/db";
import { CONTENT_PAGE_KEYS, type ContentPageKey } from "../lib/content/content.types";
import { getDefaultContent } from "../lib/content/content-defaults";
import { normalizeMediaUrl } from "../lib/media/resolve-media";
import { getStorageAdapter } from "../lib/storage";

type Row = {
  result: "PASS" | "FAIL";
  page: string;
  section: string;
  fieldPath: string;
  mediaId?: string | null;
  src?: string;
  storage?: string;
  binding?: string;
  message: string;
};

const ROOT = process.cwd();
const rows: Row[] = [];
const references: Array<{ page: string; fieldPath: string; mediaId: string; src: string }> = [];
const forbidden = /^(?:blob:|data:|file:)|localhost|127\.0\.0\.1/i;

function report(row: Row) {
  rows.push(row);
  console.log([
    row.result,
    `Page=${row.page}`,
    `Section=${row.section}`,
    `Field=${row.fieldPath}`,
    `mediaId=${row.mediaId ?? "-"}`,
    `src=${row.src ?? "-"}`,
    `storage=${row.storage ?? "-"}`,
    `public=${row.binding ?? "-"}`,
    row.message,
  ].join(" | "));
}

function walkFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkFiles(fullPath);
    return /\.(ts|tsx)$/.test(entry.name) ? [fullPath] : [];
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMediaObject(value: unknown) {
  return isRecord(value) && typeof value.src === "string" && ("alt" in value || "mediaId" in value || "title" in value);
}

function inspectContent(value: unknown, hint: unknown, page: string, fieldPath: string) {
  if (isMediaObject(hint) && typeof value === "string") {
    report({ result: "FAIL", page, section: fieldPath.split(".")[0] || "root", fieldPath, src: value, storage: "unknown", message: "Legacy image string remains in an object MediaReference field." });
    return;
  }
  if (isMediaObject(value)) {
    const record = value as Record<string, unknown>;
    const src = String(record.src || "");
    const mediaId = typeof record.mediaId === "string" ? record.mediaId : null;
    const validSource = Boolean(src) && !forbidden.test(src);
    report({ result: validSource ? "PASS" : "FAIL", page, section: fieldPath.split(".")[0] || "root", fieldPath, mediaId, src, storage: "pending", message: validSource ? "Canonical MediaReference shape." : "MediaReference uses an empty or temporary URL." });
    if (mediaId) references.push({ page, fieldPath, mediaId, src });
  }
  if (Array.isArray(value)) {
    const hints = Array.isArray(hint) ? hint : [];
    value.forEach((item, index) => inspectContent(item, hints[index] ?? hints[0], page, `${fieldPath}.${index}`));
    return;
  }
  if (!isRecord(value)) return;
  const hintRecord = isRecord(hint) ? hint : {};
  Object.entries(value).forEach(([key, item]) => inspectContent(item, hintRecord[key], page, fieldPath ? `${fieldPath}.${key}` : key));
}

function auditPickerContracts() {
  const sourceFiles = [...walkFiles(path.join(ROOT, "components")), ...walkFiles(path.join(ROOT, "app"))];
  const objectEditorFiles = new Set([
    "AboutExpertsSectionEditor.tsx", "AboutSalonExperienceSectionEditor.tsx", "AboutStorySectionEditor.tsx",
    "GlobalBrandSectionEditor.tsx", "GlobalDefaultShareImageSectionEditor.tsx", "HeroSectionEditor.tsx",
    "HomeAboutPreviewSectionEditor.tsx", "PackagesBenefitsSectionEditor.tsx", "PackagesRewardsSectionEditor.tsx",
    "ServicesWhyChooseSectionEditor.tsx", "TestimonialsSectionEditor.tsx",
  ]);
  let count = 0;
  for (const file of sourceFiles) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of Array.from(source.matchAll(/<MediaPickerField\b[\s\S]*?\/>/g))) {
      count += 1;
      const block = match[0];
      const repoPath = path.relative(ROOT, file).replace(/\\/g, "/");
      const line = source.slice(0, match.index).split(/\r?\n/).length;
      const explicit = /valueMode=["'](?:url|reference)["']/.test(block);
      const objectModeCorrect = !objectEditorFiles.has(path.basename(file)) || /valueMode=["']reference["']/.test(block);
      report({ result: explicit && objectModeCorrect ? "PASS" : "FAIL", page: "source", section: "MediaPickerField", fieldPath: `${repoPath}:${line}`, message: explicit && objectModeCorrect ? "Explicit type-safe valueMode." : "Missing or incorrect valueMode for this image contract." });
    }
  }
  const pickerSource = fs.readFileSync(path.join(ROOT, "components/admin/media/MediaPickerField.tsx"), "utf8");
  report({ result: !/onChange:\s*\([^)]*:\s*any\)/.test(pickerSource) ? "PASS" : "FAIL", page: "source", section: "MediaPickerField", fieldPath: "props.onChange", message: "Picker callback contains no any contract." });
  report({ result: count > 0 ? "PASS" : "FAIL", page: "source", section: "MediaPickerField", fieldPath: "usage-count", message: `${count} picker usages audited.` });
}

function auditPublicBindings() {
  const checks: Array<[string, string[]]> = [
    ["components/home/HomeClient.tsx", ["homeContent", "normalizeMediaUrl"]],
    ["lib/services/about-content.service.ts", ["getPublishedContent(\"about\")"]],
    ["services/services-page.service.ts", ["getPublishedContent(\"services\")", "pageCopy.hero"]],
    ["services/gallery-page.service.ts", ["getPublishedContent(\"gallery\")"]],
    ["services/packages-page.service.ts", ["getPublishedContent(\"packages\")", "pageCopy.hero"]],
    ["app/(site)/promotions/page.tsx", ["getPublishedPromotionsPageContent", "normalizeMediaUrl"]],
    ["app/(site)/contact/page.tsx", ["getPublishedContactPageContent", "normalizeMediaUrl"]],
    ["services/blog-page.service.ts", ["getPublishedContent(\"blog\")", "pageCopy.hero"]],
    ["components/public/shell/BrandLogo.tsx", ["normalizeMediaUrl"]],
    ["lib/seo/seo.mapper.ts", ["normalizeMediaUrl"]],
  ];
  checks.forEach(([repoPath, tokens]) => {
    const fullPath = path.join(ROOT, repoPath);
    const source = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : "";
    const okay = tokens.every((token) => source.includes(token));
    report({ result: okay ? "PASS" : "FAIL", page: repoPath, section: "public-binding", fieldPath: tokens.join(", "), binding: okay ? "published" : "missing", message: okay ? "Public consumer uses canonical published media." : "Public published-media binding is incomplete." });
  });
}

async function auditDatabase() {
  const assets = await prisma.mediaAsset.findMany({ where: { isDeleted: false } });
  const byId = new Map(assets.map((asset) => [asset.id, asset]));
  const adapter = getStorageAdapter();
  const activeProvider = process.env.STORAGE_PROVIDER || "local";
  for (const asset of assets) {
    const storageKey = asset.storageKey || asset.fileName;
    let storage = "external";
    let exists = true;
    if (asset.url.startsWith("/") && !asset.url.startsWith("/uploads/")) {
      const staticPath = path.resolve(ROOT, "public", asset.url.replace(/^\/+/, ""));
      exists = fs.existsSync(staticPath);
      storage = exists ? "public-static-exists" : "public-static-missing";
    } else if (asset.provider !== "external") {
      if ((asset.provider || "local") !== activeProvider) {
        storage = `provider-mismatch:${asset.provider || "local"}`;
        exists = false;
      } else {
        try {
          exists = await adapter.exists(storageKey);
          storage = exists ? "exists" : "missing";
        } catch (error) {
          exists = false;
          storage = error instanceof Error ? error.message : "verification-failed";
        }
      }
    }
    const validUrl = Boolean(asset.url) && !forbidden.test(asset.url);
    report({ result: exists && validUrl ? "PASS" : "FAIL", page: "MediaAsset", section: asset.folder || "unfiled", fieldPath: asset.id, mediaId: asset.id, src: asset.url, storage, message: exists && validUrl ? "DB asset and storage object agree." : "MediaAsset storage or URL is invalid." });
  }

  const records = await prisma.sitePageContent.findMany({ where: { slug: { in: CONTENT_PAGE_KEYS } } });
  for (const pageKey of CONTENT_PAGE_KEYS) {
    const record = records.find((item) => item.slug === pageKey);
    if (!record) {
      report({ result: "FAIL", page: pageKey, section: "record", fieldPath: pageKey, message: "SitePageContent row is missing." });
      continue;
    }
    const defaults = getDefaultContent(pageKey);
    inspectContent(record.draftContent, defaults, `${pageKey}:draft`, "");
    inspectContent(record.publishedContent, defaults, `${pageKey}:published`, "");
  }

  for (const reference of references) {
    const asset = byId.get(reference.mediaId);
    const matches = Boolean(asset) && normalizeMediaUrl(asset!.url) === normalizeMediaUrl(reference.src);
    report({ result: matches ? "PASS" : "FAIL", page: reference.page, section: reference.fieldPath.split(".")[0] || "root", fieldPath: reference.fieldPath, mediaId: reference.mediaId, src: reference.src, storage: asset ? "resolved" : "missing-asset", message: matches ? "mediaId resolves to the same canonical URL." : "mediaId is missing or its URL does not match src." });
  }
}

async function main() {
  auditPickerContracts();
  auditPublicBindings();
  await auditDatabase();
  const failures = rows.filter((row) => row.result === "FAIL");
  console.log(`\n${failures.length ? "FAIL" : "PASS"} content-hub-media: ${rows.length - failures.length} passed, ${failures.length} failed.`);
  if (failures.length) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error("FAIL content-hub-media audit could not complete:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
