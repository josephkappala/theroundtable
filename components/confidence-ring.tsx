"use client";

import { motion, useReducedMotion } from "framer-motion";

const radius = 34;
const circumference = 2 * Math.PI * radius;

export function ConfidenceRing({ value, label = "Confidence" }: { value: number; label?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const boundedValue = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - boundedValue / 100);

  return (
    <div className="relative grid h-24 w-24 place-items-center" role="img" aria-label={`${label}: ${boundedValue}%`}>
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="5" />
        <motion.circle cx="40" cy="40" r={radius} fill="none" stroke="url(#confidence-gradient)" strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }} />
        <defs><linearGradient id="confidence-gradient" x1="0%" x2="100%"><stop stopColor="#a78bfa" /><stop offset="1" stopColor="#67e8f9" /></linearGradient></defs>
      </svg>
      <span className="text-lg font-medium tracking-[-0.04em] text-white">{boundedValue}%</span>
    </div>
  );
}
