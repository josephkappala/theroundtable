import { NextResponse } from "next/server";

import { calculateConsensus, generateDiscussion, generateModerator, generateOpeningStatements } from "@/lib/discussion";
import { detectContextRequirement, retrieveContext } from "@/lib/live-intelligence";
import { discussionStageRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function upstreamStatus(error: unknown) {
  if (typeof error !== "object" || error === null || !("status" in error)) return null;
  const { status } = error as { status?: unknown };
  return typeof status === "number" ? status : null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("The request body must be valid JSON.", 400);
  }

  const parsed = discussionStageRequestSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Invalid request.", 400);

  try {
    if (parsed.data.stage === "opinions") {
      const requirement = detectContextRequirement(parsed.data.question);
      const liveContext = await retrieveContext(parsed.data.question, requirement);
      const { responses, failures } = await generateOpeningStatements(parsed.data.question, parsed.data.expertIds, liveContext);
      return NextResponse.json({ stage: "opinions", id: crypto.randomUUID(), question: parsed.data.question, responses, failures, liveContext }, { headers: { "Cache-Control": "no-store" } });
    }

    if (parsed.data.stage === "debate") {
      const debate = await generateDiscussion(parsed.data.question, parsed.data.responses, parsed.data.liveContext);
      return NextResponse.json({ stage: "debate", debate }, { headers: { "Cache-Control": "no-store" } });
    }

    const moderator = await generateModerator(parsed.data.question, parsed.data.responses, parsed.data.debate, parsed.data.liveContext);
    const consensus = calculateConsensus(parsed.data.responses, moderator);
    return NextResponse.json({ stage: "moderator", moderator, consensus }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Discussion stage failed", error);
    const message = error instanceof Error ? error.message : "Unable to start The Roundtable right now.";
    const isConfigurationError = message.includes("OPENAI_API_KEY");
    const status = upstreamStatus(error);
    if (isConfigurationError) return apiError("The Roundtable is not configured yet. Add OPENAI_API_KEY to your environment.", 503);
    if (status === 429) return apiError("The Roundtable is experiencing high demand. Please retry in a moment.", 429);
    return apiError("Unable to start The Roundtable right now. Please try again.", 502);
  }
}
