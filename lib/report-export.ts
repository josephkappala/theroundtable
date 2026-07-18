import type { RoundtableReport } from "@/lib/roundtable-brief";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export function generateRichText(report: RoundtableReport) {
  const lines = [
    `<h1>${escapeHtml(report.title)}</h1>`,
    `<p><em>Generated ${escapeHtml(new Date(report.generatedAt).toLocaleString())}</em></p>`,
    `<h2>Question</h2><p>${escapeHtml(report.question)}</p>`,
    `<h2>The Decision</h2><h3>Recommended Action</h3><p>${escapeHtml(report.decision.recommendedAction)}</p><p>${escapeHtml(report.decision.summary)}</p>`,
    `<h2>Consensus</h2><p>${escapeHtml(report.consensus.overallConsensus)} · ${report.consensus.agreementPercentage}% agreement · ${report.consensus.confidenceScore}% confidence · ${escapeHtml(report.consensus.riskLevel)} risk</p>`,
    `<h2>Moderator Summary</h2><p>${escapeHtml(report.moderator.summary)}</p>`,
  ];
  return `<!doctype html><html><body>${lines.join("")}</body></html>`;
}

export async function copyReport(text: string, richText?: string) {
  if (!navigator.clipboard) throw new Error("Clipboard access is unavailable in this browser.");
  if (richText && "ClipboardItem" in window) {
    await navigator.clipboard.write([new ClipboardItem({ "text/plain": new Blob([text], { type: "text/plain" }), "text/html": new Blob([richText], { type: "text/html" }) })]);
    return;
  }
  await navigator.clipboard.writeText(text);
}

export function downloadText(filename: string, content: string, type: "text/markdown" | "text/plain") {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
