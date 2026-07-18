"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Activity, BadgeCheck, Gauge } from "lucide-react";
import { useEffect, useState } from "react";

import { ConfidenceRing } from "@/components/confidence-ring";
import { ConsensusMeter } from "@/components/consensus-meter";
import { RiskBadge } from "@/components/risk-badge";
import { VoteBreakdown } from "@/components/vote-breakdown";
import type { ConsensusMetrics } from "@/types/roundtable";

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, value]);

  return <>{display}{suffix}</>;
}

export function ConsensusDashboard({ consensus }: { consensus: ConsensusMetrics }) {
  const metrics = [
    { label: "Agreement level", value: consensus.agreementLevel, icon: BadgeCheck, color: "text-violet-200" },
    { label: "Expert alignment", value: consensus.expertAlignment, icon: Activity, color: "text-cyan-200" },
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-3xl border border-white/[0.10] bg-[#0d111c]/80 p-5 shadow-[0_18px_54px_rgba(0,0,0,0.2)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Roundtable Consensus</p><h2 className="mt-1 text-xl font-medium tracking-[-0.035em] text-white">Where The Roundtable aligned</h2></div>
        <RiskBadge risk={consensus.riskLevel} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {metrics.map(({ label, value, icon: Icon, color }, index) => <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"><div className="flex items-center gap-2 text-xs text-slate-500"><Icon className={`h-3.5 w-3.5 ${color}`} /> {label}</div><p className={`mt-3 text-lg font-medium tracking-[-0.03em] ${color}`}>{value}</p></motion.div>)}
      </div>

      <div className="mt-6 grid gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="space-y-5">
          <ConsensusMeter label="Overall consensus" value={consensus.agreementPercentage} detail={`${consensus.overallConsensus} · ${consensus.agreementPercentage}%`} />
          <ConsensusMeter label="Risk indicator" value={consensus.riskScore} detail={`${consensus.riskLevel} risk`} tone="amber" />
        </div>
        <div className="flex items-center gap-4 border-t border-white/[0.08] pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"><ConfidenceRing value={consensus.confidenceScore} /><div><div className="flex items-center gap-2 text-xs text-slate-500"><Gauge className="h-3.5 w-3.5 text-violet-200" /> Average confidence</div><p className="mt-2 text-xl font-medium tracking-[-0.04em] text-white"><CountUp value={consensus.confidenceScore} suffix="%" /></p></div></div>
      </div>

      <div className="mt-7"><p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Expert votes</p><VoteBreakdown votes={consensus.votes} /></div>
    </motion.section>
  );
}
