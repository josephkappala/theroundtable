"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CircleDot,
  Compass,
  GitPullRequest,
  Layers3,
  Menu,
  MessageSquareText,
  Orbit,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { RoundtableLogo } from "@/components/roundtable-logo";
import { Button } from "@/components/ui/button";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const experts = [
  { name: "Strategist", lens: "Growth lens", color: "#a78bfa", icon: Compass, note: "Enter through one focused beachhead, not a broad launch." },
  { name: "Skeptic", lens: "Risk lens", color: "#fb7185", icon: ShieldCheck, note: "Prove channel economics before locking in expansion costs." },
  { name: "Builder", lens: "Execution lens", color: "#38bdf8", icon: Target, note: "A 90-day pilot reveals operational reality quickly." },
];

const benefits = [
  {
    icon: Orbit,
    title: "Independent by default",
    description: "Every expert begins with a clean slate, so the loudest first answer never anchors the room.",
  },
  {
    icon: GitPullRequest,
    title: "Constructive disagreement",
    description: "The Roundtable makes trade-offs visible, turning conflict into useful signal instead of watered-down compromise.",
  },
  {
    icon: Sparkles,
    title: "A clear way forward",
    description: "Get one sharp consensus, the reasoning behind it, and the next action worth taking.",
  },
];

export function RoundtableLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(ellipse_75%_45%_at_50%_-8%,rgba(124,92,255,0.30),transparent_70%)]" />
      <div className="pointer-events-none absolute right-[-8rem] top-[28rem] h-80 w-80 rounded-full bg-cyan-400/[0.08] blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <header className="flex h-20 items-center justify-between" aria-label="Main navigation">
          <a href="#top" className="flex items-center gap-2.5" aria-label="The Roundtable home">
            <RoundtableLogo />
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            <a className="text-sm text-slate-400 transition-colors hover:text-white" href="#how-it-works">How it works</a>
            <a className="text-sm text-slate-400 transition-colors hover:text-white" href="#example">Example</a>
            <a className="text-sm text-slate-400 transition-colors hover:text-white" href="#why-roundtable">Why The Roundtable</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button>
            <Button size="sm" asChild>
              <Link href="/ask">Start a Roundtable <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-300 md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>
        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-5 right-5 top-[72px] z-20 rounded-2xl border border-white/[0.10] bg-[#101421]/95 p-2 shadow-2xl backdrop-blur-xl md:hidden"
              id="mobile-navigation"
              aria-label="Mobile navigation"
            >
              {[
                ["How it works", "#how-it-works"],
                ["Example conversation", "#example"],
                ["Why The Roundtable", "#why-roundtable"],
              ].map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white">{label}</a>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>

        <section id="top" className="relative flex min-h-[680px] flex-col items-center justify-center pb-20 pt-20 text-center sm:min-h-[730px] sm:pt-28">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.65, delay: 0.06 }}
            className="mt-7 text-6xl font-semibold leading-[0.9] tracking-[-0.07em] text-white sm:text-8xl lg:text-[112px]"
          >
            The Roundtable
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mt-7 max-w-4xl text-2xl font-medium leading-[1.08] tracking-[-0.045em] text-slate-200 sm:text-4xl lg:text-5xl"
          >
            Bring the question.<br />
            <span className="bg-gradient-to-r from-[#d7ceff] via-[#b8a5ff] to-[#6bdcff] bg-clip-text text-transparent">We’ll bring the perspectives.</span>
          </motion.p>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg"
          >
            One question. Multiple AI experts. Better decisions.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.6, delay: 0.22 }} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="group min-w-44 bg-white px-6 text-slate-950 hover:bg-violet-50">
              <Link href="/ask">Start a Roundtable <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
            </Button>
            <a href="#example" className="rounded-xl px-4 py-3 text-sm text-slate-400 transition-colors hover:text-white">See Example Discussion</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-14 w-full max-w-5xl"
          >
            <div className="absolute inset-x-[14%] -top-10 h-28 rounded-full bg-violet-500/25 blur-[70px]" />
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.13] bg-[#0c101c]/80 p-3 text-left shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-rose-400/70" /><span className="h-2 w-2 rounded-full bg-amber-300/70" /><span className="h-2 w-2 rounded-full bg-emerald-400/70" /></div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-violet-200"><CircleDot className="h-3.5 w-3.5" /> 4 experts seated</div>
              </div>
              <div className="grid gap-3 pt-3 sm:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 sm:p-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Your question</p>
                  <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">Should we expand into Europe this year, or deepen our position in North America first?</p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-slate-500"><MessageSquareText className="h-3.5 w-3.5 text-violet-300" /> Brought to The Roundtable</div>
                </div>
                <div className="rounded-xl border border-violet-300/[0.16] bg-[linear-gradient(125deg,rgba(124,92,255,0.16),rgba(24,29,47,0.45))] p-4 sm:p-5">
                  <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-400/15"><Layers3 className="h-3.5 w-3.5 text-violet-200" /></span><p className="text-xs font-medium text-violet-100">Roundtable consensus</p></div>
                  <p className="mt-3 text-sm leading-6 text-slate-200">Test one European market with a 90-day pilot while protecting North American momentum.</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-300"><Check className="h-3.5 w-3.5" /> Aligned after debate</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      <section id="how-it-works" className="relative border-y border-white/[0.08] bg-white/[0.02] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionIntro eyebrow="How it works" title="Better decisions begin with better debate." description="The Roundtable brings focused experts to your question, then turns distinct perspectives into one useful answer." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Ask anything that matters", "Bring the context, ambiguity, and trade-offs. One focused prompt is all it takes."],
              ["02", "Watch the Roundtable deliberate", "Specialized AI experts form independent positions before they see anyone else’s take."],
              ["03", "Move with conviction", "A consensus surfaces the best path, the meaningful dissent, and your next move."],
            ].map(([number, title, description], index) => (
              <motion.article key={title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} transition={{ duration: 0.45, delay: index * 0.08 }} className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d111b] p-6 sm:p-7">
                <span className="text-xs font-medium tracking-[0.18em] text-violet-300/80">{number}</span>
                <h3 className="mt-10 text-xl font-medium tracking-[-0.035em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
                <div className="absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-violet-500/[0.07] blur-3xl transition-opacity group-hover:opacity-100" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="example" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionIntro eyebrow="Example conversation" title="A room full of perspectives. One answer you can use." description="See how a single high-stakes question turns into an informed, actionable decision." />
          <div className="mt-14 grid items-start gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-6 sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">The decision</p>
              <h3 className="mt-4 text-2xl font-medium leading-tight tracking-[-0.04em] text-white">Do we expand into Europe this year?</h3>
              <p className="mt-4 text-sm leading-6 text-slate-400">A growing B2B platform needs to decide whether to pursue a new market or double down on demand already working at home.</p>
              <div className="mt-8 rounded-xl border border-white/[0.08] bg-black/20 p-4">
                <p className="text-xs leading-5 text-slate-400">“We have a repeatable motion in North America, but meaningful inbound from the UK. How should we prioritize the next 12 months?”</p>
              </div>
            </motion.div>
            <div className="space-y-3">
              {experts.map(({ name, lens, color, icon: Icon, note }, index) => (
                <motion.article key={name} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={reveal} transition={{ duration: 0.45, delay: index * 0.08 }} className="flex gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.025] p-4 sm:p-5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04]" style={{ boxShadow: `0 0 24px ${color}24` }}><Icon className="h-4 w-4" style={{ color }} /></div>
                  <div><div className="flex items-baseline gap-2"><h3 className="text-sm font-medium text-white">{name}</h3><span className="text-xs text-slate-500">{lens}</span></div><p className="mt-1.5 text-sm leading-6 text-slate-300">{note}</p></div>
                </motion.article>
              ))}
              <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={reveal} transition={{ duration: 0.45, delay: 0.28 }} className="relative overflow-hidden rounded-2xl border border-violet-300/[0.20] bg-[linear-gradient(120deg,rgba(124,92,255,0.20),rgba(13,17,27,0.88))] p-5">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-400/15 blur-3xl" />
                <div className="relative flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-violet-200"><Sparkles className="h-3.5 w-3.5" /> Consensus</div>
                <p className="relative mt-3 text-sm leading-6 text-slate-100">Launch a constrained UK pilot, with explicit unit-economics gates at days 30, 60, and 90. Keep North America as the primary growth engine until the motion is proven.</p>
              </motion.article>
            </div>
          </div>
        </div>
      </section>

      <section id="why-roundtable" className="border-t border-white/[0.08] bg-[radial-gradient(ellipse_55%_60%_at_50%_100%,rgba(83,111,255,0.14),transparent_76%)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionIntro eyebrow="Why The Roundtable" title="Every decision deserves a Roundtable." description="One assistant gives you an answer. The Roundtable gives you the confidence to act on it." centered />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <motion.article key={title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} transition={{ duration: 0.45, delay: index * 0.08 }} className="rounded-2xl border border-white/[0.09] bg-[#0c101a]/80 p-6 backdrop-blur-sm">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08]"><Icon className="h-5 w-5 text-violet-200" /></div>
                <h3 className="mt-6 text-lg font-medium tracking-[-0.03em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
              </motion.article>
            ))}
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/[0.10] bg-white/[0.04] px-6 py-8 text-center sm:flex-row sm:px-9 sm:text-left">
            <div><h3 className="text-xl font-medium tracking-[-0.035em] text-white">Your next decision deserves more than one perspective.</h3><p className="mt-2 text-sm text-slate-400">Bring your toughest questions to The Roundtable.</p></div>
            <Button size="lg" asChild className="shrink-0"><Link href="/ask">Start a Roundtable <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div className="flex items-center gap-2.5"><RoundtableLogo labelClassName="text-sm" /><span className="text-xs text-slate-600">© 2026</span></div>
          <div className="flex gap-5 text-xs text-slate-500"><a href="#top" className="hover:text-slate-200">Product</a><a href="#how-it-works" className="hover:text-slate-200">How it works</a><a href="#why-roundtable" className="hover:text-slate-200">Principles</a></div>
        </div>
      </footer>
    </main>
  );
}

function SectionIntro({ eyebrow, title, description, centered = false }: { eyebrow: string; title: string; description: string; centered?: boolean }) {
  return <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}><p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">{eyebrow}</p><h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.05em] text-white sm:text-4xl">{title}</h2><p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">{description}</p></div>;
}
