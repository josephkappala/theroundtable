"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleDashed } from "lucide-react";

import { MarkdownContent } from "@/components/markdown-content";
import type { Analyst, AnalystResult, AnalystStatus } from "@/types/roundtable";
import { cn } from "@/utils/cn";

type AnalystCardProps = {
  analyst: Analyst;
  status: AnalystStatus;
  result?: AnalystResult;
};

export function AnalystCard({ analyst, status, result }: AnalystCardProps) {
  const isThinking = status === "thinking";
  const isComplete = status === "complete";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06]"
            style={{ boxShadow: `0 0 24px color-mix(in srgb, ${analyst.accent} 25%, transparent)` }}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: analyst.accent }} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{analyst.name}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{analyst.role}</p>
          </div>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-medium",
            isComplete ? "text-emerald-300" : isThinking ? "text-violet-300" : "text-slate-600",
          )}
        >
          {isComplete ? <Check className="h-3.5 w-3.5" /> : isThinking ? <CircleDashed className="h-3.5 w-3.5 animate-spin" /> : null}
          {isComplete ? "Complete" : isThinking ? "Thinking" : "Ready"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {isComplete && result ? (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MarkdownContent content={result.content} />
          </motion.div>
        ) : isThinking ? (
          <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5 py-2">
            <div className="h-2.5 w-full animate-soft-pulse rounded-full bg-white/[0.08]" />
            <div className="h-2.5 w-5/6 animate-soft-pulse rounded-full bg-white/[0.06] [animation-delay:250ms]" />
            <div className="h-2.5 w-3/5 animate-soft-pulse rounded-full bg-white/[0.05] [animation-delay:500ms]" />
          </motion.div>
        ) : (
          <p className="min-h-14 text-sm leading-6 text-slate-500">{analyst.description}</p>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
