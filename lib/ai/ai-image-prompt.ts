import { normalizeUnicodeText } from "@/lib/utils/text-normalization";

export function buildImagePrompt(input: { keyword: string; articlePrompt?: string | null }) {
  return normalizeUnicodeText(
    [
      "Editorial luxury nail photography for Aera Nail Lounge.",
      "Feminine, calm, premium, modern beauty salon visual.",
      "Warm ivory, cream, champagne, beige, bronze and copper palette.",
      "Elegant manicure or nail art close-up with refined hand pose.",
      "Soft natural studio lighting and clean background.",
      "High-end beauty magazine composition.",
      `Editorial theme: ${input.keyword}.`,
      input.articlePrompt ? `Article visual direction: ${input.articlePrompt}.` : "",
      "No visible logos. No typography. No watermark. No price text.",
      "No distorted fingers. No extra hands. No rendered text.",
    ]
      .filter(Boolean)
      .join(" ")
  );
}
