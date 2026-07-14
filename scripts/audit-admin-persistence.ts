import { prisma } from "../lib/db";
import { serializePayPalConfig } from "../lib/payments/paypal/paypal.config";
import { serializeAiSettings } from "../lib/ai/ai-settings.service";
import { getPublicSmtpSettings } from "../lib/email/smtp-config.service";

let failed = false;
function report(level: "PASS" | "WARN" | "FAIL", message: string) {
  if (level === "FAIL") failed = true;
  console.log(`${level} ${message}`);
}

function unsafeMediaUrl(url: string) {
  const value = url.toLowerCase();
  return value.startsWith("blob:") || value.includes("localhost") || value.includes("127.0.0.1") || value.includes("/tmp/") || value.includes("\\temp\\");
}

async function main() {
  const [global, gallery, business, items, categories, collections, paypal, ai, seo, smtp] = await Promise.all([
    prisma.sitePageContent.findUnique({ where: { slug: "global" } }),
    prisma.sitePageContent.findUnique({ where: { slug: "gallery" } }),
    prisma.businessSetting.findUnique({ where: { key: "default" } }),
    prisma.galleryItem.findMany({ select: { id: true, slug: true, categoryId: true, image: true, isActive: true } }),
    prisma.galleryCategory.findMany({ select: { id: true, slug: true } }),
    prisma.galleryCollection.findMany({ select: { id: true, slug: true, image: true } }),
    prisma.paymentGatewayConfig.findUnique({ where: { provider: "paypal" } }),
    prisma.aiProviderSetting.findUnique({ where: { provider: "openai" } }),
    prisma.seoSiteSetting.findUnique({ where: { key: "default" } }),
    getPublicSmtpSettings(),
  ]);

  report(global ? "PASS" : "FAIL", "SitePageContent.global exists");
  report(gallery ? "PASS" : "FAIL", "SitePageContent.gallery exists");
  report(business ? "PASS" : "FAIL", "BusinessSetting.default exists");
  report(paypal ? "PASS" : "FAIL", "PaymentGatewayConfig.paypal exists");
  report(ai ? "PASS" : "FAIL", "AiProviderSetting.openai exists");
  report(seo ? "PASS" : "FAIL", "SeoSiteSetting.default exists");
  report("PASS", `Gallery Items count: ${items.length}`);
  report("PASS", `Gallery Categories count: ${categories.length}`);
  report("PASS", `Gallery Collections count: ${collections.length}`);

  for (const [label, rows] of [["GalleryItem", items], ["GalleryCategory", categories], ["GalleryCollection", collections]] as const) {
    const duplicates = rows.map((row) => row.slug).filter((slug, index, all) => all.indexOf(slug) !== index);
    report(duplicates.length ? "FAIL" : "PASS", `${label} duplicate slugs: ${duplicates.length ? Array.from(new Set(duplicates)).join(", ") : "none"}`);
  }

  const categoryIds = new Set(categories.map((category) => category.id));
  const broken = items.filter((item) => item.categoryId && !categoryIds.has(item.categoryId));
  report(broken.length ? "FAIL" : "PASS", `Broken gallery category references: ${broken.length}`);

  const emptyImages = items.filter((item) => item.isActive && !item.image.trim());
  report(emptyImages.length ? "FAIL" : "PASS", `Active gallery items with empty image: ${emptyImages.length}`);

  const urls = [...items.map((item) => item.image), ...collections.map((collection) => collection.image)];
  const unsafe = urls.filter(unsafeMediaUrl);
  report(unsafe.length ? "FAIL" : "PASS", `Temporary or local media URLs: ${unsafe.length}`);

  if (global) {
    const draft = global.draftContent as Record<string, any>;
    const published = global.publishedContent as Record<string, any> | null;
    for (const path of ["brand", "defaultContact", "businessHours", "bookingPolicies"] as const) {
      const matches = JSON.stringify(draft?.[path] ?? null) === JSON.stringify(published?.[path] ?? null);
      report(matches ? "PASS" : "FAIL", `Global draft/published ${path} match`);
    }
    for (const field of ["logo", "favicon"] as const) {
      const reference = published?.brand?.[field];
      if (!reference?.mediaId) continue;
      const asset = await prisma.mediaAsset.findFirst({ where: { id: reference.mediaId, isDeleted: false }, select: { url: true } });
      report(asset?.url === reference.src ? "PASS" : "FAIL", `${field} mediaId resolves to canonical URL`);
    }
  }

  const safeResponses = JSON.stringify({
    paypal: paypal ? serializePayPalConfig(paypal) : null,
    ai: ai ? serializeAiSettings(ai) : null,
    smtp,
  });
  for (const secretName of ["encryptedClientSecret", "encryptedApiKey", "encryptedPassword", "APP_SECRETS_ENCRYPTION_KEY"]) {
    report(!safeResponses.includes(secretName) ? "PASS" : "FAIL", `${secretName} is absent from safe Settings responses`);
  }
}

main()
  .catch((error) => {
    report("FAIL", `Audit could not query the database: ${error instanceof Error ? error.message : "unknown error"}`);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (failed) process.exitCode = 1;
  });
