import { Medal } from "lucide-react";
import Image from "next/image";

import type { LeaderboardEntry } from "@/types/community";

const medalTone = ["text-amber-200", "text-slate-200", "text-orange-300"];

export function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3"><div className={`grid h-7 w-7 place-items-center rounded-lg bg-white/[0.05] text-xs font-semibold ${medalTone[entry.rank - 1] ?? "text-slate-400"}`}>{entry.rank <= 3 ? <Medal className="h-4 w-4" /> : `#${entry.rank}`}</div><Image src={entry.avatar} alt="" width={32} height={32} className="h-8 w-8 rounded-lg border border-white/10 bg-black/20" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-100">{entry.name}</p><p className="text-xs text-slate-500">{entry.discussionsWon} discussions won · {entry.averageVotePercentage}% average vote</p></div><span className="text-xs font-medium text-violet-200">{entry.totalVotes} votes</span></div>;
}
