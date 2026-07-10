# SPUR - Standards for Publisher Usage Rights

Technical infrastructure for the [SPUR coalition](https://spurcoalition.org). SPUR is a publisher coalition founded by BBC, FT, Guardian, Sky News, and Telegraph to build shared technical standards so AI developers can access journalism legitimately while publishers retain control and receive fair value.

This repo contains demo applications, compliance data, specs, and documentation for the coalition. Technical delivery is provided by [OpenAttribution](https://openattribution.org).

## What's here

- **`demo/`** - Three-pane live demo (SvelteKit, deployed on Vercel) showing a chat interface, real-time telemetry feed, and per-publisher dashboard

Coalition docs (specs, reference, advocacy, data) live in the private
[SPUR-Coalition/org](https://github.com/SPUR-Coalition/org) repo.

## Demo app

The demo shows what inference-time telemetry looks like in practice. A user chats with an AI assistant that retrieves Guardian and Telegraph articles, and each retrieval, grounding, and citation fires telemetry events visible in real time on a per-publisher dashboard.

### Setup

```bash
cd demo
npm install
cp .env.example .env   # then fill in your keys
npm run dev             # http://localhost:5173
```

For the full local stack (OA server, key minting, the walkthrough click-path)
see [demo/RUNBOOK.md](demo/RUNBOOK.md).

### Environment variables

| Variable | Purpose |
|----------|---------|
| `DEMO_PASSWORD` | Password for the demo (leave blank to disable auth locally) |
| `GUARDIAN_API_KEY` | Guardian Open Platform API key |
| `TELEGRAPH_API_KEY`, `TELEGRAPH_API_URL` | Telegraph RSS feed API |
| `MISTRAL_API_KEY` | Mistral AI chat completions |
| `OA_TELEMETRY_URL` | OA server write endpoint (sessions, events) |
| `OA_API_URL` | OA server read endpoint (`/content-owners/*`) |
| `OA_PLATFORM_KEY` | Chat agent write key (`oat_pk_` prefix) |
| `OA_PUBLISHER_KEY_GUARDIAN`, `OA_PUBLISHER_KEY_TELEGRAPH` | Per-publisher read keys (`oat_pub_` prefix) |

## Stack

| Component | Technology |
|-----------|------------|
| Demo app | SvelteKit (Vercel) |
| Telemetry server | [oa-telemetry-server](https://github.com/openattribution-org/oa-telemetry-server) (Rust, Fly.io) |
| Database | PostgreSQL (Neon) |
| Telemetry SDK | [OpenAttribution Telemetry](https://github.com/openattribution-org) (TypeScript) |
| Compliance | [PolicyCheck](https://crates.io/crates/policycheck) (Rust CLI + API) |

## Related standards

- [OpenAttribution Telemetry](https://github.com/openattribution-org) - Telemetry spec, SDKs, and reference server
- [PolicyCheck](https://crates.io/crates/policycheck) - Compliance scanner for AI crawling policies
- [AIMS](https://github.com/openattribution-org) - Agent identity and mutual authentication (draft)
