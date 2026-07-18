import type { RoundtableReport } from "@/lib/roundtable-brief";

const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 54;
const contentWidth = pageWidth - margin * 2;

function filenameDate(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

/** Generates a branded, paginated PDF directly in the user's browser. */
export async function generatePDF(report: RoundtableReport) {
  const { jsPDF } = await import("jspdf");
  const document = new jsPDF({ unit: "pt", format: "a4", compress: true });
  let cursorY = margin;

  const newPage = () => {
    document.addPage();
    cursorY = margin;
  };
  const ensureSpace = (height: number) => {
    if (cursorY + height > pageHeight - 66) newPage();
  };
  const section = (title: string) => {
    ensureSpace(42);
    document.setDrawColor(205, 195, 255);
    document.setLineWidth(0.8);
    document.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 18;
    document.setFont("helvetica", "bold");
    document.setFontSize(11);
    document.setTextColor(91, 70, 188);
    document.text(title.toUpperCase(), margin, cursorY);
    cursorY += 19;
  };
  const paragraph = (text: string, { muted = false, bold = false }: { muted?: boolean; bold?: boolean } = {}) => {
    document.setFont("helvetica", bold ? "bold" : "normal");
    document.setFontSize(10);
    document.setTextColor(muted ? 95 : 30, muted ? 103 : 41, muted ? 120 : 59);
    const lines = document.splitTextToSize(text, contentWidth) as string[];
    for (const line of lines) {
      ensureSpace(15);
      document.text(line, margin, cursorY);
      cursorY += 15;
    }
    cursorY += 7;
  };
  const bulletList = (items: string[]) => items.forEach((item) => paragraph(`• ${item}`));

  document.setFillColor(13, 17, 28);
  document.rect(0, 0, pageWidth, pageHeight, "F");
  document.setFillColor(124, 92, 255);
  document.circle(pageWidth - 62, 74, 100, "F");
  document.setFillColor(34, 211, 238);
  document.setGState(document.GState({ opacity: 0.18 }));
  document.circle(90, pageHeight - 90, 150, "F");
  document.setGState(document.GState({ opacity: 1 }));
  document.setTextColor(201, 190, 255);
  document.setFont("helvetica", "bold");
  document.setFontSize(12);
  document.text("THE ROUNDTABLE", margin, 88);
  document.setTextColor(255, 255, 255);
  document.setFontSize(32);
  document.text("Roundtable", margin, 174);
  document.text("Brief", margin, 212);
  document.setFont("helvetica", "normal");
  document.setFontSize(13);
  document.setTextColor(203, 213, 225);
  const coverQuestion = document.splitTextToSize(report.question, contentWidth - 30) as string[];
  document.text(coverQuestion, margin, 286);
  document.setTextColor(148, 163, 184);
  document.setFontSize(10);
  document.text(`Generated ${new Date(report.generatedAt).toLocaleString()}`, margin, pageHeight - 70);
  document.text("One question. Multiple AI experts. Better decisions.", margin, pageHeight - 48);

  newPage();
  section("Question");
  paragraph(report.question, { bold: true });

  if (report.liveContext) {
    section("Live Intelligence Context");
    paragraph(report.liveContext.summary);
    report.liveContext.sources.forEach((source) => {
      paragraph(source.title, { bold: true });
      paragraph(source.summary, { muted: true });
      paragraph(source.source, { muted: true });
    });
  }

  section("Opening Statements");
  report.openingStatements.forEach(({ analyst, response }) => {
    paragraph(`${response.expert} - ${analyst.role} | ${response.stance} | ${response.confidence}% confidence`, { bold: true });
    paragraph(response.summary);
    paragraph(`Recommendation: ${response.recommendation}`, { muted: true });
    bulletList(response.keyPoints);
  });

  section("Roundtable Discussion");
  report.discussion.messages.forEach((message) => paragraph(`${message.speaker}: ${message.message}`));

  section("Moderator Summary");
  paragraph(report.moderator.summary);
  paragraph("Areas of agreement", { bold: true });
  bulletList(report.moderator.agreements);
  paragraph("Areas of disagreement", { bold: true });
  bulletList(report.moderator.disagreements.length ? report.moderator.disagreements : ["No material disagreement recorded."]);
  paragraph(`Recommended action: ${report.moderator.recommendation}`, { bold: true });

  section("Consensus Dashboard");
  paragraph(`Overall consensus: ${report.consensus.overallConsensus}`);
  paragraph(`Agreement: ${report.consensus.agreementPercentage}% (${report.consensus.agreementLevel})`);
  paragraph(`Average confidence: ${report.consensus.confidenceScore}%`);
  paragraph(`Risk: ${report.consensus.riskLevel}`);
  paragraph("Expert votes", { bold: true });
  report.consensus.votes.forEach((vote) => paragraph(`${vote.expertName}: ${vote.stance}`));

  section("The Decision");
  paragraph(report.decision.recommendedAction, { bold: true });
  paragraph(report.decision.summary);
  paragraph(`Top opportunity: ${report.decision.topOpportunity}`);
  paragraph(`Biggest risk: ${report.decision.biggestRisk}`);
  paragraph(`Most convincing expert: ${report.decision.mostConvincingExpert}`);
  paragraph(`Most contrarian opinion: ${report.decision.mostContrarianOpinion}`);
  paragraph(`Overall confidence: ${report.decision.overallConfidence}%`);

  const pageCount = document.getNumberOfPages();
  for (let page = 2; page <= pageCount; page += 1) {
    document.setPage(page);
    document.setDrawColor(226, 232, 240);
    document.line(margin, pageHeight - 38, pageWidth - margin, pageHeight - 38);
    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.setTextColor(100, 116, 139);
    document.text("The Roundtable - Roundtable Brief", margin, pageHeight - 22);
    document.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 22, { align: "right" });
  }

  document.save(`roundtable-brief-${filenameDate(report.generatedAt)}.pdf`);
}
