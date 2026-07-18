"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import type { PlaybackItem } from "@/types/live";

export function VoiceAvatar({ speaker, active }: { speaker: Pick<PlaybackItem, "speaker" | "avatar" | "accent">; active: boolean }) {
  return <motion.div animate={{ opacity: active ? 1 : 0.42, scale: active ? 1.08 : 0.94 }} transition={{ duration: 0.25 }} className="relative"><Image src={speaker.avatar} alt={speaker.speaker} width={40} height={40} className="h-10 w-10 rounded-xl border border-white/10 bg-[#080b12]" /><motion.span animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.7 }} className="absolute -inset-1 -z-10 rounded-2xl blur-md" style={{ background: speaker.accent }} /></motion.div>;
}
