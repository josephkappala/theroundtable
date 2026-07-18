import { ExternalLink } from "lucide-react";

import type { LiveContext } from "@/lib/live-intelligence";

export function SourceCard({ source }: { source: LiveContext["sources"][number] }) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3"><h4 className="text-sm font-medium leading-5 text-slate-100">{source.title}</h4><a href={source.source} target="_blank" rel="noreferrer" aria-label={`Open ${source.title} in a new tab`} className="shrink-0 text-cyan-200 transition-colors hover:text-cyan-100"><ExternalLink className="h-4 w-4" /></a></div>
      <p className="mt-2 text-sm leading-6 text-slate-400">{source.summary}</p>
      <a href={source.source} target="_blank" rel="noreferrer" className="mt-3 block truncate text-xs text-violet-200 transition-colors hover:text-violet-100">{new URL(source.source).hostname}</a>
    </article>
  );
}
