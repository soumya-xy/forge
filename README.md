# Forge

**Zero-to-One Builder.** Turn a vague early-stage idea into a grounded execution
plan with one AI-driven, eight-stage pipeline.

## What it does

You paste a raw idea. Forge runs it through P1–P8 and gives you:

1. **Idea Intake** — title, core problem, target user, key assumption, ambition level.
2. **Risk Register** — 4–6 pre-mortem failure modes with likelihood / impact.
3. **Strategic Personas** — three distinct founder scenarios with real constraints.
4. **Execution Roadmap** — 30 / 60 / 90-day milestone plan.
5. **Experiment Gate** — three testable bets; you commit to one.
6. **Resource Mapping** — categories that match your chosen experiment.
7. **Resource Retrieval** — a curated panel of grants, tools, and communities.
8. **First Real Step** — a copy-pasteable draft (outreach email, interview script,
   landing page copy, or grant intro).

State persists in `localStorage` under the key `forge-state-v1` so you can reload
without losing progress.

## Prerequisites

- **Node.js 20+** (Next.js 15 requires it).
- A **Google AI API key** — get one at https://aistudio.google.com/apikey.

## Setup

```bash
git clone <repo-url> forge
cd forge
npm install
cp .env.example .env.local
# open .env.local and paste your GOOGLE_API_KEY
npm run dev
```

The app runs at **http://localhost:9002**.

## Scripts

| Script              | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start the Next.js dev server (Turbopack) on :9002  |
| `npm run build`     | Production build                                   |
| `npm run start`     | Serve the production build                         |
| `npm run lint`      | Run ESLint                                         |
| `npm run typecheck` | Run `tsc --noEmit`                                 |

## Environment variables

| Variable          | Required | Default                          | Notes                                  |
| ----------------- | -------- | -------------------------------- | -------------------------------------- |
| `GOOGLE_API_KEY`  | Yes      | —                                | Your Google AI / Gemini API key        |
| `GEMINI_MODEL`    | No       | `googleai/gemini-2.5-flash`      | Override the model used by the pipeline|

`.env.local` is gitignored. `.env.example` is the committed template.

## Pipeline layout

```
src/pipeline/
  p1Intake.ts              P1  Idea → IdeaJSON
  p2Risks.ts               P2  IdeaJSON → RiskRegister (4–6 items)
  p3Scenarios.ts           P3  IdeaJSON + Risks → 3 FounderScenarios
  p4Synthesis.ts           P4  + Scenarios → 30/60/90 MilestonePlan
  p5Gate.ts                P5  MilestonePlan → 3 CandidateExperiments
  p6ResourceMapping.ts     P6  ChosenExperiment → up to 3 ResourceCategories
  p7ResourceRetrieval.ts   P7  Categories → filtered list from resources.json
  p8MicroActionDraft.ts    P8  Idea + ChosenExperiment → copy-pasteable draft
```

Prompts live in `src/prompts/prompts.ts`. The single AI client is
`src/lib/geminiClient.ts` (Genkit + Gemini). All stages are wired and orchestrated
by `src/components/ForgeApp.tsx`.

## Project layout

```
forge/
  src/
    app/                   Next.js App Router entry
    ai/genkit.ts           Genkit + Google AI plugin setup
    components/
      ForgeApp.tsx         Stage orchestrator (state, loading, retry, persistence)
      stages/              One component per pipeline stage
      ui/                  shadcn/ui primitives + Stepper
    hooks/                 useToast, useMobile
    lib/
      geminiClient.ts      Single entrypoint for all AI calls
      utils.ts             cn() helper
    pipeline/              P1–P8 server actions
    prompts/prompts.ts     All LLM prompt builders
    types/                 Domain types + enums
  public/
    data/resources.json    40 curated grants / tools / communities
  docs/blueprint.md        Original product spec
```

## Deploying to Firebase App Hosting

The repo includes `apphosting.yaml`. After connecting the repo in Firebase
App Hosting, set the `GOOGLE_API_KEY` environment variable in the Firebase
console (App Hosting → your backend → Environment variables) — it is not read
from a committed file.

## Notes / known follow-ups

- `next.config.ts` currently sets `ignoreBuildErrors: true` and
  `ignoreDuringBuilds: true`. Type errors are masked; tighten this in a follow-up.
- The brand colors in `globals.css` (terracotta primary, amber risk) deviate
  from `docs/blueprint.md` (sage primary, terracotta risk). Reconcile when
  revisiting the visual system.
- Components hard-code hex colors instead of using the HSL tokens declared in
  `globals.css`. Migrating to tokens would make theming trivial.
