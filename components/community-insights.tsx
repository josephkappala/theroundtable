"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, BrainCircuit, CheckCircle2, ShieldAlert, UsersRound, Vote } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AnalyticsCard } from "@/components/analytics-card";
import { CommunityFavorite } from "@/components/community-favorite";
import { Leaderboard } from "@/components/leaderboard";
import { VoteCard } from "@/components/vote-card";
import { getCommunityAnalytics, getDiscussionResults, getDiscussionVote, getLeaderboard, readCommunityData, recordRoundtable, submitCommunityVote } from "@/lib/community-insights";
import type { CommunityData } from "@/types/community";
import type { PanelDiscussion } from "@/types/roundtable";

export function CommunityInsights({ discussion }: { discussion: PanelDiscussion }) {
  const [data, setData] = useState<CommunityData | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);

  useEffect(() => {
    const recorded = recordRoundtable(discussion);
    setData(recorded);
  }, [discussion]);

  const currentVote = data ? getDiscussionVote(data, discussion.id) : null;
  const results = useMemo(() => data ? getDiscussionResults(data, discussion.id) : [], [data, discussion.id]);
  const leaderboard = useMemo(() => data ? getLeaderboard(data) : [], [data]);
  const analytics = useMemo(() => data ? getCommunityAnalytics(data) : null, [data]);
  const favorite = results[0]?.votes ? results[0] : null;

  function castVote(expertId: string) {
    if (currentVote) return;
    try {
      setData(submitCommunityVote(discussion.id, expertId));
      setVoteError(null);
    } catch (error) {
      setVoteError(error instanceof Error ? error.message : "Your vote could not be recorded.");
    }
  }

  if (!data || !analytics) return null;

  return <section className="space-y-6" aria-labelledby="community-insights-title"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300">Community Insights</p><h2 id="community-insights-title" className="mt-1 text-xl font-medium tracking-[-0.035em] text-white">Who made the strongest argument?</h2><p className="mt-2 text-sm text-slate-400">Choose the expert whose perspective most improved this Roundtable.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{data.roundtables.find((item) => item.id === discussion.id)?.experts.map((expert, index) => <VoteCard key={expert.id} expert={expert} index={index} selected={currentVote?.expertId === expert.id} disabled={Boolean(currentVote)} onVote={() => castVote(expert.id)} />)}</div><AnimatePresence>{voteError ? <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className="text-sm text-rose-300">{voteError}</motion.p> : null}</AnimatePresence>{currentVote ? <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5"><div className="flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-100"><CheckCircle2 className="h-4 w-4" /> Thanks for adding your perspective. Community results are now revealed.</div>{favorite ? <CommunityFavorite expert={favorite} /> : null}<section className="rounded-3xl border border-white/[0.10] bg-[#0d111c]/80 p-5 sm:p-6"><div className="flex items-center gap-2"><Vote className="h-4 w-4 text-violet-200" /><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Community Results</p><h3 className="mt-1 text-lg font-medium tracking-[-0.03em] text-white">This Roundtable&apos;s ranking</h3></div></div><div className="mt-6 space-y-4">{results.map((result, index) => <motion.div key={result.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-medium text-slate-200">{result.name}</span><span className="text-violet-200">{result.percentage}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[0.07]"><motion.div initial={{ width: 0 }} animate={{ width: `${result.percentage}%` }} transition={{ delay: 0.2 + index * 0.08, duration: 0.7, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-300 shadow-[0_0_16px_rgba(139,92,246,0.75)]" /></div></motion.div>)}</div></section><Leaderboard entries={leaderboard} /><section className="rounded-3xl border border-white/[0.10] bg-[#0d111c]/80 p-5 sm:p-6"><div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-cyan-200" /><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Roundtable Analytics</p><h3 className="mt-1 text-lg font-medium tracking-[-0.03em] text-white">What the community has valued</h3></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><AnalyticsCard label="Total Roundtables" value={analytics.totalRoundtables} icon={UsersRound} /><AnalyticsCard label="Most trusted expert" value={analytics.mostTrustedExpert} icon={BrainCircuit} /><AnalyticsCard label="Average consensus" value={analytics.averageConsensus} suffix="%" icon={BarChart3} /><AnalyticsCard label="Average confidence" value={analytics.averageConfidence} suffix="%" icon={BrainCircuit} /><AnalyticsCard label="Common risk level" value={analytics.mostCommonRiskLevel} icon={ShieldAlert} /><AnalyticsCard label="Community votes" value={analytics.totalCommunityVotes} icon={Vote} /></div></section></motion.div> : null}</section>;
}
