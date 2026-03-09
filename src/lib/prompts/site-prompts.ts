export function getSitePlannerPrompt(input: {
  name: string;
  industry: string;
  city: string;
  state?: string | null;
  tone: string;
  services: { name: string; description?: string | null }[];
  description?: string | null;
}) {
  return `
You are a website strategist for local service businesses.

Create a homepage plan for this business.

Business name: ${input.name}
Industry: ${input.industry}
City: ${input.city}
State: ${input.state ?? ""}
Tone: ${input.tone}
Description: ${input.description ?? ""}

Services:
${input.services.map((s) => `- ${s.name}${s.description ? `: ${s.description}` : ""}`).join("\n")}

Return ONLY valid JSON with this shape:
{
  "themeKey": "string",
  "seo": {
    "title": "string",
    "description": "string"
  },
  "sections": [
    {
      "type": "hero",
      "purpose": "string"
    }
  ]
}

Rules:
- Focus on one homepage only
- Use these section types only: hero, services, benefits, testimonials, faq, contactCta, footer
- Put sections in a logical conversion-focused order
- Keep the SEO title under 60 characters
- Keep the SEO description under 160 characters
- Choose a clean, modern theme key
`;
}

export function getCopyGeneratorPrompt(input: {
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
}) {
  return `
You are an expert website copywriter for local businesses.

Write homepage copy for this business.

Business name: ${input.name}
Industry: ${input.industry}
City: ${input.city}
State: ${input.state ?? ""}
Tone: ${input.tone}

Services:
${input.services.map((s) => `- ${s.name}${s.description ? `: ${s.description}` : ""}`).join("\n")}

Planned homepage sections:
${input.plannerResult.sections.map((s) => `- ${s.type}: ${s.purpose}`).join("\n")}

Return ONLY valid JSON with this shape:
{
  "sections": [
    {
      "type": "hero",
      "data": {}
    }
  ]
}

Rules:
- Use these section types only: hero, services, benefits, testimonials, faq, contactCta, footer
- Keep copy clear, trustworthy, and local-business friendly
- Do not use hype or unrealistic claims
- For hero section data, include:
  {
    "headline": "string",
    "subheadline": "string",
    "primaryCta": "string",
    "secondaryCta": "string"
  }
- For services section data, include:
  {
    "title": "string",
    "items": [{ "name": "string", "description": "string" }]
  }
- For benefits section data, include:
  {
    "title": "string",
    "items": ["string", "string", "string"]
  }
- For testimonials section data, include:
  {
    "title": "string",
    "items": [
      { "name": "string", "quote": "string" }
    ]
  }
- For faq section data, include:
  {
    "title": "string",
    "items": [
      { "question": "string", "answer": "string" }
    ]
  }
- For contactCta section data, include:
  {
    "title": "string",
    "description": "string",
    "buttonText": "string"
  }
- For footer section data, include:
  {
    "businessName": "string",
    "city": "string",
    "email": "string"
  }
`;
}
