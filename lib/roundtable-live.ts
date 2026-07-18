import { formatDecision } from "@/lib/decision";
import { discussionExperts } from "@/prompts/discussion-experts";
import type { PlaybackItem, PlaybackSection, LiveVoice } from "@/types/live";
import type { PanelDiscussion } from "@/types/roundtable";

type VoiceProfile = { voice: LiveVoice; voiceStyle: string };

const voiceProfiles: Record<string, VoiceProfile> = {
  "Venture Capitalist": { voice: "onyx", voiceStyle: "Professional, confident, fast-paced, and concise. Sound decisive without sounding rushed." },
  "Senior Engineer": { voice: "sage", voiceStyle: "Calm, analytical, measured, and clear. Use thoughtful pauses for complex ideas." },
  "Product Manager": { voice: "nova", voiceStyle: "Friendly, structured, clear, and practical. Keep the delivery crisp and collaborative." },
  Designer: { voice: "shimmer", voiceStyle: "Creative, warm, expressive, and inviting. Keep a clear professional cadence." },
  "Devil's Advocate": { voice: "ash", voiceStyle: "Confident, skeptical, thoughtful, and precise. Challenge ideas without sounding hostile." },
  Operator: { voice: "echo", voiceStyle: "Grounded, direct, practical, and execution-focused. Keep the pace steady." },
  Researcher: { voice: "coral", voiceStyle: "Curious, evidence-led, composed, and exact. Emphasize uncertainty with care." },
  "Roundtable Moderator": { voice: "ballad", voiceStyle: "Neutral, authoritative, executive, and calm. Sound like an impartial chairperson." },
};

const moderator = { speaker: "Roundtable Moderator", role: "Neutral facilitator", avatar: "/avatars/moderator.svg", accent: "#a78bfa" };

function profileFor(speaker: string) {
  const expert = discussionExperts.find((candidate) => candidate.name === speaker);
  const profile = voiceProfiles[speaker] ?? voiceProfiles["Roundtable Moderator"];
  return expert ? { speaker: expert.name, role: expert.role, avatar: expert.avatar, accent: expert.color, ...profile } : { ...moderator, ...profile };
}

function speechText(text: string) {
  return text.length <= 4_000 ? text : `${text.slice(0, 3_950).trimEnd()}…`;
}

function item(id: string, section: PlaybackSection, sectionLabel: string, speaker: string, text: string): PlaybackItem {
  const profile = profileFor(speaker);
  return { id, section, sectionLabel, speaker: profile.speaker, role: profile.role, avatar: profile.avatar, accent: profile.accent, voice: profile.voice, voiceStyle: profile.voiceStyle, text: speechText(text) };
}

/** Assembles the completed Roundtable into a deterministic, sectioned listening queue. */
export function buildPlaybackQueue(discussion: PanelDiscussion): PlaybackItem[] {
  if (!discussion.debate || !discussion.moderator || !discussion.consensus) return [];
  const openingStatements = discussion.responses.map(({ response }, index) => item(`opening-${index}-${response.expert}`, "opening-statements", "Opening Statements", response.expert, `Opening statement. ${response.summary} Key points: ${response.keyPoints.join(". ")} Recommendation: ${response.recommendation}`));
  const exchange = discussion.debate.messages.map((message, index) => item(`discussion-${index}-${message.speaker}`, "discussion", "Roundtable Discussion", message.speaker, message.message));
  const moderatorText = [discussion.moderator.summary, `Areas of agreement: ${discussion.moderator.agreements.join(". ")}`, `Areas of disagreement: ${discussion.moderator.disagreements.length ? discussion.moderator.disagreements.join(". ") : "No material disagreement was recorded."}`, `Recommended action: ${discussion.moderator.recommendation}`].join(" ");
  const decision = formatDecision(discussion.moderator, discussion.consensus);
  const decisionText = [`The Decision. ${decision.recommendedAction}`, decision.summary, `Top opportunity: ${decision.topOpportunity}`, `Biggest risk: ${decision.biggestRisk}`, `Overall confidence: ${decision.overallConfidence} percent.`].join(" ");
  return [...openingStatements, ...exchange, item("moderator-summary", "moderator", "Moderator Summary", moderator.speaker, moderatorText), item("final-decision", "decision", "The Decision", moderator.speaker, decisionText)];
}

export function sectionStartIndex(queue: PlaybackItem[], section: PlaybackSection) {
  return queue.findIndex((item) => item.section === section);
}

/** Resolves a section jump to the first track in that part of the Roundtable. */
export function playSection(queue: PlaybackItem[], section: PlaybackSection) {
  return sectionStartIndex(queue, section);
}

/** Resumes a prepared audio element while leaving browser autoplay policy handling to the caller. */
export function resumePlayback(audio: HTMLAudioElement) {
  return audio.play();
}

export function nextSpeakerIndex(queue: PlaybackItem[], currentIndex: number, direction: 1 | -1) {
  const speaker = queue[currentIndex]?.speaker;
  let index = currentIndex + direction;
  while (index >= 0 && index < queue.length) {
    if (queue[index]?.speaker !== speaker) return index;
    index += direction;
  }
  return currentIndex;
}
