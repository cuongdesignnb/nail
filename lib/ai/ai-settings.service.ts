import { prisma } from "@/lib/db";
import { AI_DEFAULTS, AI_PROVIDER } from "./ai.constants";
import { decryptSecret, encryptSecret, lastFour } from "./ai-crypto";

export async function getOrCreateAiSettings() {
  return prisma.aiProviderSetting.upsert({
    where: { provider: AI_PROVIDER },
    update: {},
    create: {
      provider: AI_PROVIDER,
      textModel: AI_DEFAULTS.textModel,
      imageModel: AI_DEFAULTS.imageModel,
      defaultOutputLanguage: AI_DEFAULTS.outputLanguage,
      defaultArticleTone: AI_DEFAULTS.tone,
      defaultArticleLength: AI_DEFAULTS.articleLength,
      defaultImageSize: AI_DEFAULTS.imageSize,
      defaultImageQuality: AI_DEFAULTS.imageQuality,
      maxKeywordsPerBatch: AI_DEFAULTS.maxKeywordsPerBatch,
      maxRetriesPerJob: AI_DEFAULTS.maxRetriesPerJob,
    },
  });
}

export function serializeAiSettings(settings: Awaited<ReturnType<typeof getOrCreateAiSettings>>) {
  return {
    provider: settings.provider,
    isEnabled: settings.isEnabled,
    apiKeyConfigured: Boolean(settings.encryptedApiKey),
    apiKeyLastFour: settings.apiKeyLastFour,
    apiKeyConfiguredAt: settings.apiKeyConfiguredAt?.toISOString() ?? null,
    textModel: settings.textModel,
    imageModel: settings.imageModel,
    defaultOutputLanguage: settings.defaultOutputLanguage,
    defaultArticleTone: settings.defaultArticleTone,
    defaultArticleLength: settings.defaultArticleLength,
    defaultGenerateImage: settings.defaultGenerateImage,
    defaultImageSize: settings.defaultImageSize,
    defaultImageQuality: settings.defaultImageQuality,
    maxKeywordsPerBatch: settings.maxKeywordsPerBatch,
    maxConcurrentJobs: settings.maxConcurrentJobs,
    maxRetriesPerJob: settings.maxRetriesPerJob,
    monthlyBudgetLimit: settings.monthlyBudgetLimit ? Number(settings.monthlyBudgetLimit) : null,
    monthlyBudgetUsed: Number(settings.monthlyBudgetUsed),
    humanReviewRequired: settings.humanReviewRequired,
    autoScheduleEnabled: settings.autoScheduleEnabled,
    lastTestStatus: settings.lastTestStatus,
    lastTestedAt: settings.lastTestedAt?.toISOString() ?? null,
  };
}

export async function updateAiSettings(input: {
  isEnabled?: boolean;
  apiKey?: string;
  textModel?: string;
  imageModel?: string;
  defaultOutputLanguage?: string;
  defaultArticleTone?: string;
  defaultArticleLength?: number;
  defaultGenerateImage?: boolean;
  defaultImageSize?: string;
  defaultImageQuality?: string;
  maxKeywordsPerBatch?: number;
  maxConcurrentJobs?: number;
  maxRetriesPerJob?: number;
  monthlyBudgetLimit?: number | null;
  humanReviewRequired?: boolean;
  autoScheduleEnabled?: boolean;
}) {
  const existing = await getOrCreateAiSettings();
  const trimmedKey = input.apiKey?.trim();
  const encryptedApiKey = trimmedKey ? encryptSecret(trimmedKey) : existing.encryptedApiKey;
  const nextIsEnabled = input.isEnabled ?? existing.isEnabled;
  if (nextIsEnabled && !encryptedApiKey) {
    throw new Error("OpenAI API key is required before enabling AI Content Studio.");
  }

  return prisma.aiProviderSetting.update({
    where: { provider: AI_PROVIDER },
    data: {
      isEnabled: nextIsEnabled,
      encryptedApiKey,
      apiKeyLastFour: trimmedKey ? lastFour(trimmedKey) : existing.apiKeyLastFour,
      apiKeyConfiguredAt: trimmedKey ? new Date() : existing.apiKeyConfiguredAt,
      textModel: input.textModel?.trim() || existing.textModel,
      imageModel: input.imageModel?.trim() || existing.imageModel,
      defaultOutputLanguage: input.defaultOutputLanguage ?? existing.defaultOutputLanguage,
      defaultArticleTone: input.defaultArticleTone ?? existing.defaultArticleTone,
      defaultArticleLength: input.defaultArticleLength ?? existing.defaultArticleLength,
      defaultGenerateImage: input.defaultGenerateImage ?? existing.defaultGenerateImage,
      defaultImageSize: input.defaultImageSize ?? existing.defaultImageSize,
      defaultImageQuality: input.defaultImageQuality ?? existing.defaultImageQuality,
      maxKeywordsPerBatch: input.maxKeywordsPerBatch ?? existing.maxKeywordsPerBatch,
      maxConcurrentJobs: input.maxConcurrentJobs ?? existing.maxConcurrentJobs,
      maxRetriesPerJob: input.maxRetriesPerJob ?? existing.maxRetriesPerJob,
      monthlyBudgetLimit: input.monthlyBudgetLimit ?? existing.monthlyBudgetLimit,
      humanReviewRequired: input.humanReviewRequired ?? existing.humanReviewRequired,
      autoScheduleEnabled: input.autoScheduleEnabled ?? existing.autoScheduleEnabled,
    },
  });
}

export async function getOpenAiApiKey() {
  const settings = await getOrCreateAiSettings();
  if (!settings.encryptedApiKey) throw new Error("OpenAI API key is not configured.");
  return { settings, apiKey: decryptSecret(settings.encryptedApiKey) };
}

export async function markAiConnectionTest(status: string) {
  return prisma.aiProviderSetting.update({
    where: { provider: AI_PROVIDER },
    data: { lastTestStatus: status, lastTestedAt: new Date() },
  });
}

export async function removeAiApiKey() {
  return prisma.aiProviderSetting.update({
    where: { provider: AI_PROVIDER },
    data: {
      isEnabled: false,
      encryptedApiKey: null,
      apiKeyLastFour: null,
      apiKeyConfiguredAt: null,
      lastTestStatus: "Disabled",
    },
  });
}
