import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { parseKeywordInput } from "@/lib/utils/text-normalization";
import { getOrCreateAiSettings, serializeAiSettings } from "./ai-settings.service";
import { AI_TERMINAL_JOB_STATUSES } from "./ai.constants";

export async function inspectKeywordDuplicates(rawKeywordInput: string) {
  const parsed = parseKeywordInput(rawKeywordInput);
  const rows = await Promise.all(
    parsed.keywords.map(async (item) => {
      const slug = slugify(item.keyword);
      const existingPost = await prisma.blogPost.findFirst({
        where: {
          OR: [
            { slug },
            { title: { equals: item.keyword, mode: "insensitive" } },
            { seoKeywords: { contains: item.keyword, mode: "insensitive" } },
          ],
        },
        select: { id: true, title: true, slug: true, status: true },
      });
      const pendingJob = await prisma.aiContentJob.findFirst({
        where: {
          normalizedKeyword: item.normalizedKeyword,
          status: { notIn: [...AI_TERMINAL_JOB_STATUSES] },
        },
        select: { id: true, status: true, blogPostId: true },
      });
      return { ...item, slug, existingPost, pendingJob };
    })
  );

  return { ...parsed, rows };
}

export async function createAiContentBatch(input: {
  rawKeywordInput: string;
  categoryId?: string | null;
  generationMode: "draft" | "schedule";
  scheduleStartAt?: Date | null;
  scheduleIntervalHours?: number | null;
  timezone?: string | null;
  generateImages?: boolean;
  outputLanguage?: string;
  textModel?: string;
  imageModel?: string;
  requestedBy?: string;
}) {
  const settings = await getOrCreateAiSettings();
  if (!settings.isEnabled || !settings.encryptedApiKey) {
    throw new Error("AI Content Studio is not enabled or configured.");
  }

  const inspected = await inspectKeywordDuplicates(input.rawKeywordInput);
  const safeRows = inspected.rows.slice(0, settings.maxKeywordsPerBatch);
  if (safeRows.length === 0) throw new Error("Enter at least one valid keyword.");

  return prisma.$transaction(async (tx) => {
    const batch = await tx.aiContentBatch.create({
      data: {
        rawKeywordInput: input.rawKeywordInput,
        normalizedKeywords: safeRows.map((row) => row.normalizedKeyword),
        outputLanguage: input.outputLanguage || settings.defaultOutputLanguage,
        categoryId: input.categoryId || null,
        status: "queued",
        generationMode: settings.humanReviewRequired ? "draft" : input.generationMode,
        scheduleStartAt: input.scheduleStartAt || null,
        scheduleIntervalHours: input.scheduleIntervalHours || null,
        timezone: input.timezone || null,
        generateImages: input.generateImages ?? settings.defaultGenerateImage,
        textModel: input.textModel || settings.textModel,
        imageModel: input.generateImages === false ? null : input.imageModel || settings.imageModel,
        requestedBy: input.requestedBy,
      },
    });

    for (let index = 0; index < safeRows.length; index++) {
      const row = safeRows[index];
      const scheduledPublishAt =
        input.generationMode === "schedule" && !settings.humanReviewRequired && input.scheduleStartAt
          ? new Date(input.scheduleStartAt.getTime() + (input.scheduleIntervalHours || 24) * index * 60 * 60 * 1000)
          : null;
      const duplicateStatus = row.existingPost ? "skipped_duplicate" : row.pendingJob ? "skipped_duplicate" : "queued";
      const job = await tx.aiContentJob.create({
        data: {
          batchId: batch.id,
          keyword: row.keyword,
          normalizedKeyword: row.normalizedKeyword,
          sortOrder: index,
          categoryId: input.categoryId || null,
          status: duplicateStatus,
          scheduledPublishAt,
          textModel: input.textModel || settings.textModel,
          imageModel: input.generateImages === false ? null : input.imageModel || settings.imageModel,
          generateImage: input.generateImages ?? settings.defaultGenerateImage,
          maxAttempts: settings.maxRetriesPerJob,
          idempotencyKey: `${batch.id}:${row.normalizedKeyword}`,
          requestSnapshot: { duplicate: { existingPost: row.existingPost, pendingJob: row.pendingJob } },
        },
      });
      await tx.aiContentJobEvent.create({
        data: {
          jobId: job.id,
          eventType: duplicateStatus === "queued" ? "JOB_CREATED" : "DUPLICATE_SKIPPED",
          message: duplicateStatus === "queued" ? "AI content job queued." : "Keyword skipped because it appears to duplicate existing content.",
          metadata: { existingPost: row.existingPost, pendingJob: row.pendingJob },
        },
      });
    }

    return tx.aiContentBatch.findUniqueOrThrow({
      where: { id: batch.id },
      include: { jobs: { orderBy: { sortOrder: "asc" } } },
    });
  });
}

export async function getAiContentDashboard() {
  const [batches, jobs, categories, settings] = await Promise.all([
    prisma.aiContentBatch.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { jobs: true } }),
    prisma.aiContentJob.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { events: { orderBy: { createdAt: "desc" }, take: 5 } } }),
    prisma.blogCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    getOrCreateAiSettings(),
  ]);
  return { batches, jobs, categories, settings: serializeAiSettings(settings) };
}
