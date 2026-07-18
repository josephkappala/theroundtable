import { Trophy } from "lucide-react";

import { LeaderboardRow } from "@/components/leaderboard-row";
import type { LeaderboardEntry } from "@/types/community";

export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return <section className="rounded-3xl border border-white/[0.10] bg-[#0d111c]/80 p-5 sm:p-6"><div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-200" /><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Expert Leaderboard</p><h3 className="mt-1 text-lg font-medium tracking-[-0.03em] text-white">The experts the community trusts most</h3></div></div><div className="mt-5 space-y-2">{entries.slice(0, 5).map((entry) => <LeaderboardRow key={entry.id} entry={entry} />)}</div></section>;
}
