import { downloadText } from "@/lib/report-export";
import { generateMarkdown, type RoundtableReport } from "@/lib/roundtable-brief";

export function exportMarkdown(report: RoundtableReport) {
  const filename = `roundtable-brief-${new Date(report.generatedAt).toISOString().slice(0, 10)}.md`;
  downloadText(filename, generateMarkdown(report), "text/markdown");
}

/** Imperative export adapter retained as a reusable UI-facing exporter. */
export function MarkdownExporter({ report }: { report: RoundtableReport }) {
  exportMarkdown(report);
  return null;
}
