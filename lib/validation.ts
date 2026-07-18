import { z } from "zod";

import { expertIds } from "@/prompts/discussion-experts";
import { expertResponseSchema } from "@/prompts/expert-response";
import { debateTranscriptSchema } from "@/prompts/panel-discussion";
import { liveContextSchema } from "@/prompts/live-context";

const questionSchema = z
  .string()
  .trim()
  .min(12, "Give your experts a little more context (at least 12 characters).")
  .max(6_000, "Keep the question under 6,000 characters.");

const analystResultInputSchema = z.object({
  analyst: z.object({
    id: z.string().min(1).max(80),
    name: z.string().min(1).max(120),
    role: z.string().min(1).max(120),
    description: z.string().min(1).max(300),
    accent: z.string().min(1).max(32),
    avatar: z.string().min(1).max(200),
  }),
  content: z.string().min(1).max(6_000),
  response: expertResponseSchema,
  status: z.literal("complete"),
});

export const roundtableRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(12, "Give The Roundtable a little more context (at least 12 characters).")
    .max(6_000, "Keep the prompt under 6,000 characters."),
  expertIds: z.array(z.enum(expertIds)).min(3, "Choose at least 3 experts.").max(7, "Choose up to 7 experts.").optional(),
}).strict();

export type RoundtableRequest = z.infer<typeof roundtableRequestSchema>;

export const discussRequestSchema = z.object({
  question: questionSchema,
  expertIds: z.array(z.enum(expertIds)).min(1, "Choose at least one expert.").max(7, "Choose up to 7 experts."),
}).strict();

export type DiscussRequest = z.infer<typeof discussRequestSchema>;

export const discussionStageRequestSchema = z.discriminatedUnion("stage", [
  z.object({
    stage: z.literal("opinions"),
    question: questionSchema,
    expertIds: z.array(z.enum(expertIds)).min(3, "Choose at least 3 experts.").max(7, "Choose up to 7 experts."),
  }).strict(),
  z.object({
    stage: z.literal("debate"),
    question: questionSchema,
    responses: z.array(analystResultInputSchema).min(1).max(7),
    liveContext: liveContextSchema.nullable().optional(),
  }).strict(),
  z.object({
    stage: z.literal("moderator"),
    question: questionSchema,
    responses: z.array(analystResultInputSchema).min(1).max(7),
    debate: debateTranscriptSchema,
    liveContext: liveContextSchema.nullable().optional(),
  }).strict(),
]);

export type DiscussionStageRequest = z.infer<typeof discussionStageRequestSchema>;
