"use client";

import { motion } from "framer-motion";
import { Check, Minus, Scale, X } from "lucide-react";

import type { ConsensusMetrics } from "@/types/roundtable";

const voteDisplay = {
  Agree: { icon: Check, className: "bg-emerald-400/[0.10] text-emerald-200", label: "Agree" },
  Disagree: { icon: X, className: "bg-rose-400/[0.10] text-rose-200", label: "Disagree" },
  Neutral: { icon: Minus, className: "bg-sky-400/[0.10] text-sky-200", label: "Neutral" },
  Mixed: { icon: Scale, className: "bg-amber-400/[0.10] text-amber-200", label: "Mixed" },
} as const;

export function VoteList({ votes }: { votes: ConsensusMetrics["votes"] }) {
  return (
    <div className="space-y-2">
      {votes.map((vote, index) => {
        const display = voteDisplay[vote.stance];
        const Icon = display.icon;
        return <motion.div key={vote.expertId} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + index * 0.08 }} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3"><span className="truncate text-sm font-medium text-slate-200">{vote.expertName}</span><span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${display.className}`}><Icon className="h-3 w-3" /> {display.label}</span></motion.div>;
      })}
    </div>
  );
}
