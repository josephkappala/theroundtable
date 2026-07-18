import type { ReactNode } from "react";

export function ReportSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0"><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">{title}</h3><div className="mt-3 text-sm leading-6 text-slate-700">{children}</div></section>;
}
