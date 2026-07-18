"use client";

import { DiscussionTimeline } from "@/components/discussion-timeline";
import type { DebateTranscript } from "@/types/roundtable";

type RoundtableDiscussionProps = {
  transcript: DebateTranscript;
  onComplete?: () => void;
  autoPlay?: boolean;
};

export function RoundtableDiscussion({ transcript, onComplete, autoPlay = true }: RoundtableDiscussionProps) {
  return <DiscussionTimeline transcript={transcript} onComplete={onComplete} autoPlay={autoPlay} />;
}
