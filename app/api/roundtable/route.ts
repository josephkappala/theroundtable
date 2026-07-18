import { NextResponse } from "next/server";

import { runExpertDiscussion } from "@/lib/discussion";
import { getOpenAIClient, roundtableModel } from "@/lib/openai";
import { buildSynthesisInput } from "@/lib/roundtable";
import { roundtableRequestSchema } from "@/lib/validation";
import { synthesisInstructions } from "@/prompts/analysts";
import { defaultExpertIds } from "@/prompts/discussion-experts";
import type { RoundtableApiResponse } from "@/types/roundtable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("The request body must be valid JSON.", 400);
  }

  const parsed = roundtableRequestSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid request.", 400);

  try {
    const { responses } = await runExpertDiscussion(parsed.data.prompt, parsed.data.expertIds ?? defaultExpertIds);
    const client = getOpenAIClient();
    const synthesisResponse = await client.responses.create({
      model: roundtableModel,
      instructions: synthesisInstructions,
      input: buildSynthesisInput(parsed.data.prompt, responses),
      max_output_tokens: 850,
      store: false,
    });
    const synthesis = synthesisResponse.output_text.trim();
    if (!synthesis) throw new Error("The synthesis returned no text.");

    const payload: RoundtableApiResponse = { id: crypto.randomUUID(), prompt: parsed.data.prompt, results: responses, synthesis };
    return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Roundtable run failed", error);
    const message = error instanceof Error ? error.message : "Unable to run The Roundtable right now.";
    const isConfigurationError = message.includes("OPENAI_API_KEY");
    return apiError(isConfigurationError ? "The Roundtable is not configured yet. Add OPENAI_API_KEY to your environment." : "Unable to run The Roundtable right now. Please try again.", isConfigurationError ? 503 : 502);
  }
}
