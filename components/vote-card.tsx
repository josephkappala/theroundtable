"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { VoteButton } from "@/components/vote-button";
import type { CommunityExpert } from "@/types/community";

export function VoteCard({ expert, selected, disabled, onVote, index }: { expert: CommunityExpert; selected: boolean; disabled: boolean; onVote: () => void; index: number }) {
  return <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, scale: selected ? 1.015 : 1 }} transition={{ delay: index * 0.06, duration: 0.35 }} className={`relative overflow-hidden rounded-2xl border p-4 transition-colors ${selected ? "border-violet-300/40 bg-violet-400/[0.11] shadow-[0_0_28px_rgba(139,92,246,0.15)]" : "border-white/[0.08] bg-white/[0.025]"}`}><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/[0.10] bg-black/20"><Image src={expert.avatar} alt="" width={40} height={40} className="h-full w-full object-cover" /></span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-medium text-white">{expert.name}</h3><p className="mt-0.5 truncate text-xs text-slate-500">{expert.role}</p><p className="mt-2 text-xs text-violet-200">{expert.confidence}% confidence</p></div></div><div className="mt-4"><VoteButton selected={selected} disabled={disabled} onVote={onVote} /></div></motion.article>;
}
