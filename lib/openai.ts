import OpenAI from "openai";

let client: OpenAI | undefined;

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  client ??= new OpenAI({ apiKey, timeout: 45_000, maxRetries: 2 });
  return client;
}

// PARALLEL_MODEL remains supported during the product transition.
export const roundtableModel = process.env.ROUNDTABLE_MODEL || process.env.PARALLEL_MODEL || "gpt-5";
export const roundtableTtsModel = process.env.ROUNDTABLE_TTS_MODEL || "gpt-4o-mini-tts";
