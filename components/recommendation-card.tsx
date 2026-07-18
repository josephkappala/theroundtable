import { DecisionCard } from "@/components/decision-card";
import type { ConsensusMetrics, ModeratorSummary } from "@/types/roundtable";

/** @deprecated Use DecisionCard for new Roundtable decision surfaces. */
export function RecommendationCard({ moderator, consensus }: { moderator: ModeratorSummary; consensus: ConsensusMetrics }) {
  return <DecisionCard moderator={moderator} consensus={consensus} />;
}
