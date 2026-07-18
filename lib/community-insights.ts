import { z } from "zod";

import type { CommunityAnalytics, CommunityData, CommunityExpert, CommunityResult, CommunityRoundtable, CommunityVote, LeaderboardEntry } from "@/types/community";
import type { PanelDiscussion } from "@/types/roundtable";

const STORAGE_KEY = "the-roundtable.community-insights.v1";
const MAX_RECORDS = 200;
const riskSchema = z.enum(["Low", "Medium", "High"]);
const expertSchema = z.object({ id: z.string().min(1), name: z.string().min(1), role: z.string().min(1), avatar: z.string().min(1), accent: z.string().min(1), confidence: z.number().int().min(0).max(100) });
const roundtableSchema = z.object({ id: z.string().min(1), completedAt: z.string().datetime(), consensus: z.number().int().min(0).max(100), confidence: z.number().int().min(0).max(100), risk: riskSchema, experts: z.array(expertSchema).min(1).max(7) });
const voteSchema = z.object({ discussionId: z.string().min(1), expertId: z.string().min(1), createdAt: z.string().datetime() });
const communityDataSchema = z.object({ version: z.literal(1), roundtables: z.array(roundtableSchema).max(MAX_RECORDS), votes: z.array(voteSchema).max(MAX_RECORDS) });

const emptyData = (): CommunityData => ({ version: 1, roundtables: [], votes: [] });

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function save(data: CommunityData) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Versioned local repository that can later be replaced with a shared community API. */
export function readCommunityData(): CommunityData {
  if (!canUseStorage()) return emptyData();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? communityDataSchema.parse(JSON.parse(stored)) : emptyData();
  } catch {
    return emptyData();
  }
}

function toCommunityRoundtable(discussion: PanelDiscussion): CommunityRoundtable | null {
  if (!discussion.moderator || !discussion.consensus) return null;
  return {
    id: discussion.id,
    completedAt: new Date().toISOString(),
    consensus: discussion.consensus.agreementPercentage,
    confidence: discussion.consensus.confidenceScore,
    risk: discussion.moderator.risk,
    experts: discussion.responses.map(({ analyst, response }) => ({ id: analyst.id, name: response.expert, role: analyst.role, avatar: analyst.avatar, accent: analyst.accent, confidence: response.confidence })),
  };
}

export function recordRoundtable(discussion: PanelDiscussion): CommunityData {
  const roundtable = toCommunityRoundtable(discussion);
  if (!roundtable) return readCommunityData();
  const data = readCommunityData();
  if (data.roundtables.some((entry) => entry.id === roundtable.id)) return data;
  const next = { ...data, roundtables: [...data.roundtables, roundtable].slice(-MAX_RECORDS) };
  save(next);
  return next;
}

export function getDiscussionVote(data: CommunityData, discussionId: string) {
  return data.votes.find((vote) => vote.discussionId === discussionId) ?? null;
}

/** Persists exactly one expert vote per Roundtable discussion. */
export function submitCommunityVote(discussionId: string, expertId: string): CommunityData {
  const data = readCommunityData();
  const roundtable = data.roundtables.find((entry) => entry.id === discussionId);
  if (!roundtable) throw new Error("This Roundtable is not available for voting.");
  if (getDiscussionVote(data, discussionId)) throw new Error("You have already voted on this Roundtable.");
  if (!roundtable.experts.some((expert) => expert.id === expertId)) throw new Error("That expert was not part of this Roundtable.");
  const vote: CommunityVote = { discussionId, expertId, createdAt: new Date().toISOString() };
  const next = { ...data, votes: [...data.votes, vote].slice(-MAX_RECORDS) };
  save(next);
  return next;
}

export function getDiscussionResults(data: CommunityData, discussionId: string): CommunityResult[] {
  const roundtable = data.roundtables.find((entry) => entry.id === discussionId);
  if (!roundtable) return [];
  const votes = data.votes.filter((vote) => vote.discussionId === discussionId);
  const totalVotes = votes.length;
  return roundtable.experts.map((expert) => ({ ...expert, votes: votes.filter((vote) => vote.expertId === expert.id).length, percentage: 0, rank: 0 }))
    .sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name))
    .map((expert, index) => ({ ...expert, percentage: totalVotes ? Math.round((expert.votes / totalVotes) * 100) : 0, rank: index + 1 }));
}

export function getLeaderboard(data: CommunityData): LeaderboardEntry[] {
  const experts = new Map<string, CommunityExpert>();
  data.roundtables.forEach((roundtable) => roundtable.experts.forEach((expert) => experts.set(expert.id, expert)));
  const scoreByExpert = new Map<string, { totalVotes: number; percentages: number[]; discussionsWon: number }>();
  experts.forEach((_, expertId) => scoreByExpert.set(expertId, { totalVotes: 0, percentages: [], discussionsWon: 0 }));
  data.roundtables.forEach((roundtable) => {
    const results = getDiscussionResults(data, roundtable.id);
    const highestVotes = results[0]?.votes ?? 0;
    results.forEach((result) => {
      const score = scoreByExpert.get(result.id);
      if (!score) return;
      score.totalVotes += result.votes;
      score.percentages.push(result.percentage);
      if (highestVotes > 0 && result.votes === highestVotes) score.discussionsWon += 1;
    });
  });
  return [...experts.values()].map((expert) => {
    const score = scoreByExpert.get(expert.id) ?? { totalVotes: 0, percentages: [], discussionsWon: 0 };
    return { ...expert, rank: 0, totalVotes: score.totalVotes, averageVotePercentage: score.percentages.length ? Math.round(score.percentages.reduce((sum, value) => sum + value, 0) / score.percentages.length) : 0, discussionsWon: score.discussionsWon };
  }).sort((a, b) => b.totalVotes - a.totalVotes || b.discussionsWon - a.discussionsWon || a.name.localeCompare(b.name)).map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function getCommunityAnalytics(data: CommunityData): CommunityAnalytics {
  const leaderboard = getLeaderboard(data);
  const riskCounts = data.roundtables.reduce<Record<"Low" | "Medium" | "High", number>>((counts, roundtable) => ({ ...counts, [roundtable.risk]: counts[roundtable.risk] + 1 }), { Low: 0, Medium: 0, High: 0 });
  const risk = (Object.entries(riskCounts).sort(([, left], [, right]) => right - left)[0]?.[0] ?? "Not enough data") as CommunityAnalytics["mostCommonRiskLevel"];
  const average = (values: number[]) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
  return { totalRoundtables: data.roundtables.length, mostTrustedExpert: leaderboard[0]?.name ?? "Not enough data", averageConsensus: average(data.roundtables.map((roundtable) => roundtable.consensus)), averageConfidence: average(data.roundtables.map((roundtable) => roundtable.confidence)), mostCommonRiskLevel: data.roundtables.length ? risk : "Not enough data", totalCommunityVotes: data.votes.length };
}
