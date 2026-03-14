# SPUR Technical Roadmap

**Author:** Alex Springer (OpenAttribution Director / SPUR tech lead)
**Date:** 2 March 2026
**For:** SPUR members (first review: [David Buttle](https://www.linkedin.com/in/davidjbuttle/), [Dominic Young](https://www.linkedin.com/in/dominicyoung/))
**Companion documents:** [Landscape review](../reference/landscape-review.md) | [PolicyCheck baseline](../reference/policycheck-baseline.md) | [Presentation brief](../presentations/presentation-brief.md)

---

## Guiding Principles

1. **Simple building blocks first.** Two event types, not twenty. Get something working that publishers can require in licensing deals now.
2. **Open standards, not vendor lock-in.** Everything [Apache 2.0](https://opensource.org/licenses/Apache-2.0) or [MIT](https://opensource.org/licenses/MIT). Any implementer can build on it.
3. **Complementary to existing infrastructure.** [RSL](https://rslstandard.org/rsl), [Cloudflare Content Signals](https://blog.cloudflare.com/content-signals-policy), [IAB CoMP](https://iabtechlab.com/content-monetization-protocols/) - we plug into what already exists, not replace it.
4. **Publisher control.** Publishers decide what telemetry they require, at what privacy level, from whom.

---

## Phase 1: Platform

**Goal:** SPUR members can sign up, claim their web properties, and have a working telemetry endpoint ready to receive data.

### 1.1 Member compliance audit - COMPLETE

PolicyCheck scanned all five SPUR founding members on 2 March 2026. Full results in the [baseline report](../reference/policycheck-baseline.md) and [raw CSV](../../data/policycheck-results.csv).

| Publisher | AI bot blocking posture | RSL | Content Signals | TDMRep |
|-----------|------------------------|-----|-----------------|--------|
| BBC | Hard block (nearly everything) | None | None | None |
| FT | Selective (OpenAI deal visible) | None | None | None |
| Guardian | Moderate (OpenAI + Google allowed) | Yes (1 group) | None | None |
| Sky News | Mostly open (GPTBot + CCBot only) | None | None | None |
| Telegraph | Total lockdown (57 user agents) | None | None | None |

### 1.2 SPUR telemetry endpoint - COMPLETE

Production telemetry server built in Rust (axum + sqlx), deployed to Fly.io. Repo: [`oa-telemetry-server`](https://github.com/openattribution-org/oa-telemetry-server).

```
AI Platform (OpenAI, Anthropic, Google, etc.)
    │
    │  POST /events  (content_retrieved, content_cited)
    │  Header: X-API-Key: <spur-issued-key>
    ▼
SPUR Telemetry Endpoint
    │
    │  Dashboard / API access per publisher
    ▼
BBC  |  FT  |  Guardian  |  Sky  |  Telegraph  |  ...
```

Multi-tenant. Each publisher sees only events involving their content (matched by URL domain). Hosted neutrally under OpenAttribution.

### 1.3 Publisher sign-up and domain claiming

Each SPUR member registers their content domains (bbc.co.uk, bbc.com, theguardian.com, ft.com, news.sky.com, telegraph.co.uk). Domain verification via DNS TXT record or meta tag. API key issued per publisher for read access.

### 1.4 SPUR Telemetry Profile v0.1

Two event types, already defined in [OpenAttribution Telemetry v0.4](https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md):

| Event | What it means | Required fields |
|-------|--------------|-----------------|
| `content_retrieved` | AI system pulled this content into its context window | `content_url`, `timestamp` |
| `content_cited` | AI system showed this content (or a derivative) to a user | `content_url`, `timestamp`, `citation_type` |

Citation types: `direct_quote`, `paraphrase`, `reference`, `contradiction`.

Privacy level: `minimal` (URLs + timestamps only, no query text, no user data).

### 1.5 Licensing clause template

> "Licensee shall emit [OpenAttribution Telemetry](https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md) events conforming to the SPUR Telemetry Profile v0.1 for all content retrieved or cited from Licensor's corpus. Events shall be transmitted to a telemetry endpoint designated by Licensor within 24 hours of the interaction."

Template for member review. Members adapt for their own agreements.

---

## Phase 2: Agent adoption

**Goal:** Demand-side first. Get AI agents emitting telemetry. Proof of concept with one agent, one publisher.

### 2.1 Guardian integration (proof of concept)

Guardian is the natural first target: only SPUR member with RSL, has a structured [Open Platform API](https://open-platform.theguardian.com/), already has deals with Google and OpenAI.

1. Guardian content accessible via their API
2. AI agent retrieves Guardian content -> emits `content_retrieved`
3. AI agent cites Guardian content -> emits `content_cited`
4. Guardian sees usage data via the SPUR endpoint

One publisher, one agent, real telemetry flowing end-to-end.

### 2.2 Agent-side integration

The path of least resistance is agents, not platforms. An independent AI agent (MCP tool, RAG pipeline, agentic app) can adopt the [TypeScript](https://www.npmjs.com/package/@openattribution/telemetry) or [Python](https://pypi.org/project/openattribution-telemetry/) SDK in a few lines. No platform-level buy-in required.

Target: get one or more agents emitting telemetry against SPUR member content as a working demo. This proves the loop works before asking anything of Google or OpenAI.

### 2.3 API key authentication

Simple, proven, works today. SPUR issues keys to agents and platforms. Every event tied to a known emitter. [AIMS](https://github.com/openattribution-org/aims)-based cryptographic identity comes later (Phase 4).

---

## Phase 3: Marketplace adoption

**Goal:** Telemetry becomes a condition in marketplace and licensing deals. Multiple publishers receiving data.

### 3.1 Marketplace integration

Telemetry as a standard condition in marketplace participation:

- **Microsoft PCM** - most aligned. Already supports bring-your-own-licence. Telemetry as a PCM requirement is the forcing function.
- **RSL Collective** - nonprofit collective licensing platform. Telemetry verifies that pay-per-use royalties reflect actual usage.
- **ProRata** - 750+ publications. Proprietary attribution could adopt OA Telemetry as an open verification layer.
- **TollBit** - 5,750+ publishers. Scraping volume data complements inference-time telemetry.

### 3.2 RSL integration

For members who adopt [RSL](https://rslstandard.org/rsl), telemetry and licensing terms reinforce each other:

- RSL declares what's permitted (`ai-input: yes`, payment type, attribution requirements)
- Telemetry measures what actually happened (`content_retrieved`, `content_cited`)
- Mismatch = licence violation, with evidence

[PolicyCheck](https://github.com/openattribution-org/policycheck) can cross-reference events against RSL terms to flag non-compliance automatically. [1,500+ organisations already endorse RSL](https://pressgazette.co.uk/news/uk-news-giants-form-nato-for-news-group-to-defend-against-ai/).

### 3.3 Full member onboarding

All five founding members with dashboard access, licensing clauses adopted, telemetry flowing from at least one marketplace or agent integration per member.

---

## Phase 4: AI platforms at scale

**Goal:** Major AI platforms emitting telemetry. Dashboards, analytics, expanded event types.

### 4.1 Platform engagement

Target platforms (in order of likely engagement):
1. **Microsoft/Bing** - Already building [content marketplace](https://digiday.com/media/the-case-for-and-against-publisher-content-marketplaces/), most aligned
2. **Anthropic** - Positioning as responsible AI, telemetry fits their brand
3. **Perplexity** - Facing publisher backlash, compliance is damage control
4. **OpenAI** - Largest user, least likely to voluntarily comply without pressure
5. **Google** - Under [CMA scrutiny](https://www.gov.uk/cma-cases/google-search-generative-experience) for AI Overviews, regulatory pressure may help

By this phase, the ecosystem already runs on telemetry via agents and marketplaces. Platforms adopt because they have to, not because they want to.

### 4.2 Publisher dashboards and analytics

- Per-publisher dashboards showing retrieval and citation volumes over time
- Cross-platform comparison (which platforms use your content most?)
- Retrieval-to-citation ratio (high retrieval, low citation = content used but not credited)
- Attribution computation for licensing negotiations
- Export and API access for member analytics teams

### 4.3 Expanded event types

| Event | Purpose |
|-------|---------|
| `content_displayed` | Distinguish retrieval from actual display |
| `content_engaged` | User clicked, expanded, or interacted with content |
| Commerce events (`product_viewed`, `checkout_completed`) | Attribution to revenue |

Already specified in [OpenAttribution Telemetry v0.4](https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md). Adding them is a configuration change.

### 4.4 AIMS agent identity

Move from API keys to [AIMS](https://github.com/openattribution-org/aims) Decentralised Identifiers:

- AI platforms publish manifests at `/.well-known/aims/`
- Cryptographic verification of which agent accessed which content
- Agent-to-agent trust chains for multi-hop pipelines

### 4.5 International expansion

Telemetry spec is language/region agnostic. [EU AI Act](https://artificialintelligenceact.eu/) (full applicability August 2026) creates regulatory tailwind. Target markets: US (NYT, Washington Post), EU (GDPR + AI Act), Australia (News Corp).

---

## Standards integration map

How the standards ecosystem fits together:

| Publisher declares terms | AI platform accesses content | Measurement |
|--------------------------|------------------------------|-------------|
| RSL: permissions, payment types, attribution requirements | Crawls content, checks robots.txt + RSL + Content Signals | OpenAttribution Telemetry: `content_retrieved`, `content_cited` events to endpoint |
| Content Signals: `search=yes`, `ai-input=yes`, `ai-train=no` | Negotiates licence via RSL OLP, marketplace, or direct agreement | Endpoint validates events against RSL terms |
| TDMRep (EU): `tdm-reservation: 1` | Accesses content within licence scope | Dashboard shows each publisher their usage data |
| IAB CoMP (emerging): CPCr / LLM Ingest API | Pays per CoMP pricing / marketplace fee | Attribution computation informs fair pricing |
| C2PA: Content Credentials | Verifies provenance before using | Audit trail links provenance to usage |

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI platforms refuse to emit telemetry | High | Critical | Don't start with platforms. Build adoption through agents and marketplaces first. Platforms adopt when the ecosystem already runs on it. Regulatory pressure (CMA, EU AI Act) and licensing leverage help. |
| Members disagree on privacy levels | Medium | Medium | Default to `minimal` (URLs + timestamps only). Members can negotiate higher levels individually. |
| Too complex, too slow to ship | Medium | High | Phase 1 is nearly built. Two event types. API keys. No fancy crypto. Ship, then iterate. |
| Competing standards fragment the space | Low | Medium | OpenAttribution is complementary to RSL/CoMP/Content Signals, not competing. The telemetry gap is unique. |
| Marketplaces don't adopt telemetry as a condition | Medium | High | Microsoft PCM is most aligned. RSL Collective's pay-per-use model needs usage verification by definition. Start where incentives align. |
| Google doesn't engage | High | Medium | Google is under CMA investigation for AI Overviews. Regulatory pressure is building separately. Google is Phase 4, not Phase 2. |

---

## Resources Needed

| Resource | Source | Status |
|----------|--------|--------|
| Telemetry spec + SDKs | [OpenAttribution](https://github.com/openattribution-org/telemetry) | Done (v0.4, Python + TypeScript SDKs published) |
| Compliance scanner | [PolicyCheck](https://github.com/openattribution-org/policycheck) | Done (crates.io, Fly.io API, web UI) |
| Agent identity spec | [AIMS](https://github.com/openattribution-org/aims) | Draft (v0.1, Python SDK published) |
| Telemetry endpoint hosting | Fly.io ([`oa-telemetry-server`](https://github.com/openattribution-org/oa-telemetry-server)) | Deployed |
| Publisher dashboard | Three-pane demo in `spur/demo/` | In progress |
| Legal clause template | SPUR legal working group | To draft |
| AI platform engagement | SPUR coalition leverage | Phase 3-4 |
| Alex's time (tech lead) | David/Dominic discussing engagement structure | In progress |

---

## Phase summary

| Phase | Key milestone |
|-------|--------------|
| **1. Platform** | SPUR members sign up, claim web properties. Telemetry endpoint live. Telemetry profile and licensing clause ready. Nearly built. |
| **2. Agent adoption** | Demand-side first. PoC with one agent + one publisher (Guardian). Prove the loop works. |
| **3. Marketplace adoption** | Telemetry as a condition in marketplace deals (PCM, RSL Collective, ProRata). All five members onboarded. |
| **4. AI platforms at scale** | Major platforms emitting. Dashboards, analytics, expanded events, AIMS identity, international. |

---

## References

- [OpenAttribution Telemetry Specification v0.4](https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md)
- [OpenAttribution Telemetry SDKs](https://github.com/openattribution-org/telemetry) (Python, TypeScript)
- [AIMS Specification](https://github.com/openattribution-org/aims/blob/main/SPECIFICATION.md)
- [PolicyCheck](https://github.com/openattribution-org/policycheck) (Rust CLI + API)
- [PolicyCheck Web UI](https://openattribution.org/policycheck/)
- [RSL 1.0 Standard](https://rslstandard.org/rsl)
- [IAB Content Monetization Protocols](https://iabtechlab.com/content-monetization-protocols/)
- [Cloudflare Content Signals](https://blog.cloudflare.com/content-signals-policy)
- [W3C TDMRep](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/)
- [C2PA](https://c2pa.org/)
- [EU AI Act](https://artificialintelligenceact.eu/)
- [SPUR Coalition](https://spurcoalition.org)
