"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { VoiceAvatar } from "@/components/voice-avatar";
import type { PlaybackItem } from "@/types/live";

export function TranscriptViewer({ queue, activeIndex }: { queue: PlaybackItem[]; activeIndex: number }) {
  const activeRef = useRef<HTMLDivElement>(null);
  useEffect(() => activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), [activeIndex]);
  return <div className="max-h-[440px] space-y-3 overflow-y-auto rounded-2xl border border-white/[0.08] bg-black/20 p-3 [scrollbar-width:thin]" aria-label="Roundtable Live transcript">{queue.map((item, index) => { const active = index === activeIndex; return <motion.article ref={active ? activeRef : undefined} key={item.id} animate={{ opacity: active ? 1 : 0.48, scale: active ? 1 : 0.985 }} className={`flex gap-3 rounded-xl border p-3 transition-colors ${active ? "border-violet-300/25 bg-violet-400/[0.08]" : "border-transparent"}`}><VoiceAvatar speaker={item} active={active} /><div className="min-w-0"><p className="text-xs font-medium" style={{ color: item.accent }}>{item.speaker} <span className="font-normal text-slate-500">· {item.sectionLabel}</span></p><p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p></div></motion.article>; })}</div>;
}
