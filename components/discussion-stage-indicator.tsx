"use client";

import { motion } from "framer-motion";
import { Check, CircleDot, Gavel, MessagesSquare, UsersRound } from "lucide-react";

import type { DiscussionPhase } from "@/hooks/use-discussion-engine";
import { cn } from "@/utils/cn";

const stages = [
  { id: "opinions", label: "Opening Statements", icon: UsersRound },
  { id: "debate", label: "Roundtable Discussion", icon: MessagesSquare },
  { id: "moderator", label: "Roundtable Moderator", icon: Gavel },
] as const;

function stageState(phase: DiscussionPhase, stage: (typeof stages)[number]["id"]) {
  const order = { opinions: 0, debate: 1, moderator: 2 } as const;
  const current = phase.startsWith("opinions") ? 0 : phase.startsWith("debate") ? 1 : phase === "moderator_loading" || phase === "complete" ? 2 : -1;
  if (order[stage] < current || phase === "complete") return "complete";
  if (order[stage] === current) return "active";
  return "upcoming";
}

export function DiscussionStageIndicator({ phase }: { phase: DiscussionPhase }) {
  if (phase === "idle" || phase === "error") return null;
  return (
    <nav aria-label="Roundtable progress" className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] p-2">
      <ol className="grid grid-cols-3 gap-1">
        {stages.map((stage) => {
          const state = stageState(phase, stage.id);
          const Icon = state === "complete" ? Check : state === "active" ? CircleDot : stage.icon;
          return (
            <li key={stage.id} aria-current={state === "active" ? "step" : undefined} className={cn("relative flex min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-center text-[11px] font-medium transition-colors sm:text-xs", state === "active" && "bg-violet-400/[0.12] text-violet-100", state === "complete" && "text-emerald-200", state === "upcoming" && "text-slate-600")}>
              {state === "active" ? <motion.span layoutId="discussion-stage" className="absolute inset-0 rounded-xl border border-violet-300/[0.16] bg-violet-400/[0.06]" transition={{ type: "spring", duration: 0.55 }} /> : null}
              <Icon className="relative h-3.5 w-3.5 shrink-0" />
              <span className="relative truncate">{stage.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
