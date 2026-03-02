# SPUR Technical Infrastructure

## What This Is

**Technical infrastructure for the [SPUR coalition](https://spurcoalition.org)** (Standards for Publisher Usage Rights). Alex Springer is SPUR's tech lead, working through the [OpenAttribution](https://openattribution.org) hat.

SPUR is a publisher coalition ("NATO for news") founded by BBC, FT, Guardian, Sky News, and Telegraph. Mission: shared technical standards so AI developers can access journalism legitimately while publishers retain control and receive fair value.

**This repo contains:** The technical deliverables Alex builds as SPUR tech lead - demo applications, compliance tooling, specs, and documentation for the coalition. The telemetry server itself lives in its own repo (`openattribution-org/oa-telemetry-server`).

All work here is delivered through OpenAttribution. Standards must work for any implementer. See `.claude/rules/separation.md` for scope boundaries.

## General Rules

- **Do not make changes beyond what was explicitly requested.** When in doubt, ask before expanding scope.
- **Stay focused on the user's specific request** - resist the urge to "improve" or refactor unrelated code.
- **If you think additional changes would be helpful, ASK first** before making them.
- **The user is not always right** - if you disagree, ask for clarification. Do not blow smoke up my ass. Highlight potentially bad ideas and suggest alternatives.
- **When editing existing files, always match the exact indentation style** and formatting conventions already present.
- **When updating docs, only update the specific section requested** - don't rewrite surrounding content.

## Voice & Writing

- **British English** (colour, licence, standardise, behaviour)
- Sentence case for titles
- Short paragraphs (2-3 sentences max)
- Active voice by default
- Link generously to sources

**Never use:**
- Em dashes. Use hyphens with spaces ( - ) instead.
- "Excited to announce", "thrilled to share", "proud to launch"
- "Game-changer", "revolutionary", "groundbreaking", "unprecedented"
- "Leverage", "synergies", "paradigm shift"
- Emoji in prose
- Walls of text without headers or structure

**Audience-dependent tone:**

| Context | Tone |
|---------|------|
| Specs / technical docs | Precise, show the code, less narrative |
| Member communications | Action-oriented, governance details, specific next steps |
| Outreach / emails | Casual, plain text feel, no bold headings, add new information |
| Presentations | Low text density, detail in supporting docs |
| Regulatory | Formal, evidence-based, structured arguments |

## Stack

| Component | Technology |
|-----------|------------|
| Demo app | SvelteKit (Vercel) |
| Telemetry server | `oa-telemetry-server` (Rust: axum + sqlx, Fly.io) |
| Database | PostgreSQL (Neon free tier) |
| Telemetry SDK | OpenAttribution Telemetry (Python + TypeScript) |
| Compliance | PolicyCheck (Rust CLI + API) |
| Identity | AIMS (draft, Python SDK) |
| VCS | GitHub (openattribution-org) |

## Project Structure

```
spur/
├── CLAUDE.md                    # This file
├── .claude/
│   ├── rules/
│   │   └── separation.md        # Three-entity firewall
│   └── settings.json
├── demo/                        # Three-pane live demo (SvelteKit, Vercel)
│   ├── src/
│   │   ├── lib/server/          # Guardian, Mistral, OA server clients
│   │   └── routes/              # Chat, telemetry feed, publisher dashboard
│   └── package.json
├── docs/
│   ├── reference/               # Research, transcripts, baselines
│   │   ├── landscape-review.md          # Protocol + marketplace landscape
│   │   ├── policycheck-baseline.md      # PolicyCheck scan analysis
│   │   ├── guardian-api.md              # Guardian Open Platform API reference
│   │   ├── mvfp-protocol-landscape.pdf  # DJB workshop deck (Nov 2025)
│   │   ├── spur-kickoff-notes.md        # Kick-off meeting notes
│   │   └── spur-kickoff-transcript.md   # Kick-off transcript
│   ├── specs/
│   │   └── technical-roadmap.md         # Four-phase roadmap
│   └── presentations/
│       └── presentation-brief.md        # 19-slide Gamma brief
├── scripts/                     # Tooling (PolicyCheck scans, etc.)
└── data/                        # Scan results, CSVs
    ├── policycheck-results.csv
    └── spur-domains.csv
```

## Commands

```bash
# Demo app
cd demo && npm run dev             # Run demo locally (http://localhost:5173)
cd demo && npm run build           # Build for Vercel

# PolicyCheck scans
policycheck analyze --csv data/spur-domains.csv --format csv --output data/results.csv

# Scripts (Python)
uv run scripts/<script>.py
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GUARDIAN_API_KEY` | Guardian Open Platform API key |
| `MISTRAL_API_KEY` | Mistral chat completions |
| `OA_SERVER_URL` | OA telemetry server (e.g. `https://oa-telemetry.fly.dev`) |
| `OA_PLATFORM_KEY` | Platform key for writing telemetry |
| `OA_PUBLISHER_KEY` | Publisher key for reading Guardian's dashboard |

## Key Context

### SPUR's core technical needs

1. **Telemetry at inference time** - Know when content is retrieved and cited by AI systems
2. **Two event types** - `content_retrieved` (pulled into context) and `content_cited` (shown to user)
3. **Bot authentication** - Identify AI crawlers (Cloudflare, AIMS)
4. **IP protection tools** - PolicyCheck scans for compliance posture
5. **Rights-cleared channels** - Ensure content flows through accountable routes
6. **Simple building blocks first** - Not complex granular detail initially

### Founding members

| Publisher | AI posture | Deals | API access |
|-----------|-----------|-------|------------|
| BBC | Hard block (nearly everything) | None | No public API |
| FT | Selective (OpenAI visible) | Google, OpenAI | No public API |
| Guardian | Moderate (GPTBot + Google allowed, RSL) | Google, OpenAI | **Open Platform API** (key available) |
| Sky News | Mostly open | Unclear | No public API |
| Telegraph | Total lockdown (57 user agents) | None | No public API |

### Guardian as first integration

Guardian is the natural first integration target:
- **Only SPUR member with RSL** adoption
- **Open Platform API** provides structured content access (search, tags, sections, full articles)
- **Rust client library** available: [`aletheia`](https://crates.io/crates/aletheia) on crates.io
- Already has deals with Google and OpenAI - understands the platform relationship
- See `docs/reference/guardian-api.md` for API reference

### Phase roadmap

- **Phase 1 - Foundation:** Member compliance audit **(1.1 DONE)**, telemetry profile v0.1, licensing clause template
- **Phase 2 - Infrastructure:** OA telemetry server deployed **(2.1 DONE)**, Guardian demo **(IN PROGRESS)**, API key auth **(DONE)**
- **Phase 3 - Adoption:** Member onboarding, platform engagement (Microsoft, Anthropic, Perplexity, OpenAI, Google)
- **Phase 4 - Scale:** Expanded events, AIMS identity, attribution computation, international

### OpenAttribution assets (already built)

- **OA telemetry server** (Rust: axum + sqlx, deployed on Fly.io) - [`oa-telemetry-server`](https://github.com/openattribution-org/oa-telemetry-server)
- **Telemetry spec v0.4** + Python/TypeScript SDKs + reference server (FastAPI)
- **PolicyCheck** on crates.io + Fly.io API + web UI
- **AIMS spec v0.1** + Python SDK (draft)

### Related repos

- `../oa-telemetry-server` - Production telemetry server (Rust, Fly.io)
- `../openattribution/telemetry` - Telemetry spec, SDKs, reference server
- `../openattribution/policycheck` - Compliance scanner (Rust)
- `../openattribution/aims` - Agent identity spec
- `../openattribution/website` - openattribution.org

## Documentation Rules

### What goes in this repo

- Technical specs for SPUR infrastructure
- PolicyCheck scan results and baselines
- Presentation briefs and slide content
- Meeting notes and transcripts (reference)
- Demo application code
- Standards integration guides
- Member API references (Guardian, etc.)

### What stays in openattribution/

- The standards themselves (Telemetry, AIMS, PolicyCheck specs)
- SDK source code
- Reference implementations
- openattribution.org website

## Coalition Contacts

- **David Buttle** - Coalition lead. Founder, DJB Strategies. Former FT Director of Platform Strategy.
- **Dominic Young** - Coalition lead. Founder, Ytrium. Former CEO, The Copyright Hub.
- **Alex Springer** - Tech lead (through OpenAttribution). Director, OpenAttribution.
