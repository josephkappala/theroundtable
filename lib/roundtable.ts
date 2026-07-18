import { analysts } from "@/prompts/analysts";
import type { AnalystId, AnalystResult } from "@/types/roundtable";

export const analystIds = Object.keys(analysts) as AnalystId[];

export function buildSynthesisInput(question: string, results: AnalystResult[]) {
  const expertNotes = results
    .map((result) => `### ${result.analyst.name} (${result.analyst.role})\n${JSON.stringify(result.response)}`)
    .join("\n\n");

  return `User question:\n${question}\n\nIndependent analyses:\n${expertNotes}`;
}
