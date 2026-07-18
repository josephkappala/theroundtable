"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function AnalyticsCard({ label, value, icon: Icon, suffix = "" }: { label: string; value: number | string; icon: LucideIcon; suffix?: string }) {
  const numeric = typeof value === "number";
  const [display, setDisplay] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!numeric) return;
    if (reducedMotion) { setDisplay(value); return; }
    const start = performance.now();
    let frame = 0;
    const tick = (time: number) => { const progress = Math.min((time - start) / 800, 1); setDisplay(Math.round(value * (1 - (1 - progress) ** 3))); if (progress < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numeric, reducedMotion, value]);
  return <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"><div className="flex items-center gap-2 text-xs text-slate-500"><Icon className="h-3.5 w-3.5 text-violet-200" /> {label}</div><p className="mt-3 truncate text-lg font-medium tracking-[-0.03em] text-white">{numeric ? `${display}${suffix}` : value}</p></div>;
}
