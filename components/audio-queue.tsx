"use client";

import { ListMusic } from "lucide-react";

import type { PlaybackSection } from "@/types/live";

const sections: Array<{ id: PlaybackSection; label: string }> = [{ id: "opening-statements", label: "Opening Statements" }, { id: "discussion", label: "Discussion" }, { id: "moderator", label: "Moderator" }, { id: "decision", label: "The Decision" }];

export function AudioQueue({ activeSection, onSelect }: { activeSection: PlaybackSection; onSelect: (section: PlaybackSection) => void }) {
  return <div><div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-slate-500"><ListMusic className="h-3.5 w-3.5" /> Queue</div><div className="grid gap-2 sm:grid-cols-2">{sections.map((section, index) => <button type="button" key={section.id} onClick={() => onSelect(section.id)} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${activeSection === section.id ? "border-violet-300/30 bg-violet-400/[0.10] text-white" : "border-white/[0.07] bg-white/[0.025] text-slate-400 hover:bg-white/[0.06]"}`}><span className="text-xs text-violet-200">0{index + 1}</span>{section.label}</button>)}</div></div>;
}
