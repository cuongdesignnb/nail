import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import type { AiGeneratedArticle } from "./ai.types";
import { normalizeArticle } from "./ai-content-prompts";

const schema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3),
  excerpt: z.string().min(20),
  bodyHtml: z.string().min(100),
  metaTitle: z.string().min(5),
  metaDescription: z.string().min(20),
  seoKeywords: z.array(z.string()).default([]),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  suggestedCategoryName: z.string().optional().default(""),
  imagePrompt: z.string().min(10),
  coverImageAlt: z.string().min(5),
});

export function validateGeneratedArticle(value: unknown): AiGeneratedArticle {
  const parsed = normalizeArticle(schema.parse(value));
  return {
    ...parsed,
    bodyHtml: sanitizeHtml(parsed.bodyHtml, {
      allowedTags: ["p", "strong", "em", "u", "h2", "h3", "ul", "ol", "li", "blockquote", "a", "br"],
      allowedAttributes: { a: ["href", "target", "rel"] },
      transformTags: {
        a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
      },
    }),
  };
}
