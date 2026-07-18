"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Gavel, ShieldAlert, Sparkles } from "lucide-react";

import { RiskBadge } from "@/components/risk-badge";
import type { ModeratorSummary } from "@/types/roundtable";

function InsightList({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: typeof CheckCircle2; tone: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] ${tone}`}><Icon className="h-3.5 w-3.5" /> {title}</div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => <li key={item} className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 text-sm leading-6 text-slate-300">{item}</li>)}
      </ul>
    </div>
  );
}

export function ModeratorCard({ summary }: { summary: ModeratorSummary }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative overflow-hidden rounded-3xl border border-violet-300/[0.20] bg-[linear-gradient(120deg,rgba(124,92,255,0.20),rgba(12,16,27,0.90)_48%,rgba(39,172,255,0.10))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.28)] sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-violet-200"><Gavel className="h-3.5 w-3.5" /> 🎙 Roundtable Moderator</div>
          <h2 className="mt-3 max-w-2xl text-2xl font-medium tracking-[-0.04em] text-white">{summary.consensus}</h2>
        </div>
        <div className="flex items-center gap-3"><RiskBadge risk={summary.risk} /><span className="rounded-full border border-violet-300/20 bg-violet-400/[0.08] px-3 py-1.5 text-xs font-medium text-violet-100">{summary.confidence}% confidence</span></div>
      </div>

      <div className="relative mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Executive summary</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">{summary.summary}</p>
      </div>

      <div className="relative mt-6 grid gap-5 lg:grid-cols-2">
        <InsightList title="Areas of agreement" items={summary.agreements} icon={CheckCircle2} tone="text-emerald-200" />
        <InsightList title="Areas of disagreement" items={summary.disagreements} icon={ShieldAlert} tone="text-amber-200" />
      </div>

      <div className="relative mt-6 rounded-2xl border border-white/[0.10] bg-black/20 p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-violet-200"><Sparkles className="h-3.5 w-3.5" /> Recommended action</div>
        <p className="mt-2 text-sm leading-6 text-white">{summary.recommendation}</p>
      </div>
    </motion.section>
  );
}
