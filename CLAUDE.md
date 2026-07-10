# CLAUDE.md

SPUR coalition demo - a live chat interface showing AI content attribution with real publisher content (Guardian, Telegraph). Fetches articles, generates AI responses via Mistral, and tracks attribution events through the OpenAttribution telemetry SDK.

**This repo belongs to the SPUR coalition, not OpenAttribution or NarrativAI.** Alex contributes as tech lead through the OA hat.

## Stack

SvelteKit 2, Svelte 5, TypeScript, `@openattribution/telemetry` SDK, Vercel adapter, Marked (markdown rendering).

## Commands

```
cd demo && npm install
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview production build
```

## Env vars

Copy `demo/.env.example` and fill in:

- `GUARDIAN_API_KEY` - Guardian Open Platform API
- `TELEGRAPH_API_KEY`, `TELEGRAPH_API_URL` - Telegraph RSS Feed API
- `MISTRAL_API_KEY` - Mistral AI
- `OA_TELEMETRY_URL` - OA server write endpoint (sessions, events)
- `OA_API_URL` - OA server read endpoint (`/content-owners/*`); may equal `OA_TELEMETRY_URL`
- `OA_PLATFORM_KEY` - the chat agent org's write key (`oat_pk_` prefix)
- `OA_PUBLISHER_KEY_GUARDIAN`, `OA_PUBLISHER_KEY_TELEGRAPH` - per-publisher read keys (`oat_pub_` prefix); each key only sees its publisher's verified domains
- `DEMO_PASSWORD` - optional, leave blank to disable auth locally

The demo has no default OA host — it talks only to the env-configured endpoints. Keys are minted per organisation on the OA server (see `demo/RUNBOOK.md` for the local setup). The auth contract is documented in one place, `demo/src/lib/server/oa.ts`: the SDK write client fails silently so chat keeps streaming if telemetry is down, but the publisher read path never does — a failed read surfaces as a diagnostic (upstream status + reason) in the dashboard pane.

## Repo structure

- `demo/` - SvelteKit app (all application code lives here)

Coalition docs (specs, reference, advocacy, data) are in the private [SPUR-Coalition/org](https://github.com/SPUR-Coalition/org) repo.

## Deployment

Vercel.

## Conventions

British English.
