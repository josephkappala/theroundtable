"use client";

import { motion } from "framer-motion";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "--:--";
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function PlaybackProgress({ currentTime, duration, onSeek }: { currentTime: number; duration: number; onSeek: (time: number) => void }) {
  const value = duration ? Math.min(100, (currentTime / duration) * 100) : 0;
  return <div><div className="mb-2 flex justify-between text-xs text-slate-500"><span>{formatTime(currentTime)}</span><span>−{formatTime(duration - currentTime)}</span></div><input aria-label="Audio playback progress" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event) => onSeek(Number(event.target.value))} className="relative z-10 h-2 w-full cursor-pointer accent-violet-400" /><div className="-mt-[7px] h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true"><motion.div animate={{ width: `${value}%` }} transition={{ duration: 0.1 }} className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" /></div></div>;
}
