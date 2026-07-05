import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/db";

const root = process.cwd();
const candidates = ["public/aera-mark.svg"].filter((file) => fs.existsSync(path.join(root, file)));

async function main() {
  const chosen = candidates[0];
  if (!chosen) throw new Error("No existing brand logo file found in public/.");

  const publicUrl = `/${path.relative(path.join(root, "public"), path.join(root, chosen)).replace(/\\/g, "/")}`;
  const stat = fs.statSync(path.join(root, chosen));
  const fileName = path.basename(chosen);
  const mimeType = fileName.endsWith(".svg") ? "image/svg+xml" : "image/png";

  const existing = await prisma.mediaAsset.findFirst({ where: { url: publicUrl, isDeleted: false } });
  const asset = existing
    ? await prisma.mediaAsset.update({
        where: { id: existing.id },
        data: {
          alt: "Aera Nail Lounge logo",
          title: "Aera Nail Lounge logo",
          folder: "brand",
          provider: "local",
        },
      })
    : await prisma.mediaAsset.create({
      data: {
      fileName,
      originalName: fileName,
      url: publicUrl,
      mimeType,
      originalMimeType: mimeType,
      size: stat.size,
      alt: "Aera Nail Lounge logo",
      title: "Aera Nail Lounge logo",
      folder: "brand",
      provider: "local",
      uploadedBy: "system",
    },
  });

  const globalContent = await prisma.sitePageContent.findUnique({ where: { slug: "global" } });
  if (globalContent) {
    const draft = (globalContent.draftContent && typeof globalContent.draftContent === "object" ? globalContent.draftContent : {}) as Record<string, any>;
    const published = (globalContent.publishedContent && typeof globalContent.publishedContent === "object" ? globalContent.publishedContent : null) as Record<string, any> | null;
    const logo = {
      mediaId: asset.id,
      src: asset.url,
      alt: asset.alt || "Aera Nail Lounge logo",
    };
    await prisma.sitePageContent.update({
      where: { slug: "global" },
      data: {
        draftContent: {
          ...draft,
          brand: {
            ...(draft.brand || {}),
            name: draft.brand?.name || "Aera Nail Lounge",
            logo,
          },
        },
        publishedContent: published
          ? {
              ...published,
              brand: {
                ...(published.brand || {}),
                name: published.brand?.name || "Aera Nail Lounge",
                logo,
              },
            }
          : undefined,
      },
    });
  }

  await prisma.mediaUsage.upsert({
    where: {
      mediaId_entityType_entityId_fieldKey: {
        mediaId: asset.id,
        entityType: "SitePageContent",
        entityId: "global",
        fieldKey: "brand.logo",
      },
    },
    update: {},
    create: {
      mediaId: asset.id,
      entityType: "SitePageContent",
      entityId: "global",
      fieldKey: "brand.logo",
    },
  });

  const report = {
    generatedAt: new Date().toISOString(),
    selectedLogo: publicUrl,
    mediaId: asset.id,
    mediaUsage: "SitePageContent:global:brand.logo",
  };
  fs.mkdirSync(path.join(root, "reports"), { recursive: true });
  fs.writeFileSync(path.join(root, "reports/brand-logo-migration.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(root, "reports/brand-logo-migration.md"), `# Brand Logo Migration\n\nSelected logo: ${publicUrl}\n\nMedia asset: ${asset.id}\n`);
  console.log(`Brand logo migration completed: ${publicUrl}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
