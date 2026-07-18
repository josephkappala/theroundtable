"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { ContextSummary } from "@/components/context-summary";
import { SourceCard } from "@/components/source-card";
import type { LiveContext } from "@/lib/live-intelligence";

export function SourceDrawer({ context }: { context: LiveContext }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-3">
      <button type="button" aria-expanded={isOpen} aria-controls="live-intelligence-sources" onClick={() => setIsOpen((current) => !current)} className="flex items-center gap-1.5 rounded-lg px-1 py-1 text-xs font-medium text-cyan-200 transition-colors hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
        View sources <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? <motion.div id="live-intelligence-sources" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden"><div className="space-y-3 pt-3"><ContextSummary context={context} /><div className="grid gap-3 sm:grid-cols-2">{context.sources.map((source) => <SourceCard key={source.source} source={source} />)}</div></div></motion.div> : null}
      </AnimatePresence>
    </div>
  );
}
