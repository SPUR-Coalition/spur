# CLAUDE.md

SPUR coalition demo - a live chat interface showing AI content attribution with real publisher content (Guardian, Telegraph). Fetches articles, generates AI responses via Mistral, and tracks attribution events through the OpenAttribution telemetry SDK.

**This repo belongs to the SPUR coalition, not OpenAttribution or NarrativAI.** Alex contributes as tech lead through the OA hat.

## Stack

SvelteKit 2, Svelte 5, TypeScript, `@openattribution/telemetry` SDK, Cloudflare Pages adapter, Marked (markdown rendering).

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
- `TELEGRAPH_API_KEY` - Telegraph RSS Feed API
- `MISTRAL_API_KEY` - Mistral AI
- `OA_SERVER_URL` - OpenAttribution telemetry endpoint
- `OA_PLATFORM_KEY` - platform-level OA key
- `OA_PUBLISHER_KEY_GUARDIAN`, `OA_PUBLISHER_KEY_TELEGRAPH` - per-publisher OA keys
- `DEMO_PASSWORD` - optional, leave blank to disable auth locally

## Repo structure

- `demo/` - SvelteKit app (all application code lives here)

Coalition docs (specs, reference, advocacy, data) are in the private [SPUR-Coalition/org](https://github.com/SPUR-Coalition/org) repo.

## Deployment

Cloudflare Pages.

## Conventions

British English.
