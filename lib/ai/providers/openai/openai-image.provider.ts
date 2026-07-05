import type { AiImageGenerationRequest, AiImageGenerationResult } from "@/lib/ai/ai.types";

export async function generateOpenAiImage(apiKey: string, request: AiImageGenerationRequest): Promise<AiImageGenerationResult> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: request.model,
      prompt: request.prompt,
      size: request.size,
      quality: request.quality,
      n: 1,
      output_format: "png",
    }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.error?.message || `OpenAI image generation failed with HTTP ${res.status}`);
  }
  const first = payload.data?.[0];
  if (!first?.b64_json) {
    throw new Error("OpenAI image response did not include image data.");
  }
  return {
    imageBuffer: Buffer.from(first.b64_json, "base64"),
    revisedPrompt: first.revised_prompt,
    raw: { created: payload.created, revisedPrompt: first.revised_prompt },
  };
}
