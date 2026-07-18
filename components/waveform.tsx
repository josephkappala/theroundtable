"use client";

import { motion } from "framer-motion";

import { VoiceAvatar } from "@/components/voice-avatar";
import type { PlaybackItem } from "@/types/live";

const bars = [0.34, 0.7, 0.48, 0.9, 0.58, 0.76, 0.4, 0.84, 0.55, 0.68, 0.32, 0.78, 0.5, 0.92, 0.42, 0.65, 0.36, 0.72, 0.52, 0.88, 0.46, 0.7, 0.36, 0.6];

export function Waveform({ speakers, activeSpeaker, isPlaying }: { speakers: PlaybackItem[]; activeSpeaker: string; isPlaying: boolean }) {
  return <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"><div className="flex items-center justify-between gap-4"><div className="flex -space-x-2">{speakers.slice(0, 7).map((speaker) => <VoiceAvatar key={speaker.speaker} speaker={speaker} active={speaker.speaker === activeSpeaker} />)}</div><div className="flex h-12 flex-1 items-center justify-end gap-1.5">{bars.map((height, index) => <motion.span key={index} animate={{ height: isPlaying ? [`${height * 36}px`, `${Math.max(9, (1 - height) * 42)}px`, `${height * 36}px`] : `${height * 22}px`, opacity: activeSpeaker ? 1 : 0.45 }} transition={{ duration: 0.65 + (index % 5) * 0.1, repeat: isPlaying ? Infinity : 0, delay: index * 0.025 }} className="w-1 rounded-full bg-gradient-to-t from-violet-500 to-cyan-200" />)}</div></div></div>;
}
