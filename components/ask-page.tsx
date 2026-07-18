"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, CircleAlert, LoaderCircle, Sparkles, UsersRound } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ConsensusDashboard } from "@/components/consensus-dashboard";
import { DiscussionStageIndicator } from "@/components/discussion-stage-indicator";
import { LiveContextBadge } from "@/components/live-context-badge";
import { ModeratorCard } from "@/components/moderator-card";
import { OpeningStatements } from "@/components/opening-statements";
import { DecisionCard } from "@/components/decision-card";
import { RoundtableAssembly, type RoundtableSeat } from "@/components/roundtable-assembly";
import { RoundtableDiscussion } from "@/components/roundtable-discussion";
import { RoundtableLogo } from "@/components/roundtable-logo";
import { TypingIndicator } from "@/components/typing-indicator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDiscussionEngine } from "@/hooks/use-discussion-engine";
import { buildReport } from "@/lib/roundtable-brief";
import { defaultExpertIds, discussionExperts, expertIds, getDiscussionExpert, type ExpertId } from "@/prompts/discussion-experts";
import { cn } from "@/utils/cn";

const askSchema = z.object({
  prompt: z.string().trim().min(12, "Give The Roundtable a little more context (at least 12 characters).").max(6_000, "Keep the prompt under 6,000 characters."),
  expertIds: z.array(z.enum(expertIds)).min(3, "Choose at least 3 experts.").max(7, "Choose up to 7 experts."),
});

type AskForm = z.infer<typeof askSchema>;

const CommunityInsights = dynamic(() => import("@/components/community-insights").then((module) => module.CommunityInsights), { ssr: false });
const ExportToolbar = dynamic(() => import("@/components/export-toolbar").then((module) => module.ExportToolbar), { ssr: false });

export function AskPage() {
  const { phase, discussion, error, isRunning, isActive, startDiscussion, generateDebate, generateModerator } = useDiscussionEngine();
  const [assemblyComplete, setAssemblyComplete] = useState(false);
  const [openingStatementsComplete, setOpeningStatementsComplete] = useState(false);
  const [activeExpertIds, setActiveExpertIds] = useState<ExpertId[]>([]);
  const form = useForm<AskForm>({
    resolver: zodResolver(askSchema),
    defaultValues: { prompt: "", expertIds: defaultExpertIds },
  });
  const selectedExpertIds = form.watch("expertIds");

  useEffect(() => {
    if (phase !== "opinions_reveal" || !discussion || !assemblyComplete || !openingStatementsComplete) return;
    const timeout = window.setTimeout(generateDebate, 180);
    return () => window.clearTimeout(timeout);
  }, [assemblyComplete, discussion, generateDebate, openingStatementsComplete, phase]);

  const handleAssemblyComplete = useCallback(() => setAssemblyComplete(true), []);
  const handleOpeningStatementsComplete = useCallback(() => setOpeningStatementsComplete(true), []);

  function toggleExpert(id: ExpertId) {
    const current = form.getValues("expertIds");
    const selected = current.includes(id);
    if (selected && current.length === 3) return;
    if (!selected && current.length === 7) return;
    form.setValue("expertIds", selected ? current.filter((item) => item !== id) : [...current, id], { shouldValidate: true, shouldDirty: true });
  }

  async function onSubmit(values: AskForm) {
    setActiveExpertIds(values.expertIds);
    setAssemblyComplete(false);
    setOpeningStatementsComplete(false);
    await startDiscussion(values.prompt, values.expertIds);
  }

  const submitLabel = phase === "opinions_loading" ? "The Roundtable is assembling" : phase === "debate_loading" ? "Opening discussion" : phase === "moderator_loading" ? "Preparing the decision" : isActive ? "Roundtable in progress" : "Start a Roundtable";
  const liveStatus = phase === "opinions_loading" ? "The Roundtable is assembling. Experts are preparing their opening statements." : phase === "opinions_reveal" && !assemblyComplete ? "The Roundtable is assembling." : phase === "opinions_reveal" && !openingStatementsComplete ? "Opening statements are underway." : phase === "debate_loading" ? "The Roundtable is preparing the discussion." : phase === "debate_reveal" ? "The Roundtable discussion is in progress." : phase === "moderator_loading" ? "The Moderator is preparing the decision." : phase === "complete" ? "The Roundtable has reached its decision." : "";
  const assemblyMembers = useMemo<RoundtableSeat[]>(() => activeExpertIds.map((id) => {
    const expert = getDiscussionExpert(id);
    return { id: expert.id, name: expert.name, emoji: expert.emoji, accent: expert.color };
  }), [activeExpertIds]);
  const showAssembly = assemblyMembers.length > 0 && (phase === "opinions_loading" || (phase === "opinions_reveal" && !assemblyComplete));
  const report = useMemo(() => discussion ? buildReport(discussion) : null, [discussion]);
  const retryFailedStage = discussion ? (discussion.debate ? generateModerator : generateDebate) : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-white" aria-busy={isActive}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_70%_48%_at_50%_-4%,rgba(124,92,255,0.28),transparent_72%)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-[27rem] h-80 w-80 rounded-full bg-cyan-400/[0.07] blur-[110px]" />
      <div className="relative mx-auto max-w-5xl px-5 pb-16 sm:px-8 lg:px-10">
        <header className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Back to The Roundtable home">
            <RoundtableLogo />
          </Link>
          <Button variant="ghost" size="sm" asChild><Link href="/"><ChevronLeft className="h-3.5 w-3.5" /> Back to home</Link></Button>
        </header>

        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl pt-12 text-center sm:pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.07] px-3 py-1.5 text-xs font-medium text-violet-200"><Sparkles className="h-3.5 w-3.5" /> Build your Roundtable</div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">Bring the question.<br /><span className="text-slate-500">We’ll bring the perspectives.</span></h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">Bring your toughest questions to The Roundtable and choose the experts you want in the room.</p>
        </motion.section>

        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} onSubmit={form.handleSubmit(onSubmit)} className="relative mx-auto mt-12 max-w-4xl rounded-[28px] border border-white/[0.11] bg-[#0d111c]/75 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-5">
          <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-3 sm:p-4">
            <label htmlFor="question" className="mb-3 block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Your question</label>
            <Textarea id="question" aria-describedby={form.formState.errors.prompt ? "prompt-help prompt-error" : "prompt-help"} aria-invalid={Boolean(form.formState.errors.prompt)} placeholder="Should I quit my job to build my startup?" className="min-h-44 border-0 bg-transparent px-1 py-1 text-base leading-7 placeholder:text-slate-500 focus:ring-0 sm:min-h-52 sm:text-lg" {...form.register("prompt")} />
            <div id="prompt-help" className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3 text-xs text-slate-500"><span>Be specific about the decision and what’s at stake.</span><span>{form.watch("prompt").length}/6,000</span></div>
          </div>
          {form.formState.errors.prompt ? <p id="prompt-error" role="alert" className="px-2 pt-3 text-xs text-rose-300">{form.formState.errors.prompt.message}</p> : null}

          <div className="px-1 pb-1 pt-7 sm:px-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><div className="flex items-center gap-2"><UsersRound className="h-4 w-4 text-violet-300" /><h2 className="text-base font-medium text-white">Choose your Roundtable</h2></div><p className="mt-1 text-sm text-slate-500">Select 3–7 experts. Each one prepares an opening statement independently.</p></div>
              <span className="w-fit rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-3 py-1 text-xs font-medium text-violet-200">{selectedExpertIds.length} of 7 selected</span>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {discussionExperts.map((expert, index) => {
                const isSelected = selectedExpertIds.includes(expert.id);
                const cannotRemove = isSelected && selectedExpertIds.length === 3;
                return (
                  <motion.button
                    layout
                    type="button"
                    key={expert.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.035 }}
                    onClick={() => toggleExpert(expert.id)}
                    aria-pressed={isSelected}
                    disabled={cannotRemove}
                    className={cn("group flex items-center gap-3 rounded-xl border p-3 text-left transition-all disabled:cursor-not-allowed", isSelected ? "border-violet-300/35 bg-violet-400/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" : "border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]", cannotRemove && "opacity-75")}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-black/20 text-lg">{expert.emoji}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-100">{expert.name}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{expert.role}</span></span>
                    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors", isSelected ? "border-violet-300 bg-violet-400 text-white" : "border-white/15 text-transparent")}><Check className="h-3 w-3" /></span>
                  </motion.button>
                );
              })}
            </div>
            {form.formState.errors.expertIds ? <p role="alert" className="mt-3 text-xs text-rose-300">{form.formState.errors.expertIds.message}</p> : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.08] px-1 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-2">
            <p className="text-xs leading-5 text-slate-500">Your question is shared only with the selected experts, the discussion, and the final decision.</p>
            <Button type="submit" size="lg" disabled={isActive} className="h-[52px] min-w-52 rounded-2xl px-7">
              {isRunning ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {submitLabel}
              {!isActive ? <ArrowRight className="h-4 w-4" /> : null}
            </Button>
          </div>
        </motion.form>

        <p className="sr-only" role="status" aria-live="polite">{liveStatus}</p>
        {discussion ? <div className="mx-auto mt-7 max-w-4xl"><DiscussionStageIndicator phase={phase} /></div> : null}
        <AnimatePresence>{error ? <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" aria-live="assertive" className="mx-auto mt-4 flex max-w-4xl items-start justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200"><span className="flex items-start gap-2.5"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />{error}</span>{retryFailedStage ? <Button type="button" size="sm" variant="secondary" onClick={retryFailedStage}>Retry stage</Button> : null}</motion.div> : null}</AnimatePresence>
        {showAssembly ? <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto mt-10 max-w-4xl"><RoundtableAssembly members={assemblyMembers} onComplete={handleAssemblyComplete} /></motion.section> : null}
        {phase === "opinions_loading" && assemblyComplete ? <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-8 max-w-4xl"><TypingIndicator label="Experts are preparing their opening statements…" /></motion.div> : null}

        <AnimatePresence>
          {discussion ? (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto mt-10 max-w-4xl">
              {discussion.liveContext ? <div className="mb-6"><LiveContextBadge context={discussion.liveContext} /></div> : null}
              {!showAssembly ? <OpeningStatements statements={discussion.responses} onComplete={handleOpeningStatementsComplete} /> : null}
              {phase === "debate_loading" ? <div className="mt-8"><p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Stage 2 · Roundtable Discussion</p><TypingIndicator label="The Roundtable is preparing the discussion…" /></div> : null}
              {discussion.debate ? <section className="mt-8"><div className="mb-4"><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Stage 2 · Roundtable Discussion</p><h2 className="mt-1 text-xl font-medium tracking-[-0.035em] text-white">Watch the experts challenge, refine, and build on each other’s ideas.</h2></div><RoundtableDiscussion transcript={discussion.debate} autoPlay={phase === "debate_reveal"} onComplete={generateModerator} /></section> : null}
              {phase === "moderator_loading" ? <div className="mt-8"><p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Stage 3 · Roundtable Moderator</p><TypingIndicator label="The Moderator is preparing the decision…" /></div> : null}
              {discussion.moderator && discussion.consensus ? <section className="mt-8 space-y-6"><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Stage 3 · Roundtable Moderator</p><ModeratorCard summary={discussion.moderator} /><div><p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Stage 4 · Roundtable Consensus</p><ConsensusDashboard consensus={discussion.consensus} /></div><div><p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Stage 5 · The Decision</p><DecisionCard moderator={discussion.moderator} consensus={discussion.consensus} /></div><CommunityInsights discussion={discussion} />{report ? <div><p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Roundtable Brief</p><ExportToolbar report={report} /></div> : null}</section> : null}
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
