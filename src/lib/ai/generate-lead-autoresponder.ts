import { openai } from "@/lib/ai/client"

interface GenerateEmailInput {
  businessName: string
  industry: string
  city: string
  tone: string
  leadName: string
  serviceInterest?: string | null
  message?: string | null
}

export interface GeneratedEmail {
  subject: string
  body: string
}

export async function generateLeadAutoresponder(
  input: GenerateEmailInput
): Promise<GeneratedEmail> {
  const prompt = `
You are writing an automated but professional lead response email for a local business.

Business name: ${input.businessName}
Industry: ${input.industry}
City: ${input.city}
Tone: ${input.tone}
Lead name: ${input.leadName}
Requested service: ${input.serviceInterest ?? ""}
Lead message: ${input.message ?? ""}

Return ONLY valid JSON with this shape:
{
  "subject": "string",
  "body": "string"
}

Rules:
- Sound warm, helpful, and professional
- Make it clear the business received the inquiry
- Mention next steps
- Keep it concise
- Do not make unrealistic promises
- Do not pretend a human personally typed it if that would be misleading
- The body should be plain email text with short paragraphs
`

  const response = await openai.responses.create({
    model: "gpt-5",
    input: prompt
  })

  const rawText = response.output_text.trim()

  try {
    return JSON.parse(rawText) as GeneratedEmail
  } catch (error) {
    console.error("Failed to parse autoresponder JSON:", rawText)
    throw new Error("Invalid AI email response")
  }
}
