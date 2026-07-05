import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import type { AiGeneratedArticle } from "./ai.types";

async function uniqueSlug(base: string, existingId?: string | null) {
  const normalized = slugify(base) || `ai-article-${Date.now()}`;
  let candidate = normalized;
  let suffix = 2;
  while (await prisma.blogPost.findFirst({ where: { slug: candidate, ...(existingId ? { NOT: { id: existingId } } : {}) } })) {
    candidate = `${normalized}-${suffix++}`;
  }
  return candidate;
}

function estimateReadTime(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export async function finalizeAiArticle(input: {
  jobId: string;
  article: AiGeneratedArticle;
  cover?: { mediaId: string; url: string } | null;
}) {
  const job = await prisma.aiContentJob.findUniqueOrThrow({ where: { id: input.jobId }, include: { batch: true } });
  if (job.blogPostId) return prisma.blogPost.findUniqueOrThrow({ where: { id: job.blogPostId } });

  const slug = await uniqueSlug(input.article.slug || input.article.title);
  const status = job.scheduledPublishAt ? "SCHEDULED" : "DRAFT";
  const post = await prisma.blogPost.create({
    data: {
      categoryId: job.categoryId || job.batch.categoryId || null,
      title: input.article.title,
      slug,
      excerpt: input.article.excerpt,
      content: input.article.bodyHtml,
      coverImage: input.cover?.url || null,
      coverImageAlt: input.article.coverImageAlt,
      coverMediaId: input.cover?.mediaId || null,
      authorName: "Aera Team",
      authorRole: "Nail Specialist",
      readTimeMinutes: estimateReadTime(input.article.bodyHtml),
      status,
      scheduledAt: job.scheduledPublishAt,
      seoTitle: input.article.metaTitle,
      seoDescription: input.article.metaDescription,
      seoKeywords: input.article.seoKeywords.join(", "),
      faqs: input.article.faq as any,
      aiGenerated: true,
      aiContentJobId: job.id,
      aiImagePrompt: input.article.imagePrompt,
      generatedLanguage: job.batch.outputLanguage,
      generationVersion: "ai-content-studio-v1",
    },
  });

  if (input.cover?.mediaId) {
    await prisma.mediaUsage.create({
      data: {
        mediaId: input.cover.mediaId,
        entityType: "BlogPost",
        entityId: post.id,
        fieldKey: "coverImage",
      },
    }).catch(() => undefined);
  }

  await prisma.aiContentJob.update({
    where: { id: job.id },
    data: {
      blogPostId: post.id,
      coverMediaId: input.cover?.mediaId || null,
      status: "completed",
      completedAt: new Date(),
      lockedAt: null,
      lockedBy: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actor: job.batch.requestedBy || "ai-content",
      action: status === "SCHEDULED" ? "AI_BLOG_POST_SCHEDULED" : "AI_BLOG_DRAFT_CREATED",
      entity: `BlogPost:${post.id}`,
      entityType: "BlogPost",
      entityId: post.id,
      details: { jobId: job.id, keyword: job.keyword },
    },
  }).catch(() => undefined);

  return post;
}
