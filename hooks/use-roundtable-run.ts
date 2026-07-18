"use client";

import { useCallback, useState } from "react";

import type { ExpertId } from "@/prompts/discussion-experts";
import type { RoundtableApiResponse, RoundtableRun } from "@/types/roundtable";

type RunState = {
  isRunning: boolean;
  error: string | null;
  run: RoundtableRun | null;
};

export function useRoundtableRun() {
  const [state, setState] = useState<RunState>({ isRunning: false, error: null, run: null });

  const runRoundtable = useCallback(async (prompt: string, expertIds?: ExpertId[]) => {
    setState((current) => ({ ...current, isRunning: true, error: null }));

    try {
      const response = await fetch("/api/roundtable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, expertIds }),
      });
      const payload = (await response.json()) as RoundtableApiResponse & { error?: string };

      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Unable to run The Roundtable right now.");
      }

      setState({
        isRunning: false,
        error: null,
        run: { ...payload, completedAt: new Date().toISOString() },
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        isRunning: false,
        error: error instanceof Error ? error.message : "Unable to run The Roundtable right now.",
      }));
    }
  }, []);

  return { ...state, runRoundtable };
}
