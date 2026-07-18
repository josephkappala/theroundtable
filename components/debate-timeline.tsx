"use client";

import { DiscussionTimeline } from "@/components/discussion-timeline";
import type { DebateTranscript } from "@/types/roundtable";

type DebateTimelineProps = { debate: DebateTranscript; onComplete?: () => void; autoPlay?: boolean };

/** @deprecated Use RoundtableDiscussion or DiscussionTimeline for new UI. */
export function DebateTimeline({ debate, onComplete, autoPlay = true }: DebateTimelineProps) {
  return <DiscussionTimeline transcript={debate} onComplete={onComplete} autoPlay={autoPlay} />;
}
