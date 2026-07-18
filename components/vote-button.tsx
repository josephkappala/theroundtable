"use client";

import { Check, Vote } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VoteButton({ selected, disabled, onVote }: { selected: boolean; disabled: boolean; onVote: () => void }) {
  return <Button type="button" size="sm" variant={selected ? "default" : "secondary"} disabled={disabled} onClick={onVote}>{selected ? <Check className="h-3.5 w-3.5" /> : <Vote className="h-3.5 w-3.5" />}{selected ? "Your vote" : "Vote for this expert"}</Button>;
}
