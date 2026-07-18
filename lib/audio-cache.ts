import type { PlaybackItem } from "@/types/live";

const CACHE_NAME = "the-roundtable-live-v1";

async function keyFor(item: PlaybackItem) {
  const payload = new TextEncoder().encode(`${item.id}:${item.voice}:${item.voiceStyle}:${item.text}`);
  const digest = await crypto.subtle.digest("SHA-256", payload);
  const key = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return new Request(`/roundtable-live-cache/${key}`);
}

export async function getCachedAudio(item: PlaybackItem) {
  if (!("caches" in window) || !crypto.subtle) return null;
  try {
    const cache = await window.caches.open(CACHE_NAME);
    const response = await cache.match(await keyFor(item));
    return response ? response.blob() : null;
  } catch {
    return null;
  }
}

/** Best-effort browser caching keeps already-heard Roundtable segments instant on replay. */
export async function cacheAudio(item: PlaybackItem, audio: Blob) {
  if (!("caches" in window) || !crypto.subtle) return;
  try {
    const cache = await window.caches.open(CACHE_NAME);
    await cache.put(await keyFor(item), new Response(audio, { headers: { "Content-Type": audio.type || "audio/mpeg" } }));
  } catch {
    // Cache availability and quota vary by browser; playback remains available without it.
  }
}
