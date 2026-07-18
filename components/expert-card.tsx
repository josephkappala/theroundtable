"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Sparkles } from "lucide-react";

import type { AnalystResult } from "@/types/roundtable";

type ExpertCardProps = {
  result: AnalystResult;
  index: number;
  revealDelay?: number;
};

const stanceStyles = {
  Agree: "border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200",
  Disagree: "border-rose-300/20 bg-rose-400/[0.08] text-rose-200",
  Neutral: "border-sky-300/20 bg-sky-400/[0.08] text-sky-200",
  Mixed: "border-amber-300/20 bg-amber-400/[0.08] text-amber-200",
} as const;

export function ExpertCard({ result, index, revealDelay = index * 0.13 }: ExpertCardProps) {
  const { analyst, response } = result;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: revealDelay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0d111c]/85 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.2)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-50 blur-3xl" style={{ background: analyst.accent }} />
      <div className="relative flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="absolute inset-0 animate-ping rounded-xl opacity-20" style={{ background: analyst.accent }} />
          <Image src={analyst.avatar} alt="" width={44} height={44} className="relative h-11 w-11 rounded-xl border border-white/10 bg-[#080b12]" />
          <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full border border-[#0d111c]" style={{ background: analyst.accent }}><Check className="h-2.5 w-2.5 text-slate-950" strokeWidth={3} /></span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
          <div><h3 className="truncate text-sm font-semibold text-white">{analyst.name}</h3><p className="mt-0.5 text-xs text-slate-500">{analyst.role} · Opening statement</p></div>
            <span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${stanceStyles[response.stance]}`}>{response.stance}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex items-start gap-4">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${analyst.accent} ${response.confidence * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0d111c] text-[11px] font-semibold text-white">{response.confidence}%</div>
        </div>
        <div className="min-w-0"><p className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500">Opening statement</p><p className="mt-1.5 text-sm leading-6 text-slate-200">{response.summary}</p></div>
      </div>

      <p className="relative mt-4 text-sm leading-6 text-slate-400">{response.reasoning}</p>
      <div className="relative mt-4 flex flex-wrap gap-1.5">{response.keyPoints.map((point, index) => <span key={`${point}-${index}`} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[11px] text-slate-400">{point}</span>)}</div>
      <div className="relative mt-5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: analyst.accent }}><Sparkles className="h-3 w-3" /> Proposed action</div>
        <p className="mt-1.5 text-sm leading-5 text-slate-200">{response.recommendation}</p>
      </div>
    </motion.article>
  );
}
