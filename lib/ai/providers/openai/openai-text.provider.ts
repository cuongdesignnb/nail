import type { AiTextGenerationRequest, AiTextGenerationResult } from "@/lib/ai/ai.types";

function extractOutputText(payload: any) {
  if (typeof payload.output_text === "string") return payload.output_text;
  const parts = Array.isArray(payload.output) ? payload.output : [];
  return parts
    .flatMap((item: any) => (Array.isArray(item.content) ? item.content : []))
    .map((content: any) => content.text || "")
    .join("\n")
    .trim();
}

export async function generateOpenAiText(apiKey: string, request: AiTextGenerationRequest): Promise<AiTextGenerationResult> {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: request.model,
      input: [
        { role: "system", content: request.systemPrompt },
        { role: "user", content: request.userPrompt },
      ],
      max_output_tokens: request.maxOutputTokens ?? 6500,
      text: {
        format: {
          type: "json_schema",
          name: "aera_blog_article",
          schema: request.outputSchema,
          strict: true,
        },
      },
    }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.error?.message || `OpenAI text generation failed with HTTP ${res.status}`);
  }

  const text = extractOutputText(payload);
  return {
    providerResponseId: payload.id,
    text,
    parsedJson: JSON.parse(text),
    inputTokens: payload.usage?.input_tokens,
    outputTokens: payload.usage?.output_tokens,
    rawUsage: payload.usage,
  };
}
