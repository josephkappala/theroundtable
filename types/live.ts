export type PlaybackSection = "opening-statements" | "discussion" | "moderator" | "decision";

export type LiveVoice = "alloy" | "ash" | "ballad" | "coral" | "echo" | "fable" | "onyx" | "nova" | "sage" | "shimmer" | "verse";

export type PlaybackItem = {
  id: string;
  section: PlaybackSection;
  sectionLabel: string;
  speaker: string;
  role: string;
  avatar: string;
  accent: string;
  voice: LiveVoice;
  voiceStyle: string;
  text: string;
};
