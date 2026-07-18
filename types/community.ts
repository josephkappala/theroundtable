import type { ModeratorSummary } from "@/types/roundtable";

export type CommunityExpert = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  accent: string;
  confidence: number;
};

export type CommunityRoundtable = {
  id: string;
  completedAt: string;
  consensus: number;
  confidence: number;
  risk: ModeratorSummary["risk"];
  experts: CommunityExpert[];
};

export type CommunityVote = {
  discussionId: string;
  expertId: string;
  createdAt: string;
};

export type CommunityData = {
  version: 1;
  roundtables: CommunityRoundtable[];
  votes: CommunityVote[];
};

export type CommunityResult = CommunityExpert & {
  votes: number;
  percentage: number;
  rank: number;
};

export type LeaderboardEntry = CommunityExpert & {
  rank: number;
  totalVotes: number;
  averageVotePercentage: number;
  discussionsWon: number;
};

export type CommunityAnalytics = {
  totalRoundtables: number;
  mostTrustedExpert: string;
  averageConsensus: number;
  averageConfidence: number;
  mostCommonRiskLevel: ModeratorSummary["risk"] | "Not enough data";
  totalCommunityVotes: number;
};
