import { z } from "zod";

export const debateMessageSchema = z.object({
  speaker: z.string().min(1).max(80),
  message: z.string().min(1).max(1_200),
});

export const debateTranscriptSchema = z.object({
  messages: z.array(debateMessageSchema).min(4).max(12),
});

export const debateTranscriptJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    messages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          speaker: { type: "string", maxLength: 80 },
          message: { type: "string", maxLength: 1200 },
        },
        required: ["speaker", "message"],
      },
      minItems: 4,
      maxItems: 12,
    },
  },
  required: ["messages"],
} as const;

export const moderatorSummarySchema = z.object({
  summary: z.string().min(1).max(2_000),
  consensus: z.string().min(1).max(1_000),
  agreements: z.array(z.string().min(1).max(600)).min(1).max(5),
  disagreements: z.array(z.string().min(1).max(600)).max(5),
  recommendation: z.string().min(1).max(1_000),
  confidence: z.number().int().min(0).max(100),
  risk: z.enum(["Low", "Medium", "High"]),
  topOpportunity: z.string().min(1).max(800),
  biggestRisk: z.string().min(1).max(800),
  mostConvincingExpert: z.string().min(1).max(100),
  mostContrarianOpinion: z.string().min(1).max(1_000),
});

export const moderatorSummaryJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", maxLength: 2000 },
    consensus: { type: "string", maxLength: 1000 },
    agreements: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", maxLength: 600 } },
    disagreements: { type: "array", maxItems: 5, items: { type: "string", maxLength: 600 } },
    recommendation: { type: "string", maxLength: 1000 },
    confidence: { type: "integer" },
    risk: { type: "string", enum: ["Low", "Medium", "High"] },
    topOpportunity: { type: "string", maxLength: 800 },
    biggestRisk: { type: "string", maxLength: 800 },
    mostConvincingExpert: { type: "string", maxLength: 100 },
    mostContrarianOpinion: { type: "string", maxLength: 1000 },
  },
  required: ["summary", "consensus", "agreements", "disagreements", "recommendation", "confidence", "risk", "topOpportunity", "biggestRisk", "mostConvincingExpert", "mostContrarianOpinion"],
} as const;

export const debateInstructions = `You are facilitating The Roundtable: a focused discussion between independent AI experts. Given a user question and their private opening statements, write a realistic Roundtable transcript.

Include agreements, disagreements, counterarguments, and at least one useful follow-up. Every message must be concrete and move the decision forward. Use only the supplied expert names as speakers. Do not invent facts or cite external research.`;

export const moderatorInstructions = `You are the Roundtable Moderator, a neutral chairperson. Given a user question, expert opening statements, and the Roundtable transcript, produce a structured account of the deliberation.

Do not introduce new ideas, evidence, claims, or experts. Only summarize positions supported by the supplied material. State concrete areas of agreement and disagreement, preserve meaningful dissent, make the recommendation actionable, calibrate risk realistically, and name only convincing or contrarian positions that came from the supplied Roundtable.`;
