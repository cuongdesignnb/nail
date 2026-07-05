import { getOpenAiApiKey } from "./ai-settings.service";
import { aiProviderRegistry } from "./providers/provider.registry";
import type { AiImageGenerationRequest, AiTextGenerationRequest } from "./ai.types";

export async function generateAiText(request: AiTextGenerationRequest) {
  const { apiKey } = await getOpenAiApiKey();
  return aiProviderRegistry.openai.generateText(apiKey, request);
}

export async function generateAiImage(request: AiImageGenerationRequest) {
  const { apiKey } = await getOpenAiApiKey();
  return aiProviderRegistry.openai.generateImage(apiKey, request);
}
