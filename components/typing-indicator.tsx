"use client";

import { motion } from "framer-motion";

export function TypingIndicator({ label = "Preparing the Roundtable…" }: { label?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="status" aria-live="polite" className="flex w-fit items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5 text-xs text-slate-400">
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((dot) => <motion.i key={dot} animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }} transition={{ duration: 0.9, delay: dot * 0.14, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-violet-300" />)}
      </span>
      {label}
    </motion.div>
  );
}
