"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import Image from "next/image";

import type { CommunityResult } from "@/types/community";

export function CommunityFavorite({ expert }: { expert: CommunityResult }) {
  return <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-2xl border border-amber-300/20 bg-[linear-gradient(115deg,rgba(251,191,36,0.14),rgba(124,92,255,0.10))] p-4"><motion.span aria-hidden="true" animate={{ y: [0, -5, 0], rotate: [0, 5, -4, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} className="absolute right-5 top-4 text-xl">✦</motion.span><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-amber-100"><Trophy className="h-3.5 w-3.5" /> Community Favorite</div><div className="mt-3 flex items-center gap-3"><Image src={expert.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-xl border border-white/10 bg-black/20" /><div><p className="font-medium text-white">{expert.name}</p><p className="text-xs text-slate-300">{expert.percentage}% of votes</p></div></div></motion.div>;
}
