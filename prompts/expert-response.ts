import { z } from "zod";

export const expertStances = ["Agree", "Disagree", "Neutral", "Mixed"] as const;

export const expertResponseSchema = z.object({
  expert: z.string().min(1).max(80),
  summary: z.string().min(1).max(1_200),
  reasoning: z.string().min(1).max(2_400),
  confidence: z.number().int().min(0).max(100),
  recommendation: z.string().min(1).max(1_000),
  stance: z.enum(expertStances),
  keyPoints: z.array(z.string().min(1).max(400)).min(1).max(5),
});

export type ExpertResponse = z.infer<typeof expertResponseSchema>;

export const expertResponseJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expert: { type: "string", maxLength: 80, description: "The expert's exact display name." },
    summary: { type: "string", maxLength: 1200, description: "A concise position on the user's decision." },
    reasoning: { type: "string", maxLength: 2400, description: "Specific rationale, key trade-offs, and material assumptions." },
    confidence: { type: "integer", description: "Calibrated confidence from 0 to 100." },
    recommendation: { type: "string", maxLength: 1000, description: "The clearest next action to take." },
    stance: { type: "string", enum: expertStances, description: "Agree, Disagree, or Neutral." },
    keyPoints: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", maxLength: 400 }, description: "The most important points behind the position." },
  },
  required: ["expert", "summary", "reasoning", "confidence", "recommendation", "stance", "keyPoints"],
} as const;

const responseContract = `Return only a JSON object that exactly matches this shape:
{
  "expert": "Senior Engineer",
  "summary": "",
  "reasoning": "",
  "confidence": 85,
  "recommendation": "",
  "stance": "Agree",
  "keyPoints": ["", ""]
}

Use a calibrated integer from 0 to 100 for confidence. Set stance to exactly Agree, Disagree, Neutral, or Mixed. Include 2–5 concise keyPoints. Do not include Markdown, code fences, or additional keys.`;

export function withExpertResponseContract(systemPrompt: string) {
  return `${systemPrompt}\n\n${responseContract}`;
}

export function formatExpertResponse(response: ExpertResponse) {
  return `## ${response.stance} · ${response.confidence}% confidence\n${response.summary}\n\n${response.reasoning}\n\n**Recommendation:** ${response.recommendation}`;
}
