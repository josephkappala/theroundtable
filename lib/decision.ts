import type { ConsensusMetrics, ModeratorSummary } from "@/types/roundtable";

export type FormattedDecision = {
  recommendedAction: string;
  summary: string;
  topOpportunity: string;
  biggestRisk: string;
  mostConvincingExpert: string;
  mostContrarianOpinion: string;
  overallConfidence: number;
};

/** Separates display-ready decision content from the moderator generation pipeline. */
export function formatDecision(moderator: ModeratorSummary, consensus: ConsensusMetrics): FormattedDecision {
  return {
    recommendedAction: moderator.recommendation,
    summary: moderator.summary,
    topOpportunity: moderator.topOpportunity,
    biggestRisk: moderator.biggestRisk,
    mostConvincingExpert: moderator.mostConvincingExpert,
    mostContrarianOpinion: moderator.mostContrarianOpinion,
    overallConfidence: Math.round((moderator.confidence + consensus.confidenceScore) / 2),
  };
}
