"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PlaybackControls({ isPlaying, isLoading, speed, onToggle, onPrevious, onNext, onReplay, onSpeed }: { isPlaying: boolean; isLoading: boolean; speed: number; onToggle: () => void; onPrevious: () => void; onNext: () => void; onReplay: () => void; onSpeed: (speed: number) => void }) {
  return <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Button type="button" variant="ghost" size="icon" aria-label="Previous expert" onClick={onPrevious}><SkipBack className="h-4 w-4" /></Button><Button type="button" size="icon" aria-label={isPlaying ? "Pause Roundtable Live" : "Play Roundtable Live"} disabled={isLoading} onClick={onToggle}>{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button><Button type="button" variant="ghost" size="icon" aria-label="Next expert" onClick={onNext}><SkipForward className="h-4 w-4" /></Button><Button type="button" variant="ghost" size="sm" onClick={onReplay}><RotateCcw className="h-3.5 w-3.5" /> Replay</Button></div><label className="flex items-center gap-2 text-xs text-slate-400">Speed<select aria-label="Playback speed" value={speed} onChange={(event) => onSpeed(Number(event.target.value))} className="rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1.5 text-xs text-white outline-none"><option value={0.75}>0.75x</option><option value={1}>1x</option><option value={1.25}>1.25x</option><option value={1.5}>1.5x</option><option value={2}>2x</option></select></label></div>;
}
