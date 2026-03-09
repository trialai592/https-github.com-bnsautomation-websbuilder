import { openai } from "@/lib/ai/client";
import { getSitePlannerPrompt } from "@/lib/ai/prompts";

interface PlannerInput {
  name: string;
  industry: string;
  city: string;
  state?: string | null;
  tone: string;
  description?: string | null;
  services: { name: string; description?: string | null }[];
}

export interface PlannerResult {
  themeKey: string;
  seo: {
    title: string;
    description: string;
  };
  sections: {
    type: string;
    purpose: string;
  }[];
}

export async function generateSitePlan(
  input: PlannerInput,
): Promise<PlannerResult> {
  const prompt = getSitePlannerPrompt(input);

  const response = await openai.responses.create({
    model: "gpt-5",
    input: prompt,
  });

  const rawText = response.output_text.trim();

  try {
    return JSON.parse(rawText) as PlannerResult;
  } catch (error) {
    console.error("Failed to parse planner JSON:", rawText);
    throw new Error("Invalid AI planner response");
  }
}
