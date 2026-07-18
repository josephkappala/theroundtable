import { formatDecision, type FormattedDecision } from "@/lib/decision";
import type { LiveContext } from "@/lib/live-intelligence";
import type { AnalystResult, ConsensusMetrics, DebateTranscript, ModeratorSummary, PanelDiscussion } from "@/types/roundtable";

export type RoundtableReport = {
  title: "The Roundtable — Roundtable Brief";
  generatedAt: string;
  question: string;
  liveContext: LiveContext | null;
  openingStatements: AnalystResult[];
  discussion: DebateTranscript;
  moderator: ModeratorSummary;
  consensus: ConsensusMetrics;
  decision: FormattedDecision;
};

/** Creates one display-neutral report model used by every export format. */
export function buildReport(discussion: PanelDiscussion, generatedAt = new Date().toISOString()): RoundtableReport | null {
  if (!discussion.debate || !discussion.moderator || !discussion.consensus) return null;
  return {
    title: "The Roundtable — Roundtable Brief",
    generatedAt,
    question: discussion.question,
    liveContext: discussion.liveContext ?? null,
    openingStatements: discussion.responses,
    discussion: discussion.debate,
    moderator: discussion.moderator,
    consensus: discussion.consensus,
    decision: formatDecision(discussion.moderator, discussion.consensus),
  };
}

function list(items: string[]) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- None recorded.";
}

/** Generates portable Markdown for GitHub, Notion, Obsidian, and plaintext-friendly editors. */
export function generateMarkdown(report: RoundtableReport) {
  const openingStatements = report.openingStatements.map(({ analyst, response }) => [
    `### ${response.expert}`,
    `_${analyst.role} · ${response.stance} · ${response.confidence}% confidence_`,
    "",
    response.summary,
    "",
    "**Reasoning**",
    response.reasoning,
    "",
    "**Recommendation**",
    response.recommendation,
    "",
    "**Key points**",
    list(response.keyPoints),
  ].join("\n")).join("\n\n");
  const liveContext = report.liveContext ? [
    "## Live Intelligence Context",
    report.liveContext.summary,
    "",
    ...report.liveContext.sources.map((source) => `- [${source.title}](${source.source}) — ${source.summary}`),
    "",
  ].join("\n") : "";
  const transcript = report.discussion.messages.map((message) => `**${message.speaker}:** ${message.message}`).join("\n\n");

  return [
    `# ${report.title}`,
    "",
    `Generated ${new Date(report.generatedAt).toLocaleString()}`,
    "",
    "## Question",
    report.question,
    "",
    liveContext,
    "## Opening Statements",
    openingStatements,
    "",
    "## Roundtable Discussion",
    transcript,
    "",
    "## Moderator Summary",
    report.moderator.summary,
    "",
    "### Areas of Agreement",
    list(report.moderator.agreements),
    "",
    "### Areas of Disagreement",
    list(report.moderator.disagreements),
    "",
    "### Recommended Action",
    report.moderator.recommendation,
    "",
    "## Consensus",
    `- Overall consensus: ${report.consensus.overallConsensus}`,
    `- Agreement level: ${report.consensus.agreementLevel} (${report.consensus.agreementPercentage}%)`,
    `- Average confidence: ${report.consensus.confidenceScore}%`,
    `- Risk: ${report.consensus.riskLevel}`,
    "",
    "### Expert Votes",
    ...report.consensus.votes.map((vote) => `- ${vote.expertName}: ${vote.stance}`),
    "",
    "## The Decision",
    `### Recommended Action\n${report.decision.recommendedAction}`,
    "",
    `### Summary\n${report.decision.summary}`,
    "",
    `- Top opportunity: ${report.decision.topOpportunity}`,
    `- Biggest risk: ${report.decision.biggestRisk}`,
    `- Most convincing expert: ${report.decision.mostConvincingExpert}`,
    `- Most contrarian opinion: ${report.decision.mostContrarianOpinion}`,
    `- Overall confidence: ${report.decision.overallConfidence}%`,
    "",
    "---",
    "The Roundtable · One question. Multiple AI experts. Better decisions.",
  ].filter(Boolean).join("\n");
}

export function generatePlainText(report: RoundtableReport) {
  return generateMarkdown(report)
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
}

/** Backward-compatible helper for integrations that previously copied the brief directly. */
export function createRoundtableBrief(discussion: PanelDiscussion) {
  const report = buildReport(discussion);
  return report ? generatePlainText(report) : "";
}
