export const AI_PROVIDER = "openai";

export const AI_DEFAULTS = {
  textModel: "gpt-5.4-mini",
  imageModel: "gpt-image-2",
  outputLanguage: "en",
  tone: "luxury_editorial",
  articleLength: 1200,
  imageSize: "1536x1024",
  imageQuality: "medium",
  maxKeywordsPerBatch: 30,
  maxRetriesPerJob: 2,
} as const;

export const AI_TERMINAL_JOB_STATUSES = [
  "completed",
  "failed",
  "cancelled",
  "skipped_duplicate",
  "manual_review",
] as const;
