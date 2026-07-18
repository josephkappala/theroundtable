"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { discussionExperts } from "@/prompts/discussion-experts";
import type { DebateMessage } from "@/types/roundtable";

export function DiscussionBubble({ message, index }: { message: DebateMessage; index: number }) {
  const expert = discussionExperts.find((profile) => profile.name === message.speaker);
  const isAlternate = index % 2 === 1;
  const color = expert?.color ?? "#a78bfa";
  const timestamp = index === 0 ? "Now" : `+${index}s`;

  return (
    <motion.article initial={{ opacity: 0, x: isAlternate ? 18 : -18, y: 10, scale: 0.98 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className={`flex gap-3 ${isAlternate ? "sm:ml-12" : "sm:mr-12"}`}>
      <div className="relative mt-0.5 shrink-0">
        {expert ? <Image src={expert.avatar} alt="" width={36} height={36} className="h-9 w-9 rounded-xl border border-white/10 bg-[#080b12]" /> : <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-sm">✦</span>}
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#0c101a]" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2"><p className="text-xs font-medium" style={{ color }}>{message.speaker}</p><time className="text-[11px] text-slate-600">{timestamp}</time></div>
        <div className="relative overflow-hidden rounded-2xl rounded-tl-sm border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm leading-6 text-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"><span className="pointer-events-none absolute inset-y-0 left-0 w-px opacity-70" style={{ background: color }} />{message.message}</div>
      </div>
    </motion.article>
  );
}
