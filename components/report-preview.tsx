"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { ReportSection } from "@/components/report-section";
import { Button } from "@/components/ui/button";
import type { RoundtableReport } from "@/lib/roundtable-brief";

export function ReportPreview({ report, open, onOpenChange }: { report: RoundtableReport; open: boolean; onOpenChange: (open: boolean) => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onOpenChange(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { window.removeEventListener("keydown", closeOnEscape); lastFocusedElement.current?.focus(); };
  }, [onOpenChange, open]);

  return <AnimatePresence>{open ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onOpenChange(false); }} className="fixed inset-0 z-50 grid place-items-center bg-[#050711]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="report-preview-title"><motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/[0.14] bg-[#101522] shadow-2xl"><header className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-200">Report Preview</p><h2 id="report-preview-title" className="mt-1 text-lg font-medium text-white">Roundtable Brief</h2></div><Button ref={closeButtonRef} type="button" variant="ghost" size="icon" aria-label="Close report preview" onClick={() => onOpenChange(false)}><X className="h-4 w-4" /></Button></header><div className="overflow-y-auto p-4 sm:p-8"><article className="mx-auto max-w-3xl bg-white px-6 py-8 text-slate-950 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:px-10 sm:py-12"><header className="border-b border-slate-200 pb-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">The Roundtable</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">Roundtable Brief</h1><p className="mt-4 text-sm leading-6 text-slate-600">{report.question}</p><p className="mt-4 text-xs text-slate-400">Generated {new Date(report.generatedAt).toLocaleString()}</p></header><div className="space-y-8 pt-8"><ReportSection title="Opening Statements"><div className="space-y-4">{report.openingStatements.map(({ analyst, response }) => <div key={analyst.id}><p className="font-semibold text-slate-900">{response.expert} <span className="font-normal text-slate-500">· {response.stance} · {response.confidence}%</span></p><p className="mt-1">{response.summary}</p></div>)}</div></ReportSection><ReportSection title="Roundtable Discussion"><div className="space-y-3">{report.discussion.messages.map((message, index) => <p key={`${message.speaker}-${index}`}><span className="font-semibold text-slate-900">{message.speaker}:</span> {message.message}</p>)}</div></ReportSection><ReportSection title="Moderator Summary"><p>{report.moderator.summary}</p><p className="mt-4 font-semibold text-slate-900">Recommended action</p><p>{report.moderator.recommendation}</p></ReportSection><ReportSection title="Roundtable Consensus"><p>{report.consensus.overallConsensus} · {report.consensus.agreementPercentage}% agreement · {report.consensus.confidenceScore}% confidence · {report.consensus.riskLevel} risk</p></ReportSection><ReportSection title="The Decision"><p className="font-semibold text-slate-900">{report.decision.recommendedAction}</p><p className="mt-3">{report.decision.summary}</p><dl className="mt-4 grid gap-3 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top opportunity</dt><dd>{report.decision.topOpportunity}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Biggest risk</dt><dd>{report.decision.biggestRisk}</dd></div></dl></ReportSection></div><footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400">The Roundtable · One question. Multiple AI experts. Better decisions.</footer></article></div></motion.div></motion.div> : null}</AnimatePresence>;
}
