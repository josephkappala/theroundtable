"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ConsensusMeter({ label, value, detail, tone = "violet" }: { label: string; value: number; detail?: string; tone?: "violet" | "cyan" | "amber" }) {
  const prefersReducedMotion = useReducedMotion();
  const color = {
    violet: "from-violet-400 via-indigo-400 to-cyan-300",
    cyan: "from-cyan-400 via-sky-400 to-violet-300",
    amber: "from-amber-400 via-orange-300 to-rose-300",
  }[tone];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-xs text-slate-500">
        <span>{label}</span>
        <span className="shrink-0 font-medium text-slate-300">{detail ?? `${value}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0 : 0.9, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${color} shadow-[0_0_18px_rgba(139,92,246,0.75)]`}
        />
      </div>
    </div>
  );
}
