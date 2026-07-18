export type AnalystId = string;

export type Analyst = {
  id: AnalystId;
  name: string;
  role: string;
  description: string;
  accent: string;
  avatar: string;
};

export type ExpertResponse = {
  expert: string;
  summary: string;
  reasoning: string;
  confidence: number;
  recommendation: string;
  stance: "Agree" | "Disagree" | "Neutral" | "Mixed";
  keyPoints: string[];
};

export type AnalystStatus = "idle" | "thinking" | "complete" | "error";

export type AnalystResult = {
  analyst: Analyst;
  content: string;
  response: ExpertResponse;
  status: Exclude<AnalystStatus, "idle" | "thinking">;
};

export type ExpertFailure = {
  expertId: string;
  expertName: string;
  message: string;
};

export type RoundtableRun = {
  id: string;
  prompt: string;
  results: AnalystResult[];
  synthesis: string;
  completedAt: string;
};

export type RoundtableApiResponse = Omit<RoundtableRun, "completedAt">;

export type DiscussApiResponse = {
  id: string;
  question: string;
  responses: AnalystResult[];
  failures: ExpertFailure[];
};

export type DebateMessage = {
  speaker: string;
  message: string;
};

export type DebateTranscript = {
  messages: DebateMessage[];
};

export type ModeratorSummary = {
  summary: string;
  consensus: string;
  agreements: string[];
  disagreements: string[];
  recommendation: string;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  topOpportunity: string;
  biggestRisk: string;
  mostConvincingExpert: string;
  mostContrarianOpinion: string;
};

export type ConsensusMetrics = {
  overallConsensus: "Strong agreement" | "Leaning agreement" | "Mixed panel";
  agreementLevel: "High agreement" | "Moderate agreement" | "Mixed views";
  agreementPercentage: number;
  confidenceScore: number;
  riskLevel: ModeratorSummary["risk"];
  riskScore: number;
  expertAlignment: "Aligned" | "Mostly aligned" | "Divergent";
  votes: Array<{
    expertId: string;
    expertName: string;
    stance: ExpertResponse["stance"];
  }>;
};

export type PanelDiscussion = {
  id: string;
  question: string;
  responses: AnalystResult[];
  failures: ExpertFailure[];
  liveContext?: LiveContext | null;
  debate?: DebateTranscript;
  moderator?: ModeratorSummary;
  consensus?: ConsensusMetrics;
};
import type { LiveContext } from "@/lib/live-intelligence";
