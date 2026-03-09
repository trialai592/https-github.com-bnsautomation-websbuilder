import { openai } from "@/lib/ai/client";
import { getCopyGeneratorPrompt } from "@/lib/ai/prompts";

interface CopyInput {
  name: string;
  industry: string;
  city: string;
  state?: string | null;
  tone: string;
  services: { name: string; description?: string | null }[];
  plannerResult: {
    themeKey: string;
    seo: {
      title: string;
      description: string;
    };
    sections: { type: string; purpose: string }[];
  };
}

export interface CopyResult {
  sections: {
    type: string;
    data: Record<string, unknown>;
  }[];
}

export async function generateCopy(input: CopyInput): Promise<CopyResult> {
  const prompt = getCopyGeneratorPrompt(input);

  const response = await openai.responses.create({
    model: "gpt-5",
    input: prompt,
  });

  const rawText = response.output_text.trim();

  try {
    return JSON.parse(rawText) as CopyResult;
  } catch (error) {
    console.error("Failed to parse copy JSON:", rawText);
    throw new Error("Invalid AI copy response");
  }
}
