import { ShieldAlert } from "lucide-react";

import type { ModeratorSummary } from "@/types/roundtable";

const riskStyles = {
  Low: "border-emerald-300/20 bg-emerald-400/[0.08] text-emerald-200",
  Medium: "border-amber-300/20 bg-amber-400/[0.08] text-amber-200",
  High: "border-rose-300/20 bg-rose-400/[0.08] text-rose-200",
} as const;

export function RiskBadge({ risk, label = true }: { risk: ModeratorSummary["risk"]; label?: boolean }) {
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${riskStyles[risk]}`}>
      <ShieldAlert className="h-3.5 w-3.5" />
      {risk}{label ? " risk" : ""}
    </span>
  );
}
