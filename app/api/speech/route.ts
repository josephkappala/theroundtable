import { NextResponse } from "next/server";
import { z } from "zod";

import { getOpenAIClient, roundtableTtsModel } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const speechRequestSchema = z.object({
  text: z.string().trim().min(1).max(4_096),
  voice: z.enum(["alloy", "ash", "ballad", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer", "verse"]),
  instructions: z.string().trim().min(1).max(800),
}).strict();

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "The speech request must be valid JSON." }, { status: 400 });
  }
  const parsed = speechRequestSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid speech request." }, { status: 400 });
  try {
    const audio = await getOpenAIClient().audio.speech.create({ model: roundtableTtsModel, input: parsed.data.text, voice: parsed.data.voice, instructions: parsed.data.instructions, response_format: "mp3" });
    return new Response(await audio.arrayBuffer(), { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("Speech generation failed", error);
    const message = error instanceof Error ? error.message : "Unable to generate audio.";
    if (message.includes("OPENAI_API_KEY")) return NextResponse.json({ error: "The Roundtable is not configured for audio yet." }, { status: 503 });
    return NextResponse.json({ error: "Unable to generate this audio segment. Please try again." }, { status: 502 });
  }
}
