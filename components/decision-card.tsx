"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Award, CircleAlert, Lightbulb, Sparkles } from "lucide-react";

import { ConfidenceRing } from "@/components/confidence-ring";
import { formatDecision } from "@/lib/decision";
import type { ConsensusMetrics, ModeratorSummary } from "@/types/roundtable";

export function DecisionCard({ moderator, consensus }: { moderator: ModeratorSummary; consensus: ConsensusMetrics }) {
  const decision = formatDecision(moderator, consensus);
  const details = [
    { label: "Top opportunity", value: decision.topOpportunity, icon: Lightbulb, color: "text-amber-200" },
    { label: "Biggest risk", value: decision.biggestRisk, icon: CircleAlert, color: "text-rose-200" },
    { label: "Most convincing expert", value: decision.mostConvincingExpert, icon: Award, color: "text-violet-200" },
    { label: "Most contrarian opinion", value: decision.mostContrarianOpinion, icon: ArrowUpRight, color: "text-cyan-200" },
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }} className="relative overflow-hidden rounded-3xl border border-violet-300/[0.22] bg-[radial-gradient(circle_at_85%_0%,rgba(99,102,241,0.28),transparent_33%),linear-gradient(125deg,rgba(124,92,255,0.20),rgba(10,14,24,0.95)_55%)] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.35)] sm:p-8">
      <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-violet-200"><Sparkles className="h-3.5 w-3.5" /> The Decision</div>
      <div className="relative mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
        <div><p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Recommended action</p><h2 className="mt-2 max-w-2xl text-2xl font-medium leading-tight tracking-[-0.045em] text-white sm:text-3xl">{decision.recommendedAction}</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{decision.summary}</p></div>
        <div className="flex items-center gap-3 rounded-2xl border border-violet-300/15 bg-black/20 px-3 py-2.5"><ConfidenceRing value={decision.overallConfidence} label="Overall confidence" /><span className="max-w-16 text-xs leading-4 text-slate-400">Overall confidence</span></div>
      </div>
      <div className="relative mt-7 grid gap-3 sm:grid-cols-2">{details.map(({ label, value, icon: Icon, color }, index) => <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + index * 0.08 }} className="rounded-2xl border border-white/[0.09] bg-black/20 p-4"><div className={`flex items-center gap-2 text-xs font-medium ${color}`}><Icon className="h-3.5 w-3.5" /> {label}</div><p className="mt-2 text-sm leading-6 text-slate-200">{value}</p></motion.div>)}</div>
    </motion.section>
  );
}
