import { cacheAudio, getCachedAudio } from "@/lib/audio-cache";
import type { PlaybackItem } from "@/types/live";

const pendingSpeech = new Map<string, Promise<Blob>>();

function pendingKey(item: PlaybackItem) {
  return `${item.id}:${item.voice}:${item.text}`;
}

/** Fetches one speech segment and reuses a cached browser copy when available. */
export async function generateSpeech(item: PlaybackItem) {
  const key = pendingKey(item);
  const pending = pendingSpeech.get(key);
  if (pending) return pending;
  const task = (async () => {
    const cached = await getCachedAudio(item);
    if (cached) return cached;
    const response = await fetch("/api/speech", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: item.text, voice: item.voice, instructions: item.voiceStyle }) });
    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      throw new Error(payload?.error ?? "Unable to generate this audio segment.");
    }
    const audio = await response.blob();
    if (!audio.size) throw new Error("The generated audio segment was empty.");
    void cacheAudio(item, audio);
    return audio;
  })();
  pendingSpeech.set(key, task);
  try {
    return await task;
  } finally {
    pendingSpeech.delete(key);
  }
}
