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

## Phase 1: Foundation

**Goal:** SPUR members can audit their current posture and agree on what to require from AI platforms.

### 1.1 Member compliance audit - COMPLETE

PolicyCheck scanned all five SPUR founding members on 2 March 2026. Full results in the [baseline report](../reference/policycheck-baseline.md) and [raw CSV](../../data/policycheck-results.csv).

**Key findings:**

| Publisher | AI bot blocking posture | RSL | Content Signals | TDMRep |
|-----------|------------------------|-----|-----------------|--------|
| BBC | Hard block (nearly everything) | None | None | None |
| FT | Selective (OpenAI deal visible) | None | None | None |
| Guardian | Moderate (OpenAI + Google allowed) | Yes (1 group) | None | None |
| Sky News | Mostly open (GPTBot + CCBot only) | None | None | None |
| Telegraph | Total lockdown (57 user agents) | None | None | None |

Five publishers, five different blocking strategies. Only the Guardian has an RSL licence. Zero adoption of Content Signals, TDMRep, or Markdown for Agents across all five members.

Deal structures are visible through robots.txt: FT allows GPTBot (likely OpenAI deal), Guardian allows GPTBot + Google-Extended (likely deals with both). These bilateral deals are being negotiated without usage data.

**Tool:** [PolicyCheck batch CSV processing](https://github.com/openattribution-org/policycheck). Single command:
```bash
policycheck analyze --csv spur-members.csv --format csv --output spur-audit.csv
```

**Deliverable:** Complete. Spreadsheet with per-member compliance posture. Baseline report identifies gaps and quick wins.

### 1.2 Retrieval + citation event specification

Formalise the two core event types agreed in the kick-off. These are already defined in [OpenAttribution Telemetry v0.4](https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md). The full spec supports additional event types (commerce, engagement) - SPUR starts with these two and members can adopt others as needed.

**SPUR Telemetry Profile v0.1:**

| Event | What it means | Required fields |
|-------|--------------|-----------------|
| `content_retrieved` | AI system pulled this content into its context window | `content_url`, `timestamp` |
| `content_cited` | AI system showed this content (or a derivative) to a user | `content_url`, `timestamp`, `citation_type` |

Citation types: `direct_quote`, `paraphrase`, `reference`, `contradiction` (content retrieved but disagreed with - should not receive positive credit).

**Privacy level recommendation for SPUR:** `minimal` (token counts + content URLs only, no query text, no user data). Publishers get enough to measure usage without requiring AI platforms to share conversation content.

**Pricing model implications:** SPUR is [evaluating pay-per-crawl vs pay-per-inference](https://pressgazette.co.uk/news/uk-news-giants-form-nato-for-news-group-to-defend-against-ai/). These two event types directly enable **pay-per-inference** - the more publisher-friendly model. `content_retrieved` counts how often content enters the context window. `content_cited` counts how often it reaches users. Pay-per-crawl is already handled by existing infrastructure ([Cloudflare Pay Per Crawl](https://blog.cloudflare.com/content-signals-policy), [IAB CoMP CPCr](https://iabtechlab.com/content-monetization-protocols/)). Pay-per-inference is the gap. This is it.

**Deliverable:** One-page SPUR Telemetry Profile document. Precise enough for OpenAI/Anthropic/Google to implement against.

### 1.3 Baseline licensing clause template

Draft the contractual language publishers can include in licensing agreements:

> "Licensee shall emit [OpenAttribution Telemetry](https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md) events conforming to the SPUR Telemetry Profile v0.1 for all content retrieved or cited from Licensor's corpus. Events shall be transmitted to a telemetry endpoint designated by Licensor within 24 hours of the interaction."

This gives publishers something concrete to put in front of AI platform legal teams.

**Deliverable:** Template clause for member review. Not legal advice - members adapt for their own agreements.

---

## Phase 2: Infrastructure

**Goal:** A working telemetry endpoint that any SPUR member can point their licensing agreements at.

### 2.1 SPUR telemetry endpoint - COMPLETE

The production telemetry server has been built in Rust (axum + sqlx) and deployed to Fly.io. It lives in its own repo: [`oa-telemetry-server`](https://github.com/openattribution-org/oa-telemetry-server). The server receives telemetry signals from AI platforms and makes them available to the publisher whose content was used.

**Architecture:**

```
AI Platform (OpenAI, Anthropic, Google, etc.)
    │
    │  POST /events  (content_retrieved, content_cited)
    │  Header: X-API-Key: <spur-issued-key>
    ▼
SPUR Telemetry Endpoint
(OpenAttribution reference server)
    │
    │  Dashboard / API access per publisher
    ▼
BBC  |  FT  |  Guardian  |  Sky  |  Telegraph  |  ...
```

Each AI platform gets an API key. Each publisher gets read access to events involving their content (matched by URL domain). Privacy model ensures no publisher sees another's data.

**Key design decisions:**
- **Hosted neutrally** - Not on any member's infrastructure. Cloud deployment under OpenAttribution.
- **Multi-tenant** - Each publisher sees only their own content events.
- **URL-based routing** - Events route to publishers based on `content_url` domain matching.
- **Retention policy** - Agreed with members. Suggest 90 days raw, aggregated indefinitely.

**Deliverable:** Running endpoint. API documentation. Onboarding guide for AI platforms.

### 2.2 Guardian structured API integration

The Guardian was flagged in the kick-off as a good first content provider partner due to their existing structured API ([open-platform.theguardian.com](https://open-platform.theguardian.com/)). Use this as the first concrete integration:

1. Guardian content accessible via their API
2. AI platform retrieves Guardian content → emits `content_retrieved` event
3. AI platform cites Guardian content → emits `content_cited` event
4. Guardian sees usage data in SPUR dashboard

This is the proof point. One publisher, one AI platform, real telemetry flowing.

**Deliverable:** Working end-to-end demo with Guardian content.

### 2.3 Bot authentication (pragmatic approach)

Two layers, phased:

**Now (Phase 2):** API key authentication. SPUR issues keys to AI platforms. Simple, proven, works today. Every event is tied to a known platform. This is what the [OpenAttribution reference server](https://github.com/openattribution-org/telemetry/tree/main/server) already supports.

**Later (Phase 4):** [AIMS](https://github.com/openattribution-org/aims)-based agent identity. Decentralised Identifiers (`did:aims:web:openai.com:chatgpt`) for cryptographic verification. More robust, but the spec is earlier stage and AI platforms aren't ready for it yet.

**Cloudflare integration:** For bot identification at the crawl layer (before licensing), leverage [Cloudflare's bot management](https://www.cloudflare.com/application-services/products/bot-management/) and Content Signals. This runs alongside telemetry, not instead of it - Content Signals express what's allowed, telemetry measures what happened.

**Deliverable:** API key auth on SPUR endpoint. AIMS roadmap document for later phases.

---

## Phase 3: Adoption

**Goal:** Multiple publishers receiving telemetry. At least one AI platform emitting it.

### 3.1 Member onboarding

Roll out the telemetry endpoint to all five founding members:

1. **Domain registration** - Each member registers their content domains (e.g., bbc.co.uk, bbc.com, theguardian.com, ft.com, news.sky.com, telegraph.co.uk)
2. **Dashboard access** - Each member gets a login to view their content usage data
3. **Licensing clause adoption** - Each member includes the telemetry requirement in their next AI platform negotiation

### 3.2 AI platform engagement

Approach AI platforms with the SPUR telemetry requirement. The value proposition for them:

- **Compliance proof** - Demonstrate they're using content within licence terms
- **Reduced legal risk** - Transparent usage data reduces copyright exposure
- **Standardised** - One integration covers all SPUR members (and future adopters)
- **Lightweight** - Two event types, minimal data, [well-documented SDK](https://github.com/openattribution-org/telemetry)

**Existing deal landscape** ([Press Gazette](https://pressgazette.co.uk/news/uk-news-giants-form-nato-for-news-group-to-defend-against-ai/)): Guardian and FT already have deals with both Google (AI display rights) and OpenAI. BBC and Telegraph do not. Sky News status unclear. This means some members already have relationships where telemetry requirements could be added to existing agreements, while others would introduce it in new negotiations.

Target platforms (in order of likely engagement):
1. **Microsoft/Bing** - Already building [content marketplace](https://digiday.com/media/the-case-for-and-against-publisher-content-marketplaces/), most aligned incentives
2. **Anthropic** - Positioning as responsible AI, telemetry fits their brand
3. **Perplexity** - Already facing publisher backlash, compliance is damage control
4. **OpenAI** - Largest user, but least likely to voluntarily comply without pressure
5. **Google** - Under [CMA scrutiny](https://www.gov.uk/cma-cases/google-search-generative-experience) for AI Overviews, regulatory pressure may help

### 3.3 RSL integration

For members who adopt [RSL](https://rslstandard.org/rsl), telemetry and licensing terms reinforce each other:

- RSL declares what's permitted (`ai-input: yes`, payment type, attribution requirements)
- Telemetry measures what actually happened (`content_retrieved`, `content_cited`)
- Mismatch = licence violation, with evidence

[PolicyCheck](https://github.com/openattribution-org/policycheck) can verify RSL is correctly deployed. The telemetry endpoint can cross-reference events against RSL terms to flag non-compliance automatically.

Note: [1,500+ organisations already endorse RSL](https://pressgazette.co.uk/news/uk-news-giants-form-nato-for-news-group-to-defend-against-ai/) including Yahoo, Reddit, Medium, Ziff Davis, BuzzFeed, USA Today, and Vox Media. SPUR members adopting RSL would join an existing critical mass, not start from scratch.

**Deliverable:** RSL deployment guide for SPUR members. Automated compliance alerting on the telemetry endpoint.

---

## Phase 4: Scale

**Goal:** SPUR telemetry becomes an industry expectation, not just a coalition requirement.

### 4.1 Expanded event types

Once the foundation is proven, extend beyond retrieval + citation:

| Event | Purpose | When to add |
|-------|---------|------------|
| `content_displayed` | Distinguish retrieval from actual display | When AI platforms support it |
| `content_engaged` | User clicked, expanded, or interacted with content | When in-chat content rendering is common |
| Commerce events (`product_viewed`, `checkout_completed`) | Attribution to revenue | When commerce-focused publishers join |

These are already specified in [OpenAttribution Telemetry v0.4](https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md). Adding them is a configuration change, not a spec change.

### 4.2 AIMS agent identity

Move from API key auth to [AIMS](https://github.com/openattribution-org/aims) Decentralised Identifiers:

- AI platforms publish manifests at `/.well-known/aims/`
- Manifests declare training data provenance, licensed sources, redistribution policies
- SPUR endpoint verifies identity cryptographically
- Agent-to-agent trust chains enable attribution across multi-hop agent pipelines

This is the long-term answer to "how do we know who's using our content?" but requires AI platform adoption of AIMS, which is a standards adoption challenge.

### 4.3 Attribution computation

With telemetry flowing, compute content contribution scores:

- Which content is retrieved most?
- Which content is cited most?
- What's the ratio of retrieval to citation? (high retrieval, low citation = content is being used but not credited)
- Cross-publisher comparison (anonymised) - are some publishers' content used more than credited?

This data gives SPUR members leverage in licensing negotiations. "Your platform retrieved our content 2.3M times last month and cited it 400K times. Here's what fair compensation looks like."

Attribution algorithms are left to implementers (per the [OpenAttribution spec](https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md#13-non-goals)). SPUR can recommend approaches without mandating them.

### 4.4 International expansion

SPUR's stated ambition is global. The technical stack supports this:

- Telemetry spec is language/region agnostic
- PolicyCheck handles EU-specific standards ([TDMRep](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/)) alongside global ones (robots.txt, RSL)
- [EU AI Act](https://artificialintelligenceact.eu/) (full applicability August 2026) creates regulatory tailwind
- Multi-tenant endpoint can onboard publishers from any country

Target markets for expansion: US (NYT, Washington Post, etc.), EU (GDPR + AI Act alignment), Australia (News Corp, already litigious on AI).

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
| AI platforms refuse to emit telemetry | High | Critical | Regulatory pressure (CMA, EU AI Act), licensing leverage (no telemetry = no licence) |
| Members disagree on privacy levels | Medium | Medium | Default to `minimal` (URLs + timestamps only). Members can negotiate higher levels individually. |
| Too complex, too slow to ship | Medium | High | Phase 1 is deliberately minimal. Two event types. API keys. No fancy crypto. Ship, then iterate. |
| Competing standards fragment the space | Low | Medium | OpenAttribution is complementary to RSL/CoMP/Content Signals, not competing. The telemetry gap is unique. |
| Google doesn't engage | High | Medium | Google is under CMA investigation for AI Overviews. Regulatory pressure is building separately. Focus on willing platforms first. |
| Attribution computation is contested | Medium | Medium | Spec deliberately doesn't mandate algorithms. SPUR can recommend approaches. Let the data speak. |

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
| AI platform engagement | SPUR coalition leverage | Phase 3 |
| Alex's time (tech lead) | David/Dominic discussing engagement structure | In progress |

---

## Phase summary

| Phase | Key milestone |
|-------|--------------|
| **1. Foundation** | Member audit complete. SPUR Telemetry Profile v0.1 published. Licensing clause template drafted. |
| **2. Infrastructure** | SPUR telemetry endpoint live. Guardian integration demo working. API key auth operational. |
| **3. Adoption** | All five members onboarded. At least one AI platform emitting telemetry. RSL integration guide published. |
| **4. Scale** | Expanded event types. AIMS identity piloted. Attribution computation. International outreach. |

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
