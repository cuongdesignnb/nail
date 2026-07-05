import type { AiGeneratedArticle } from "./ai.types";
import { normalizeUnicodeText } from "@/lib/utils/text-normalization";

export const articleJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "slug",
    "excerpt",
    "bodyHtml",
    "metaTitle",
    "metaDescription",
    "seoKeywords",
    "faq",
    "suggestedCategoryName",
    "imagePrompt",
    "coverImageAlt",
  ],
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    excerpt: { type: "string" },
    bodyHtml: { type: "string" },
    metaTitle: { type: "string" },
    metaDescription: { type: "string" },
    seoKeywords: { type: "array", items: { type: "string" } },
    faq: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "answer"],
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
      },
    },
    suggestedCategoryName: { type: "string" },
    imagePrompt: { type: "string" },
    coverImageAlt: { type: "string" },
  },
};

export function buildArticleSystemPrompt() {
  return [
    "You are the editorial SEO writer for Aera Nail Lounge.",
    "Write natural, elegant English content for a luxury nail salon website.",
    "Do not invent prices, promotions, certifications, medical claims, statistics, testimonials, or competitor references.",
    "Do not use markdown fences. Return only JSON that matches the schema.",
    "Use safe HTML for bodyHtml with paragraphs, h2/h3, ul/li, and a final booking CTA.",
  ].join("\n");
}

export function buildArticleUserPrompt(input: {
  keyword: string;
  outputLanguage: string;
  tone: string;
  targetWords: number;
  categoryName?: string | null;
  services: Array<{ name: string; priceLabel?: string | null; durationMinutes?: number | null }>;
  packages: Array<{ name: string; priceLabel?: string | null }>;
  existingLinks: Array<{ title: string; href: string }>;
}) {
  return JSON.stringify({
    brandName: "Aera Nail Lounge",
    bookingUrl: "/booking",
    outputLanguage: input.outputLanguage || "en",
    tone: input.tone || "luxury_editorial",
    targetWords: input.targetWords || 1200,
    focusKeyword: normalizeUnicodeText(input.keyword),
    selectedCategory: input.categoryName || null,
    availableServices: input.services,
    availablePackages: input.packages,
    existingInternalLinks: input.existingLinks,
    requirements: [
      "Generated public article output must be English by default.",
      "Preserve the meaning of non-English keywords, but write the article in polished English.",
      "Include practical nail care advice and a clear booking CTA.",
      "Create an image prompt for editorial luxury nail photography without text, logos, watermarks, distorted fingers, extra hands, or price text.",
    ],
  });
}

export function normalizeArticle(article: AiGeneratedArticle): AiGeneratedArticle {
  return {
    ...article,
    title: normalizeUnicodeText(article.title),
    slug: normalizeUnicodeText(article.slug),
    excerpt: normalizeUnicodeText(article.excerpt),
    bodyHtml: normalizeUnicodeText(article.bodyHtml),
    metaTitle: normalizeUnicodeText(article.metaTitle),
    metaDescription: normalizeUnicodeText(article.metaDescription),
    seoKeywords: (article.seoKeywords || []).map(normalizeUnicodeText).filter(Boolean),
    faq: (article.faq || []).map((item) => ({
      question: normalizeUnicodeText(item.question),
      answer: normalizeUnicodeText(item.answer),
    })),
    suggestedCategoryName: normalizeUnicodeText(article.suggestedCategoryName || ""),
    imagePrompt: normalizeUnicodeText(article.imagePrompt),
    coverImageAlt: normalizeUnicodeText(article.coverImageAlt),
  };
}
