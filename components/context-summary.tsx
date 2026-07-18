import { Clock3 } from "lucide-react";

import type { LiveContext } from "@/lib/live-intelligence";

export function ContextSummary({ context }: { context: LiveContext }) {
  const retrievedAt = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(context.retrievedAt));
  return (
    <div className="rounded-2xl border border-cyan-300/[0.12] bg-cyan-400/[0.045] p-4">
      <p className="text-sm leading-6 text-slate-300">{context.summary}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" /> Retrieved {retrievedAt}</p>
    </div>
  );
}
