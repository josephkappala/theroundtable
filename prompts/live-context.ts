import { z } from "zod";

export const contextRequirementSchema = z.object({
  requiresContext: z.boolean(),
  reason: z.string().min(1).max(160),
});

export const liveContextSourceSchema = z.object({
  title: z.string().min(1).max(240),
  summary: z.string().min(1).max(700),
  source: z.string().url().max(2_000),
  retrievedAt: z.string().datetime(),
});

export const liveContextSchema = z.object({
  requiresContext: z.literal(true),
  reason: z.string().min(1).max(160),
  summary: z.string().min(1).max(1_600),
  sources: z.array(liveContextSourceSchema).min(1).max(4),
  retrievedAt: z.string().datetime(),
});

export const liveContextResponseSchema = z.object({
  summary: z.string().min(1).max(1_600),
  sources: z.array(z.object({
    title: z.string().min(1).max(240),
    summary: z.string().min(1).max(700),
  })).min(1).max(4),
});

export const liveContextResponseJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", maxLength: 1600 },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { title: { type: "string", maxLength: 240 }, summary: { type: "string", maxLength: 700 } },
        required: ["title", "summary"],
      },
      minItems: 1,
      maxItems: 4,
    },
  },
  required: ["summary", "sources"],
} as const;

export const liveContextInstructions = `Use web search to create a small, factual briefing for a panel considering the user's question.

Search for only the timely information materially needed to answer the question. Prefer primary sources and reputable reporting. Return a concise synthesis plus two to four source summaries. Do not make recommendations, do not speculate, and do not copy source text. Every current claim must be supported by a web citation.`;
