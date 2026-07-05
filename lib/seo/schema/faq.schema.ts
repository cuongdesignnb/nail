import type { FaqSchemaItem } from "./schema.types";

export function buildFaqSchema(items: FaqSchemaItem[]) {
  const valid = items.filter((item) => item.question.trim() && item.answer.trim());
  if (valid.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

