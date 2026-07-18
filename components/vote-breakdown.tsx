import { VoteList } from "@/components/vote-list";
import type { ConsensusMetrics } from "@/types/roundtable";

/** A semantic name for the expert-vote view used by the consensus dashboard. */
export function VoteBreakdown({ votes }: { votes: ConsensusMetrics["votes"] }) {
  return <VoteList votes={votes} />;
}
