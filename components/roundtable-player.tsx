"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, Headphones, LoaderCircle, Radio } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AudioQueue } from "@/components/audio-queue";
import { PlaybackControls } from "@/components/playback-controls";
import { PlaybackProgress } from "@/components/playback-progress";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { Waveform } from "@/components/waveform";
import { buildPlaybackQueue, nextSpeakerIndex, playSection, resumePlayback } from "@/lib/roundtable-live";
import { generateSpeech } from "@/lib/speech-client";
import type { PlaybackSection } from "@/types/live";
import type { PanelDiscussion } from "@/types/roundtable";

export function RoundtablePlayer({ discussion }: { discussion: PanelDiscussion }) {
  const queue = useMemo(() => buildPlaybackQueue(discussion), [discussion]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequestedAudio, setHasRequestedAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [generationVersion, setGenerationVersion] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeItem = queue[activeIndex];
  const speakers = useMemo(() => Array.from(new Map(queue.map((item) => [item.speaker, item])).values()), [queue]);

  useEffect(() => {
    if (!activeItem || !hasRequestedAudio) return;
    let cancelled = false;
    let url: string | null = null;
    setAudioUrl(null);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setError(null);
    void generateSpeech(activeItem).then((audio) => {
      if (cancelled) return;
      url = URL.createObjectURL(audio);
      setAudioUrl(url);
    }).catch((generationError: unknown) => {
      if (!cancelled) {
        setIsPlaying(false);
        setError(generationError instanceof Error ? generationError.message : "Unable to generate this audio segment.");
      }
    }).finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, [activeItem, generationVersion, hasRequestedAudio]);

  useEffect(() => {
    const nextItem = queue[activeIndex + 1];
    if (isPlaying && nextItem) void generateSpeech(nextItem).catch(() => undefined);
  }, [activeIndex, isPlaying, queue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.playbackRate = speed;
    if (isPlaying) void resumePlayback(audio).catch(() => setIsPlaying(false));
    else audio.pause();
  }, [audioUrl, isPlaying, speed]);

  const jumpTo = (index: number, play = isPlaying) => {
    if (index < 0 || index >= queue.length) return;
    setHasRequestedAudio(true);
    setActiveIndex(index);
    setIsPlaying(play);
  };
  const jumpToSection = (section: PlaybackSection) => {
    const index = playSection(queue, section);
    if (index >= 0) jumpTo(index, true);
  };
  const replay = () => {
    setHasRequestedAudio(true);
    if (audioRef.current) audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(true);
  };
  const seek = (time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  const advance = () => {
    if (activeIndex < queue.length - 1) jumpTo(activeIndex + 1, true);
    else { setIsPlaying(false); setCurrentTime(0); }
  };

  if (!activeItem) return null;
  return <section className="relative overflow-hidden rounded-3xl border border-violet-300/[0.18] bg-[radial-gradient(circle_at_90%_0%,rgba(34,211,238,0.13),transparent_28%),linear-gradient(135deg,rgba(124,92,255,0.13),rgba(13,17,28,0.92)_50%)] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.25)] sm:p-6"><div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-violet-500/[0.10] blur-3xl" /><audio ref={audioRef} src={audioUrl ?? undefined} preload="metadata" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onEnded={advance} onError={() => setError("This audio segment could not be played.")} /><div className="relative flex flex-col gap-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-violet-200"><Radio className="h-3.5 w-3.5" /> 🎙 Roundtable Live</div><h2 className="mt-2 text-xl font-medium tracking-[-0.035em] text-white">Listen to the panel&apos;s complete deliberation.</h2><p className="mt-2 text-sm text-slate-400">AI-generated voices · Opening statements, discussion, moderator, and decision.</p></div><span className="flex w-fit items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-400/[0.08] px-3 py-1.5 text-xs text-cyan-100"><Headphones className="h-3.5 w-3.5" /> {isLoading ? "Preparing audio" : hasRequestedAudio ? `${activeIndex + 1} of ${queue.length}` : "Ready to play"}</span></div><Waveform speakers={speakers} activeSpeaker={activeItem.speaker} isPlaying={isPlaying} /><div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"><div className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: activeItem.accent, boxShadow: `0 0 14px ${activeItem.accent}` }} /><div><p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Now speaking · {activeItem.sectionLabel}</p><p className="mt-1 text-base font-medium text-white">{activeItem.speaker}</p><p className="mt-0.5 text-xs text-slate-400">{activeItem.role}</p></div></div><div className="mt-4"><PlaybackProgress currentTime={currentTime} duration={duration} onSeek={seek} /></div><div className="mt-4"><PlaybackControls isPlaying={isPlaying} isLoading={isLoading} speed={speed} onToggle={() => { setHasRequestedAudio(true); if (error) { setError(null); setGenerationVersion((version) => version + 1); setIsPlaying(true); return; } setIsPlaying((playing) => !playing); }} onPrevious={() => jumpTo(nextSpeakerIndex(queue, activeIndex, -1), isPlaying)} onNext={() => jumpTo(nextSpeakerIndex(queue, activeIndex, 1), isPlaying)} onReplay={replay} onSpeed={setSpeed} /></div></div><AnimatePresence>{error ? <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="flex items-start gap-2 rounded-xl border border-rose-300/20 bg-rose-400/[0.08] px-3.5 py-3 text-sm text-rose-200"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />{error}</motion.div> : null}</AnimatePresence><AudioQueue activeSection={activeItem.section} onSelect={jumpToSection} /><div><p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Live transcript</p><TranscriptViewer queue={queue} activeIndex={activeIndex} /></div></div></section>;
}
