-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "aiContentJobId" TEXT,
ADD COLUMN     "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiImagePrompt" TEXT,
ADD COLUMN     "coverMediaId" TEXT,
ADD COLUMN     "generatedLanguage" TEXT,
ADD COLUMN     "generationVersion" TEXT;

-- CreateTable
CREATE TABLE "AiProviderSetting" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "encryptedApiKey" TEXT,
    "apiKeyLastFour" TEXT,
    "apiKeyConfiguredAt" TIMESTAMP(3),
    "textModel" TEXT NOT NULL DEFAULT 'gpt-5.4-mini',
    "imageModel" TEXT NOT NULL DEFAULT 'gpt-image-2',
    "defaultOutputLanguage" TEXT NOT NULL DEFAULT 'en',
    "defaultArticleTone" TEXT NOT NULL DEFAULT 'luxury_editorial',
    "defaultArticleLength" INTEGER NOT NULL DEFAULT 1200,
    "defaultGenerateImage" BOOLEAN NOT NULL DEFAULT true,
    "defaultImageSize" TEXT NOT NULL DEFAULT '1536x1024',
    "defaultImageQuality" TEXT NOT NULL DEFAULT 'medium',
    "maxKeywordsPerBatch" INTEGER NOT NULL DEFAULT 30,
    "maxConcurrentJobs" INTEGER NOT NULL DEFAULT 1,
    "maxRetriesPerJob" INTEGER NOT NULL DEFAULT 2,
    "monthlyBudgetLimit" DECIMAL(65,30),
    "monthlyBudgetUsed" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "humanReviewRequired" BOOLEAN NOT NULL DEFAULT true,
    "autoScheduleEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastTestStatus" TEXT,
    "lastTestedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiProviderSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiContentBatch" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "rawKeywordInput" TEXT NOT NULL,
    "normalizedKeywords" JSONB NOT NULL,
    "outputLanguage" TEXT NOT NULL DEFAULT 'en',
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "generationMode" TEXT NOT NULL DEFAULT 'draft',
    "scheduleStartAt" TIMESTAMP(3),
    "scheduleIntervalHours" INTEGER,
    "timezone" TEXT,
    "generateImages" BOOLEAN NOT NULL DEFAULT true,
    "textModel" TEXT NOT NULL,
    "imageModel" TEXT,
    "requestedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiContentBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiContentJob" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "normalizedKeyword" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 2,
    "scheduledPublishAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "lockedBy" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "textModel" TEXT NOT NULL,
    "imageModel" TEXT,
    "generateImage" BOOLEAN NOT NULL DEFAULT true,
    "requestSnapshot" JSONB,
    "articleSnapshot" JSONB,
    "imagePrompt" TEXT,
    "imageGenerationMeta" JSONB,
    "blogPostId" TEXT,
    "coverMediaId" TEXT,
    "providerResponseId" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "imageCount" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" DECIMAL(65,30),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "retryAfter" TIMESTAMP(3),
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiContentJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiContentJobEvent" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiContentJobEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiProviderSetting_provider_key" ON "AiProviderSetting"("provider");

-- CreateIndex
CREATE INDEX "AiContentBatch_status_idx" ON "AiContentBatch"("status");

-- CreateIndex
CREATE INDEX "AiContentBatch_createdAt_idx" ON "AiContentBatch"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AiContentJob_blogPostId_key" ON "AiContentJob"("blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "AiContentJob_idempotencyKey_key" ON "AiContentJob"("idempotencyKey");

-- CreateIndex
CREATE INDEX "AiContentJob_status_scheduledPublishAt_idx" ON "AiContentJob"("status", "scheduledPublishAt");

-- CreateIndex
CREATE INDEX "AiContentJob_keyword_idx" ON "AiContentJob"("keyword");

-- CreateIndex
CREATE INDEX "AiContentJob_blogPostId_idx" ON "AiContentJob"("blogPostId");

-- CreateIndex
CREATE UNIQUE INDEX "AiContentJob_batchId_normalizedKeyword_key" ON "AiContentJob"("batchId", "normalizedKeyword");

-- CreateIndex
CREATE INDEX "AiContentJobEvent_jobId_createdAt_idx" ON "AiContentJobEvent"("jobId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_aiContentJobId_key" ON "BlogPost"("aiContentJobId");

-- AddForeignKey
ALTER TABLE "AiContentJob" ADD CONSTRAINT "AiContentJob_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "AiContentBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiContentJobEvent" ADD CONSTRAINT "AiContentJobEvent_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiContentJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
