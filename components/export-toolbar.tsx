"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCopy, Eye, FileDown, FileText, LoaderCircle, Sparkles } from "lucide-react";
import { useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { exportMarkdown } from "@/components/markdown-exporter";
import { PDFExporter } from "@/components/pdf-exporter";
import { ReportPreview } from "@/components/report-preview";
import { Button } from "@/components/ui/button";
import { copyReport, generateRichText } from "@/lib/report-export";
import { generateMarkdown, generatePlainText, type RoundtableReport } from "@/lib/roundtable-brief";

type Action = "pdf" | "markdown" | "full" | "summary" | "rich" | null;

function summaryText(report: RoundtableReport) {
  return ["The Roundtable — Decision Summary", "", `Question: ${report.question}`, "", "The Decision", report.decision.recommendedAction, "", report.decision.summary, "", `Consensus: ${report.consensus.agreementPercentage}% agreement · ${report.decision.overallConfidence}% confidence · ${report.consensus.riskLevel} risk`].join("\n");
}

export function ExportToolbar({ report }: { report: RoundtableReport }) {
  const [activeAction, setActiveAction] = useState<Action>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (action: Exclude<Action, null>, operation: () => void | Promise<void>, success: string) => {
    setActiveAction(action);
    try {
      await operation();
      setNotice(success);
    } catch {
      setNotice("That export could not be completed. Please try again.");
    } finally {
      setActiveAction(null);
      window.setTimeout(() => setNotice(null), 2_800);
    }
  };
  const copyFull = () => run("full", () => copyReport(generatePlainText(report)), "Full report copied.");
  const copySummary = () => run("summary", () => copyReport(summaryText(report)), "Decision summary copied.");
  const copyMarkdown = () => run("markdown", () => copyReport(generateMarkdown(report)), "Markdown copied.");
  const copyRich = () => run("rich", () => copyReport(generatePlainText(report), generateRichText(report)), "Rich-text report copied.");

  return <><section className="relative overflow-hidden rounded-3xl border border-white/[0.10] bg-[#0d111c]/80 p-5 shadow-[0_18px_54px_rgba(0,0,0,0.2)] sm:p-6"><div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet-400/10 blur-3xl" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-200">Roundtable Brief</p><h2 className="mt-1 text-xl font-medium tracking-[-0.035em] text-white">Take the decision with you.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Export the complete panel record as a presentation-ready brief, or copy exactly what you need.</p></div><span className="flex w-fit items-center gap-1.5 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-3 py-1.5 text-xs text-violet-100"><Sparkles className="h-3.5 w-3.5" /> Ready to export</span></div><div className="relative mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><Button type="button" variant="secondary" disabled={activeAction !== null} onClick={() => void run("pdf", () => PDFExporter(report), "PDF downloaded.")}>{activeAction === "pdf" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} Download PDF</Button><Button type="button" variant="secondary" disabled={activeAction !== null} onClick={() => void run("markdown", () => exportMarkdown(report), "Markdown exported.")}>{activeAction === "markdown" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} Export Markdown</Button><Button type="button" variant="secondary" disabled={activeAction !== null} onClick={() => void copyFull()}>{activeAction === "full" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ClipboardCopy className="h-4 w-4" />} Copy Report</Button><Button type="button" variant="secondary" onClick={() => setPreviewOpen(true)}><Eye className="h-4 w-4" /> Preview Report</Button></div><div className="relative mt-5 flex flex-wrap gap-1 border-t border-white/[0.08] pt-4"><CopyButton label="Copy Summary" disabled={activeAction !== null} onCopy={copySummary} /><CopyButton label="Copy Markdown" disabled={activeAction !== null} onCopy={copyMarkdown} /><CopyButton label="Copy Rich Text" disabled={activeAction !== null} onCopy={copyRich} /></div></section><ReportPreview report={report} open={previewOpen} onOpenChange={setPreviewOpen} /><AnimatePresence>{notice ? <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} role="status" aria-live="polite" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl border border-emerald-300/20 bg-[#111827] px-4 py-3 text-sm text-emerald-100 shadow-xl">{notice}</motion.div> : null}</AnimatePresence></>;
}
