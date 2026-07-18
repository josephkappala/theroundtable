"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/[0.10] bg-white/[0.035] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-rose-300/20 bg-rose-400/[0.08] text-rose-200"><AlertTriangle className="h-5 w-5" /></span>
        <h1 className="mt-5 text-xl font-medium tracking-[-0.035em]">The Roundtable hit a snag.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Your work is safe. Try loading the experience again, or return home and start a fresh Roundtable.</p>
        <div className="mt-6 flex justify-center gap-2"><Button type="button" onClick={reset}><RefreshCw className="h-4 w-4" /> Try again</Button><Button variant="secondary" asChild><Link href="/">Go home</Link></Button></div>
      </section>
    </main>
  );
}
