import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { defaultAboutContent } from "@/data/about.default";
import { AboutPageContent } from "@/types/about";

const slug = "about";
const entity = "SitePageContent:about";

function asAboutContent(value: unknown): AboutPageContent {
  return (value ?? defaultAboutContent) as AboutPageContent;
}

async function ensureAboutRecord() {
  return prisma.sitePageContent.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      draftContent: defaultAboutContent as unknown as Prisma.InputJsonValue,
      publishedContent: defaultAboutContent as unknown as Prisma.InputJsonValue
    }
  });
}

async function audit(action: string, actor: string) {
  await prisma.auditLog.create({
    data: { actor, action, entity }
  });
}

export async function getAboutContentForAdmin() {
  const record = await ensureAboutRecord();
  const draftContent = asAboutContent(record.draftContent);
  const publishedContent = asAboutContent(record.publishedContent);
  return {
    draftContent,
    publishedContent,
    meta: {
      version: record.version,
      updatedAt: record.updatedAt.toISOString(),
      publishedAt: record.publishedAt?.toISOString() ?? null,
      hasUnpublishedChanges: JSON.stringify(draftContent) !== JSON.stringify(publishedContent)
    }
  };
}

export async function getPublishedAboutContent() {
  const record = await ensureAboutRecord();
  return asAboutContent(record.publishedContent);
}

export async function getDraftAboutContent() {
  const record = await ensureAboutRecord();
  return asAboutContent(record.draftContent);
}

export async function saveAboutDraft(input: { content: AboutPageContent; version: number; actor: string }) {
  const record = await ensureAboutRecord();
  if (record.version !== input.version) {
    const error = new Error("VERSION_CONFLICT");
    error.name = "VERSION_CONFLICT";
    throw error;
  }
  const updated = await prisma.sitePageContent.update({
    where: { slug },
    data: {
      draftContent: input.content as unknown as Prisma.InputJsonValue,
      version: { increment: 1 },
      updatedBy: input.actor
    }
  });
  await audit("ABOUT_DRAFT_SAVED", input.actor);
  return updated;
}

export async function publishAboutDraft(input: { version: number; actor: string }) {
  const record = await ensureAboutRecord();
  if (record.version !== input.version) {
    const error = new Error("VERSION_CONFLICT");
    error.name = "VERSION_CONFLICT";
    throw error;
  }
  const updated = await prisma.sitePageContent.update({
    where: { slug },
    data: {
      publishedContent: record.draftContent as Prisma.InputJsonValue,
      publishedAt: new Date(),
      publishedBy: input.actor,
      version: { increment: 1 }
    }
  });
  await audit("ABOUT_PUBLISHED", input.actor);
  return updated;
}

export async function discardAboutDraft(actor: string) {
  const record = await ensureAboutRecord();
  const updated = await prisma.sitePageContent.update({
    where: { slug },
    data: {
      draftContent: (record.publishedContent ?? defaultAboutContent) as Prisma.InputJsonValue,
      version: { increment: 1 },
      updatedBy: actor
    }
  });
  await audit("ABOUT_DRAFT_DISCARDED", actor);
  return updated;
}

export async function restoreDefaultAboutDraft(actor: string) {
  const updated = await prisma.sitePageContent.update({
    where: { slug },
    data: {
      draftContent: defaultAboutContent as unknown as Prisma.InputJsonValue,
      version: { increment: 1 },
      updatedBy: actor
    }
  });
  await audit("ABOUT_DRAFT_RESTORED_DEFAULT", actor);
  return updated;
}
