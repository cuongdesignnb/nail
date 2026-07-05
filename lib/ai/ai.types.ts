export type AiArticleFaq = {
  question: string;
  answer: string;
};

export type AiGeneratedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  faq: AiArticleFaq[];
  suggestedCategoryName?: string;
  imagePrompt: string;
  coverImageAlt: string;
};

export type AiTextGenerationRequest = {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  outputSchema: object;
  maxOutputTokens?: number;
};

export type AiTextGenerationResult = {
  providerResponseId?: string;
  text: string;
  parsedJson: unknown;
  inputTokens?: number;
  outputTokens?: number;
  rawUsage?: unknown;
};

export type AiImageGenerationRequest = {
  model: string;
  prompt: string;
  size: string;
  quality: string;
};

export type AiImageGenerationResult = {
  imageBuffer: Buffer;
  revisedPrompt?: string;
  raw?: unknown;
};
