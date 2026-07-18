"use client";

import { useEffect, useRef, useState } from "react";

import { DiscussionBubble } from "@/components/discussion-bubble";
import { TypingIndicator } from "@/components/typing-indicator";
import type { DebateTranscript } from "@/types/roundtable";

type DiscussionTimelineProps = {
  transcript: DebateTranscript;
  onComplete?: () => void;
  autoPlay?: boolean;
};

export function DiscussionTimeline({ transcript, onComplete, autoPlay = true }: DiscussionTimelineProps) {
  const [visibleMessages, setVisibleMessages] = useState(autoPlay ? 0 : transcript.messages.length);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const transcriptKey = transcript.messages.map((message) => `${message.speaker}:${message.message}`).join("|");

  useEffect(() => {
    completedRef.current = false;
    setVisibleMessages(autoPlay ? 0 : transcript.messages.length);
  }, [autoPlay, transcript.messages.length, transcriptKey]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setTimeout(() => {
      if (visibleMessages < transcript.messages.length) {
        setVisibleMessages((count) => count + 1);
      } else if (!completedRef.current && onComplete) {
        completedRef.current = true;
        onComplete();
      }
    }, 1_000);
    return () => window.clearTimeout(timer);
  }, [autoPlay, onComplete, transcript.messages.length, visibleMessages]);

  useEffect(() => {
    const element = scrollerRef.current;
    if (element) element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [visibleMessages]);

  return (
    <div ref={scrollerRef} role="log" aria-label="Roundtable Discussion" aria-live="polite" aria-relevant="additions text" className="max-h-[610px] space-y-4 overflow-y-auto rounded-3xl border border-white/[0.10] bg-[#0c101a]/80 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.2)] [scrollbar-width:thin] sm:p-6">
      {transcript.messages.slice(0, visibleMessages).map((message, index) => <DiscussionBubble key={`${message.speaker}-${index}`} message={message} index={index} />)}
      {autoPlay && visibleMessages < transcript.messages.length ? <TypingIndicator label={visibleMessages === 0 ? "The experts are taking their seats in the discussion…" : "An expert is responding…"} /> : null}
    </div>
  );
}
