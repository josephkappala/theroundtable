"use client";

import { useCallback, useState } from "react";

import type { ExpertId } from "@/prompts/discussion-experts";
import type { LiveContext } from "@/lib/live-intelligence";
import type { ConsensusMetrics, DebateTranscript, ExpertFailure, AnalystResult, ModeratorSummary, PanelDiscussion } from "@/types/roundtable";

export type DiscussionPhase = "idle" | "opinions_loading" | "opinions_reveal" | "debate_loading" | "debate_reveal" | "moderator_loading" | "complete" | "error";

type EngineState = {
  phase: DiscussionPhase;
  discussion: PanelDiscussion | null;
  error: string | null;
};

type OpinionsPayload = { stage: "opinions"; id: string; question: string; responses: AnalystResult[]; failures: ExpertFailure[]; liveContext: LiveContext | null };
type DebatePayload = { stage: "debate"; debate: DebateTranscript };
type ModeratorPayload = { stage: "moderator"; moderator: ModeratorSummary; consensus: ConsensusMetrics };

async function postDiscussionStage<T>(body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch("/api/discuss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("We couldn’t reach The Roundtable. Check your connection and try again.");
  }
  const responseText = await response.text();
  let payload: T & { error?: string };

  try {
    payload = JSON.parse(responseText) as T & { error?: string };
  } catch {
    throw new Error(response.ok ? "The Roundtable returned an unexpected response. Please try again." : "The Roundtable is temporarily unavailable. Please try again.");
  }

  if (response.status === 429) throw new Error("The Roundtable is experiencing high demand. Please retry in a moment.");
  if (!response.ok || payload.error) throw new Error(payload.error ?? "Unable to start The Roundtable right now.");
  return payload;
}

export function useDiscussionEngine() {
  const [state, setState] = useState<EngineState>({ phase: "idle", discussion: null, error: null });

  const startDiscussion = useCallback(async (question: string, expertIds: ExpertId[]) => {
    setState({ phase: "opinions_loading", discussion: null, error: null });
    try {
      const payload = await postDiscussionStage<OpinionsPayload>({ stage: "opinions", question, expertIds });
      setState({
        phase: "opinions_reveal",
        error: null,
        discussion: { id: payload.id, question: payload.question, responses: payload.responses, failures: payload.failures, liveContext: payload.liveContext },
      });
    } catch (error) {
      setState({ phase: "error", discussion: null, error: error instanceof Error ? error.message : "Unable to start The Roundtable right now." });
    }
  }, []);

  const generateDebate = useCallback(async () => {
    const canRetry = state.phase === "error" && !state.discussion?.debate;
    if (!state.discussion || (state.phase !== "opinions_reveal" && !canRetry)) return;
    setState((current) => ({ ...current, phase: "debate_loading", error: null }));
    try {
      const payload = await postDiscussionStage<DebatePayload>({ stage: "debate", question: state.discussion.question, responses: state.discussion.responses, liveContext: state.discussion.liveContext ?? null });
      setState((current) => current.discussion ? { ...current, phase: "debate_reveal", discussion: { ...current.discussion, debate: payload.debate } } : current);
    } catch (error) {
      setState((current) => ({ ...current, phase: "error", error: error instanceof Error ? error.message : "Unable to generate the Roundtable discussion." }));
    }
  }, [state.discussion, state.phase]);

  const generateModerator = useCallback(async () => {
    const canRetry = state.phase === "error" && !state.discussion?.moderator;
    if (!state.discussion?.debate || (state.phase !== "debate_reveal" && !canRetry)) return;
    setState((current) => ({ ...current, phase: "moderator_loading", error: null }));
    try {
      const payload = await postDiscussionStage<ModeratorPayload>({ stage: "moderator", question: state.discussion.question, responses: state.discussion.responses, debate: state.discussion.debate, liveContext: state.discussion.liveContext ?? null });
      setState((current) => current.discussion ? { ...current, phase: "complete", discussion: { ...current.discussion, moderator: payload.moderator, consensus: payload.consensus } } : current);
    } catch (error) {
      setState((current) => ({ ...current, phase: "error", error: error instanceof Error ? error.message : "Unable to prepare the Roundtable decision." }));
    }
  }, [state.discussion, state.phase]);

  return { ...state, isRunning: state.phase.endsWith("loading"), isActive: !["idle", "complete", "error"].includes(state.phase), startDiscussion, generateDebate, generateModerator };
}
