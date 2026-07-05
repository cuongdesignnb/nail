import { generateOpenAiImage } from "./openai/openai-image.provider";
import { generateOpenAiText } from "./openai/openai-text.provider";

export const aiProviderRegistry = {
  openai: {
    generateText: generateOpenAiText,
    generateImage: generateOpenAiImage,
  },
};
