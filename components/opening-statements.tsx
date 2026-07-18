"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ExpertCard } from "@/components/expert-card";
import type { AnalystResult } from "@/types/roundtable";

type OpeningStatementsProps = {
  statements: AnalystResult[];
  onComplete: () => void;
};

export function OpeningStatements({ statements, onComplete }: OpeningStatementsProps) {
  const prefersReducedMotion = useReducedMotion();
  const statementKey = useMemo(() => statements.map(({ analyst }) => analyst.id).join("|"), [statements]);
  const [visibleStatements, setVisibleStatements] = useState(prefersReducedMotion ? statements.length : 0);
  const [isComplete, setIsComplete] = useState(prefersReducedMotion);

  useEffect(() => {
    const firstStatementDelay = prefersReducedMotion ? 0 : 400;
    const betweenStatementsDelay = prefersReducedMotion ? 0 : 750;
    const settleDelay = prefersReducedMotion ? 0 : 550;
    const delayForStatement = (index: number) => firstStatementDelay + index * betweenStatementsDelay;
    const completeAt = delayForStatement(Math.max(statements.length - 1, 0)) + settleDelay;

    setVisibleStatements(prefersReducedMotion ? statements.length : 0);
    setIsComplete(prefersReducedMotion);
    const timers = statements.map((_, index) => window.setTimeout(() => setVisibleStatements(index + 1), delayForStatement(index)));
    const completeTimer = window.setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, completeAt);

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, prefersReducedMotion, statementKey, statements]);

  const status = isComplete
    ? "Every opening statement is in. The Roundtable discussion is about to begin."
    : visibleStatements === 0
      ? "The first opening statement is about to begin."
      : `${statements[Math.min(visibleStatements - 1, statements.length - 1)]?.analyst.name ?? "An expert"} has delivered an opening statement.`;

  return (
    <section>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Stage 1 · Opening Statements</p><h2 className="mt-1 text-xl font-medium tracking-[-0.035em] text-white">The Roundtable is in session.</h2></div>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-slate-400">{visibleStatements} of {statements.length}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {statements.slice(0, visibleStatements).map((statement, index) => <ExpertCard key={statement.analyst.id} result={statement} index={index} revealDelay={0} />)}
      </div>
      {!isComplete ? <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex items-center gap-2 text-xs text-violet-200"><Sparkles className="h-3.5 w-3.5" /> {visibleStatements === 0 ? "An expert is taking the floor…" : "The next expert is preparing to speak…"}</motion.div> : null}
    </section>
  );
}
