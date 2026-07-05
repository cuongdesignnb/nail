import { prisma } from "@/lib/db";
import { generateAiImage, generateAiText } from "./ai.client";
import { articleJsonSchema, buildArticleSystemPrompt, buildArticleUserPrompt } from "./ai-content-prompts";
import { validateGeneratedArticle } from "./ai-content-validator";
import { buildImagePrompt } from "./ai-image-prompt";
import { saveAiImageToMediaLibrary } from "./ai-image.service";
import { finalizeAiArticle } from "./ai-content-finalizer";
import { addAiJobEvent, claimNextAiJob } from "./ai-content-job.repository";

async function buildContext(categoryId?: string | null) {
  const [services, packages, links, category] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true }, take: 20, orderBy: { sortOrder: "asc" }, select: { name: true, priceLabel: true, durationMinutes: true } }),
    prisma.servicePackage.findMany({ where: { isActive: true }, take: 10, orderBy: { sortOrder: "asc" }, select: { name: true, priceLabel: true } }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, take: 10, orderBy: { publishedAt: "desc" }, select: { title: true, slug: true } }),
    categoryId ? prisma.blogCategory.findUnique({ where: { id: categoryId } }) : null,
  ]);
  return {
    services,
    packages,
    categoryName: category?.name,
    existingLinks: links.map((link) => ({ title: link.title, href: `/blog/${link.slug}` })),
  };
}

export async function runOneAiContentJob(workerId = `worker-${process.pid}`, jobId?: string) {
  const job = await claimNextAiJob(workerId, jobId);
  if (!job) return null;

  try {
    await addAiJobEvent(job.id, "VALIDATION_PASSED", "Job claimed and duplicate validation passed.");
    const context = await buildContext(job.categoryId || job.batch.categoryId);

    await prisma.aiContentJob.update({ where: { id: job.id }, data: { status: "generating_text" } });
    await addAiJobEvent(job.id, "TEXT_GENERATION_STARTED", "Generating article JSON.");
    const textResult = await generateAiText({
      model: job.textModel,
      systemPrompt: buildArticleSystemPrompt(),
      userPrompt: buildArticleUserPrompt({
        keyword: job.keyword,
        outputLanguage: job.batch.outputLanguage,
        tone: "luxury_editorial",
        targetWords: 1200,
        categoryName: context.categoryName,
        services: context.services,
        packages: context.packages,
        existingLinks: context.existingLinks,
      }),
      outputSchema: articleJsonSchema,
    });

    const article = validateGeneratedArticle(textResult.parsedJson);
    await prisma.aiContentJob.update({
      where: { id: job.id },
      data: {
        articleSnapshot: article as any,
        providerResponseId: textResult.providerResponseId,
        inputTokens: textResult.inputTokens,
        outputTokens: textResult.outputTokens,
        imagePrompt: article.imagePrompt,
      },
    });
    await addAiJobEvent(job.id, "TEXT_GENERATION_COMPLETED", "Article text generated.", textResult.rawUsage);

    let cover: { mediaId: string; url: string } | null = null;
    if (job.generateImage && job.imageModel) {
      await prisma.aiContentJob.update({ where: { id: job.id }, data: { status: "generating_image" } });
      await addAiJobEvent(job.id, "IMAGE_GENERATION_STARTED", "Generating cover image.");
      const prompt = buildImagePrompt({ keyword: job.keyword, articlePrompt: article.imagePrompt });
      const image = await generateAiImage({
        model: job.imageModel,
        prompt,
        size: "1536x1024",
        quality: "medium",
      });
      const asset = await saveAiImageToMediaLibrary({
        buffer: image.imageBuffer,
        jobId: job.id,
        keyword: job.keyword,
        alt: article.coverImageAlt,
        promptSummary: prompt,
      });
      cover = { mediaId: asset.id, url: asset.url };
      await prisma.aiContentJob.update({
        where: { id: job.id },
        data: {
          imageCount: 1,
          coverMediaId: asset.id,
          imageGenerationMeta: image.raw as any,
        },
      });
      await addAiJobEvent(job.id, "IMAGE_SAVED_TO_LIBRARY", "Cover image saved to Media Library.", { mediaId: asset.id });
    }

    await prisma.aiContentJob.update({ where: { id: job.id }, data: { status: "creating_draft" } });
    const post = await finalizeAiArticle({ jobId: job.id, article, cover });
    await addAiJobEvent(job.id, post.status === "SCHEDULED" ? "BLOG_POST_SCHEDULED" : "BLOG_DRAFT_CREATED", "Blog post created.", { blogPostId: post.id });
    return post;
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI job failed.";
    const current = await prisma.aiContentJob.findUnique({ where: { id: job.id } });
    const retrying = current && current.attemptCount < current.maxAttempts;
    await prisma.aiContentJob.update({
      where: { id: job.id },
      data: {
        status: retrying ? "retrying" : "failed",
        errorCode: "AI_JOB_FAILED",
        errorMessage: message.slice(0, 1000),
        failedAt: retrying ? null : new Date(),
        retryAfter: retrying ? new Date(Date.now() + 60_000) : null,
        lockedAt: null,
        lockedBy: null,
      },
    });
    await addAiJobEvent(job.id, retrying ? "JOB_RETRYING" : "JOB_FAILED", message);
    return null;
  }
}

export async function runAiContentJobs(limit = 1) {
  const results = [];
  for (let i = 0; i < limit; i++) {
    const result = await runOneAiContentJob();
    if (!result) break;
    results.push(result);
  }
  return results;
}
