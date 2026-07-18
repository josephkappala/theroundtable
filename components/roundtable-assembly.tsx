"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Armchair, Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export type RoundtableSeat = {
  id: string;
  name: string;
  emoji: string;
  accent: string;
};

type RoundtableAssemblyProps = {
  members: RoundtableSeat[];
  onComplete: () => void;
};

export function RoundtableAssembly({ members, onComplete }: RoundtableAssemblyProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visibleMembers, setVisibleMembers] = useState(prefersReducedMotion ? members.length : 0);
  const [hasBegun, setHasBegun] = useState(prefersReducedMotion);

  useEffect(() => {
    const firstJoinDelay = prefersReducedMotion ? 0 : 600;
    const subsequentJoinDelay = prefersReducedMotion ? 0 : 500;
    const discussionDelay = prefersReducedMotion ? 0 : 700;
    const delayForMember = (index: number) => firstJoinDelay + Math.max(0, index) * subsequentJoinDelay;
    const beginAt = delayForMember(Math.max(members.length - 1, 0)) + discussionDelay;
    const timers = members.map((_, index) => window.setTimeout(() => setVisibleMembers(index + 1), delayForMember(index)));
    const beginTimer = window.setTimeout(() => setHasBegun(true), beginAt);
    const completeTimer = window.setTimeout(onComplete, beginAt + (prefersReducedMotion ? 0 : 420));

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(beginTimer);
      window.clearTimeout(completeTimer);
    };
  }, [members, onComplete, prefersReducedMotion]);

  const status = hasBegun
    ? "Discussion begins."
    : visibleMembers === 0
      ? "The Roundtable is assembling."
      : `${members[Math.min(visibleMembers - 1, members.length - 1)]?.name ?? "An expert"} has joined.`;

  return (
    <motion.section initial={{ opacity: 0, y: 12, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }} className="relative overflow-hidden rounded-3xl border border-violet-300/[0.16] bg-[#0d111c]/80 p-5 shadow-[0_18px_54px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-6">
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-400/[0.13] blur-3xl" />
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/[0.08] text-violet-200"><Armchair className="h-[18px] w-[18px]" /></span>
        <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Preparing the Roundtable</p><h2 className="mt-1 text-xl font-medium tracking-[-0.035em] text-white">The Roundtable is assembling…</h2></div>
      </div>
      <div className="mt-5 space-y-2.5" aria-hidden="true">
        {members.slice(0, visibleMembers).map((member) => (
          <motion.div key={member.id} initial={{ opacity: 0, x: -14, y: 5, scale: 0.98 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }} className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 shadow-[0_8px_26px_rgba(0,0,0,0.12)]">
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1" style={{ background: member.accent, boxShadow: `0 0 18px ${member.accent}` }} />
            <span className="text-lg leading-none">{member.emoji}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-200">{member.name}</span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-200"><Check className="h-3.5 w-3.5" /> has joined</span>
          </motion.div>
        ))}
      </div>
      {hasBegun ? <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex items-center gap-2 text-sm font-medium text-violet-100"><Sparkles className="h-4 w-4 text-violet-300" /> Discussion begins.</motion.div> : null}
    </motion.section>
  );
}
