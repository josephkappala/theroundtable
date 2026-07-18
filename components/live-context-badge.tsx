"use client";

import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

import { SourceDrawer } from "@/components/source-drawer";
import type { LiveContext } from "@/lib/live-intelligence";

export function LiveContextBadge({ context }: { context: LiveContext }) {
  return (
    <motion.aside initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-2xl border border-cyan-300/[0.16] bg-[linear-gradient(110deg,rgba(34,211,238,0.10),rgba(124,92,255,0.07))] px-4 py-3 shadow-[0_12px_38px_rgba(8,47,73,0.18)]">
      <div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyan-300/[0.16] bg-cyan-400/[0.10] text-cyan-100"><Globe2 className="h-4 w-4" /></span><div><p className="text-sm font-medium text-cyan-100">🌐 Live Intelligence Enabled</p><p className="mt-0.5 text-xs leading-5 text-slate-400">Experts are using fresh information.</p><SourceDrawer context={context} /></div></div>
    </motion.aside>
  );
}
