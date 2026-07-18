# The Roundtable

The Roundtable is an AI-powered decision platform where multiple AI experts independently analyze your question, discuss it from different perspectives, and deliver a balanced recommendation.

## Features

- Select 3–7 specialist AI experts for every question.
- Generate independently validated opening statements with the OpenAI Responses API.
- Watch a staged Roundtable discussion, then receive a moderator decision and consensus dashboard.
- Copy a branded **Roundtable Brief** with the question, decision, consensus, and opening statements.
- Responsive dark-mode interface with Framer Motion, reduced-motion support, and accessible live updates.

## Tech Stack

- Next.js 15 App Router, React 19, and TypeScript
- Tailwind CSS, shadcn/ui primitives, Framer Motion, and Lucide icons
- OpenAI Responses API with Structured Outputs
- Zod and React Hook Form

## Architecture

- `app/` contains pages, metadata, manifest, and API routes.
- `components/` contains reusable product and discussion UI.
- `hooks/use-discussion-engine.ts` orchestrates the staged client experience.
- `lib/discussion.ts` handles validated expert, discussion, and moderator generations.
- `prompts/` contains reusable expert and moderator contracts.
- `types/roundtable.ts` defines the shared product data model.

The primary API flow is staged through `/api/discuss`. `/api/roundtable` supports the original one-request synthesis flow; `/api/parallel` remains as a backward-compatible alias for existing integrations.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and add your key:

   ```bash
   cp .env.example .env.local
   ```

3. Set `OPENAI_API_KEY` in `.env.local`. Optionally set `ROUNDTABLE_MODEL` to a compatible Responses API model. `PARALLEL_MODEL` is still recognized temporarily for existing deployments.

4. Start the app:

   ```bash
   npm run dev
   ```

5. Validate production readiness:

   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

## Roadmap

- Saved and shareable Roundtable Briefs
- More expert profiles and custom expert instructions
- Source-aware evidence and citations
- Team workspaces and decision history
