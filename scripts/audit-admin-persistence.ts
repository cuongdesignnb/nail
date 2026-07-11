import { prisma } from "../lib/db";

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
  const [global, gallery, business, items, categories, collections] = await Promise.all([
    prisma.sitePageContent.findUnique({ where: { slug: "global" } }),
    prisma.sitePageContent.findUnique({ where: { slug: "gallery" } }),
    prisma.businessSetting.findUnique({ where: { key: "default" } }),
    prisma.galleryItem.findMany({ select: { id: true, slug: true, categoryId: true, image: true, isActive: true } }),
    prisma.galleryCategory.findMany({ select: { id: true, slug: true } }),
    prisma.galleryCollection.findMany({ select: { id: true, slug: true, image: true } }),
  ]);

  report(global ? "PASS" : "FAIL", "SitePageContent.global exists");
  report(gallery ? "PASS" : "FAIL", "SitePageContent.gallery exists");
  report(business ? "PASS" : "FAIL", "BusinessSetting.default exists");
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
}

main()
  .catch((error) => {
    report("FAIL", `Audit could not query the database: ${error instanceof Error ? error.message : "unknown error"}`);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (failed) process.exitCode = 1;
  });
