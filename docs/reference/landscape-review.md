# AI Content Licensing: Protocol and Marketplace Landscape

**Author:** Alex Springer (OpenAttribution Director / SPUR tech lead)
**Date:** 2 March 2026
**For:** SPUR members (first review: David Buttle, Dominic Young)
**Builds on:** MVFP protocol landscape (November 2025), SPUR kick-off requirements
**Companion documents:** [Technical roadmap](../specs/technical-roadmap.md) | [PolicyCheck baseline](policycheck-baseline.md) | [Presentation brief](../presentations/presentation-brief.md)

---

## Structure

Builds on Dom's MVFP landscape (rights reservation + licensing) and adds the measurement column we discussed on the call. Updated with Q1 2026 developments.

1. **Rights reservation** - updated from MVFP
2. **Licensing and transactions** - updated from MVFP
3. **Measurement and telemetry** - new
4. **Identity and provenance**
5. **Content marketplaces** - significantly expanded
6. **AI platform engagement map**
7. **Outreach priorities**

---

## 1. Rights reservation

How publishers declare whether and how AI systems may access their content. Updated from MVFP November 2025.

| Standard | Owner | Model | Scope | Status (Feb 2026) |
|----------|-------|-------|-------|-------------------|
| [Cloudflare Content Signals](https://blog.cloudflare.com/content-signals-policy) | Cloudflare | Deployed standard | Training, search, RAG | **Most adopted.** Path-level and user-agent targeting. Three signals: `ai-train`, `search`, `ai-input`. Cloudflare serves ~20% of the internet - widest potential reach. |
| [W3C TDMRep](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/) | W3C Community Group | Final spec | TDM (EU-focused) | Final Report (Feb 2024). Not a formal W3C Standard. EU Copyright Directive Article 4 compliance. HTTP headers, JSON files, HTML meta. Binary reservation (yes/no) with policy link. |
| [IETF AI Preferences](https://datatracker.ietf.org/group/aipref/about/) | IETF | Working group | TBC | Working group formed. Active drafts including `draft-ietf-aipref-attach` (associating AI usage preferences with HTTP content). If successful, would become an internet standard with governance weight the others lack. |
| [llms.txt](https://llmstxt.org/) | Community proposal | Proposed standard | Inference | Curated Markdown at `/llms.txt`. Content curation, not licensing. Growing adoption but no governance. |
| [AI.txt](https://site.spawning.ai/ai-txt) | Spawning AI (VC-backed) | Proposed standard | Training | Element-level AI permissions (more granular than robots.txt). 80M+ works in Do Not Train registry. Stability AI and HuggingFace honour it. |
| robots.txt extensions | Various | Various proposals | Various | Fragmented. Google-Extended blocks training but NOT AI Overviews. IETF RFC 9309 codified the base spec but AI-specific extensions remain proposals. |

### SPUR member baseline (PolicyCheck scan, 2 March 2026)

PolicyCheck scanned all five founding members. The results show widespread blocking but zero coordination and almost no structured licensing signals.

**AI bot access across SPUR members:**

| Bot | Category | BBC | FT | Guardian | Sky News | Telegraph |
|-----|----------|-----|-----|----------|----------|-----------|
| GPTBot | Training | Blocked | Allowed | Allowed | Blocked | Blocked |
| ClaudeBot | Training | Blocked | Blocked | Blocked | Allowed | Blocked |
| Google-Extended | Training | Blocked | Blocked | Allowed | Allowed | Blocked |
| Meta-ExternalAgent | Training | Blocked | Blocked | Blocked | Allowed | Blocked |
| CCBot | Training | Blocked | Blocked | Blocked | Blocked | Blocked |
| OAI-SearchBot | Search | Blocked | Allowed | Allowed | Allowed | Blocked |
| PerplexityBot | Search | Blocked | Blocked | Blocked | Allowed | Blocked |
| ChatGPT-User | User-triggered | Blocked | Allowed | Allowed | Allowed | Blocked |

**Licensing signal adoption:**

| Signal | BBC | FT | Guardian | Sky News | Telegraph |
|--------|-----|-----|----------|----------|-----------|
| RSL licence | None | None | Yes (1) | None | None |
| Content Signals | None | None | None | None | None |
| W3C TDMRep | None | None | None | None | None |

Five publishers, five different blocking strategies. FT allows GPTBot (likely OpenAI deal). Guardian allows GPTBot + Google-Extended (likely deals with both). Sky News blocks almost nothing. Telegraph blocks everything - 57 user agents, the most comprehensive robots.txt of the group. BBC blocks ProRataInc by name.

Raw data: `policycheck-results.csv`. Methodology: [PolicyCheck](https://github.com/openattribution-org/policycheck) v0.4.0 batch scan.

### Assessment (updated from MVFP)

The MVFP evaluation found no standard scored well on governance, legal recognition, or demand-side respect. That hasn't changed materially. Cloudflare Content Signals has the widest deployment footprint but remains proprietary. IETF AI Preferences is the best governance path but is still in drafts. TDMRep is the only one with any legal standing (EU Copyright Directive) but is EU-only and binary.

**The PolicyCheck baseline makes this concrete for SPUR:** Not a single founding member uses Content Signals, TDMRep, or Markdown for Agents. Only the Guardian has RSL. Rights reservation is being done entirely through robots.txt - a 30-year-old standard designed for search engines. And even that is uncoordinated: five publishers, five different approaches.

**Key gap for SPUR:** Rights reservation tells AI platforms what's allowed. It doesn't tell publishers what actually happened. A publisher can block training via Content Signals, but they have no way to know if the signal was respected. Measurement fills this gap.

---

## 2. Licensing and transactions

How publishers monetise AI access to their content. Updated from MVFP November 2025.

| Standard / Platform | Owner | Model | Scope | Status (Feb 2026) |
|---------------------|-------|-------|-------|-------------------|
| [RSL 1.0](https://rslstandard.org/rsl) | RSL (open standard) | Open standard | Inference, retrieval, training | **Live and rolling out.** 1,500+ endorsements. XML-based machine-readable terms. 8 payment types. Crawler Authorization Protocol (CAP) + Open License Protocol (OLP). Infrastructure support from Cloudflare, Akamai, Fastly. [Supertab](https://www.supertab.co/) offering RSL as a managed service (deployment, hosting, compliance monitoring). Note: the [RSL Collective](https://rslcollective.org/) is a separate nonprofit licensing platform that uses the RSL standard to operate a pay-per-use royalty system - see Content Marketplaces section. |
| [IAB CoMP](https://iabtechlab.com/content-monetization-protocols/) | IAB Tech Lab | Open standard (draft) | Inference, retrieval, training | **Working group formed August 2025.** 80+ executives. Participants include Dotdash Meredith, Bertelsmann, Cloudflare, AWS, TollBit, Dappier, ProRata.ai, Meta, Google. Three pillars: bot traffic blocking, content discovery (Content Access Rules, llms.txt), monetisation APIs (Cost Per Crawl, LLM Ingest API). **No published specification yet.** Also released draft "AI Accountability for Publishers Act" (Feb 2026) based on unjust enrichment theory. |
| [Peek-Then-Pay](https://peekthenpay.org/) | FetchRight (VC-backed) | Open standard (CC0) | Inference | **Early access.** Five-step flow: discovery (`/.well-known/peek.json`) -> preview -> license (JWT) -> access (edge-enforced) -> report. Publishers serve pre-chunked content. MCP-native. No public adoption numbers. |

### Assessment

RSL is the most complete licensing standard - machine-readable terms, payment models, protocol endpoints. The challenge is demand-side adoption: AI platforms need to implement OLP token acquisition and respect RSL terms. IAB CoMP has the governance credibility and the working group membership but hasn't shipped a specification. Peek-Then-Pay is technically interesting (publisher-side content delivery) but lacks adoption.

**Key gap for SPUR:** Licensing protocols facilitate the deal. They don't verify compliance. A publisher can set RSL terms and issue tokens, but they can't independently verify that the AI platform is respecting the terms or accurately reporting usage. That requires measurement infrastructure.

**The MVFP question - "Does the protocol facilitate a flow of data back from licensee to licensor?"** - only IAB CoMP and TollBit scored "supports" on this. The telemetry gap is structural.

---

## 3. Measurement and telemetry

**This is the column the MVFP framework didn't include.** How publishers know what happened to their content after it entered an AI system.

| Standard / Platform | Owner | Model | What it measures | Status (Feb 2026) |
|---------------------|-------|-------|------------------|-------------------|
| [OpenAttribution Telemetry](https://github.com/openattribution-org/telemetry) | OpenAttribution.org (nonprofit) | Open standard (Apache 2.0) | Retrieval events, citation events, engagement, commerce outcomes | **Production.** [Specification v0.4](https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md). Python SDK on [PyPI](https://pypi.org/project/openattribution-telemetry/), TypeScript SDK on [npm](https://www.npmjs.com/package/@openattribution/telemetry). Reference server. [First live deployment](https://forageshopping.com) (Feb 2026). Transport-agnostic (HTTP postback, MCP tool, bulk upload, message queue). Four privacy levels (full / summary / intent / minimal). |
| Miso.ai (Project Sentinel + attribution) | Miso Technologies (VC-backed) | Proprietary | AI scraping violations, per-answer content attribution | **Production.** Monitors 8,300+ publisher sites. Tracks AI bot scraping and robots.txt violations (finding 15-90% violation rates depending on AI company). Calculates per-answer attribution percentages. Pays royalties based on content contribution. 50+ publisher partners (O'Reilly, BBC, Guardian, USA Today, Newsweek). |
| ProRata.ai (attribution) | ProRata.ai (VC-backed) | Proprietary | Per-answer content contribution scores | **Production.** Proportional attribution calculates which sources shaped each AI output. 50/50 revenue split with 750+ publications. Gist Answers chatbot as consumer product. $75M raised. |
| GEO / AI visibility platforms | Various (Evertune.ai, Profound, VantagePoint, others) | Proprietary | Brand mentions in AI outputs | **Production (brand-side).** SEO-equivalent measurement for AI platforms. Monitor how brands appear in ChatGPT, Gemini, Perplexity responses. **Not publisher-focused** - these serve brands wanting to know how they appear, not publishers wanting to know how their content is used. |
| [Bing AI Performance Report](https://www.bing.com/webmasters/aiperformance) | Microsoft | Platform-provided (free) | Citation counts, grounding queries, cited pages | **Public preview (Feb 2026).** First AI platform to provide any citation visibility data. Shows how often URLs are cited in Copilot and "select partner" AI responses. Covers Bing/Copilot ecosystem only. Visibility only - no clicks, no click-through data. Sampled data, may be retroactively refined. Export to CSV for analysis. Lookback to Nov 2025. |

### Assessment

This is the most fragmented and least mature layer. The key distinction:

- **Bing's AI Performance Report** is notable as the first platform-provided citation data, but it's limited: visibility only (no clicks), Bing/Copilot ecosystem only, sampled, dashboard-only with CSV export. Publishers see what Microsoft chooses to show, not raw event data they control. It does however signal that Microsoft is the most willing platform to provide measurement - making them the natural first target for SPUR telemetry adoption.
- **Miso and ProRata** measure attribution within their own closed systems. Publishers using Miso Answers or Gist Answers get attribution data. Publishers whose content is used by ChatGPT, Copilot, or Gemini get nothing.
- **GEO platforms** serve brands, not publishers. They monitor AI outputs but don't track content retrieval or citation.
- **OpenAttribution** is the only open standard designed for cross-platform inference-time telemetry. It defines the event types (retrieval, citation) that SPUR identified as core requirements. The difference from Bing's report: OA Telemetry gives publishers raw, per-event data at an endpoint they control, across all platforms, with programmatic API access - not a platform-controlled dashboard from a single provider.
- **Google is actively hiding AI-specific data.** AI Overview and AI Mode data is [rolled into GSC's regular performance reports](https://momenticmarketing.com/blog/ai-performance-reports-bing-wmt) with no way to separate AI-generated visibility from traditional organic. No plans announced to break it out. The likely reason: as AI-generated response visibility grows, clicks shrink - data Google doesn't want to surface.

**The opportunity:** Requiring telemetry as a licensing condition creates demand-side adoption pressure that no individual publisher can exert alone. The standard is ready. The coalition creates the forcing function.

---

## 4. Identity and provenance

How publishers know who is accessing their content and where content came from.

| Standard | Owner | What it does | Status (Feb 2026) |
|----------|-------|-------------|-------------------|
| [AIMS](https://github.com/openattribution-org/aims) | OpenAttribution.org | Agent identity (DIDs), training data provenance, runtime access rights, agent-to-agent trust | Draft spec v0.1. Python SDK on [PyPI](https://pypi.org/project/openattribution-aims/). Early stage. |
| [KYA / KYAPay](https://skyfire.xyz/) | Skyfire | "Know Your Agent" - identity + payment protocol for AI agents | Production. Demonstrated with Visa Intelligent Commerce (Dec 2025). Integrated with Akamai for edge enforcement. |
| [C2PA](https://c2pa.org/) | Adobe/Microsoft/BBC | Content provenance and authenticity ("Content Credentials") | Spec v2.3, on track for ISO standardisation. Proves WHERE content came from, not what you can do with it. |

### Assessment

Identity is a future requirement, not an immediate one. For SPUR Phase 1-2, API key authentication (SPUR issues keys to AI platforms) is sufficient. AIMS and KYA become relevant when SPUR needs cryptographic verification of which AI agent accessed which content.

C2PA is complementary - it proves provenance (this article was published by the BBC), while telemetry proves usage (this article was retrieved by ChatGPT).

---

## 5. Content marketplaces

Who is building exchanges where AI platforms can license publisher content. Significantly expanded since MVFP November 2025.

| Marketplace | Owner | Model | Publisher network | Status (Feb 2026) |
|-------------|-------|-------|-------------------|-------------------|
| **Microsoft PCM** | Microsoft | Proprietary (buy-side) | Co-designed with AP, Business Insider, Conde Nast, Hearst, USA TODAY, Vox Media. Yahoo as first demand partner. | **Launched Feb 2026.** "Click-to-sign" model. Supports bring-your-own-licence for externally negotiated deals. Copilot is primary consumer. Positioned as infrastructure for the "agentic web." Most aligned with SPUR's interests. |
| **Amazon** (unnamed) | Amazon | Proprietary (buy-side) | TBC | **In development.** Building parallel content licensing marketplace. Details sparse. Rufus (Amazon's shopping assistant) is the likely primary consumer. |
| **ProRata.ai** | ProRata (VC-backed) | 50/50 revenue share | 750+ publications (Atlantic, Guardian, Sky News, Fortune, Vox, Daily Mail, Time, Boston Globe). News/Media Alliance partnership. | **Live.** Gist Answers consumer chatbot. Gist Ads for native advertising. IAB CoMP working group participant. $75M raised. |
| **TollBit** | TollBit (VC-backed) | Pay-per-scrape / pay-per-use | 5,750+ publishers (via Freestar pubOS integration). Local Media Consortium (5,000 local news members). | **Live.** Bot paywall / access control. IAB CoMP participant. Data point: Digital Trends received 4.1M bot scrapes in one week, referring only 4,200 human visitors. |
| **Cloudflare Pay Per Crawl** | Cloudflare | Pay-per-crawl | Any Cloudflare customer (~20% of web) | **Pilot.** Publishers set per-request price. HTTP 402 responses. Cloudflare as Merchant of Record. Zero-code adoption. Widest potential reach of any marketplace. |
| **[RSL Collective](https://rslcollective.org/)** | RSL Collective (nonprofit) | Pay-per-use royalties | Reddit, Vox Media, BuzzFeed, Stack Overflow and others listed as supporters. | **Live.** Nonprofit licensing platform built on the RSL standard. Pay-per-use model: AI companies compensate content owners each time their work generates an AI output. Collective bargaining for publishers. "Creator Bill of Rights" framing (control, representation, royalties). Similar model to ProRata but nonprofit and built on open standard infrastructure rather than proprietary attribution. |
| **Dappier** | Dappier (VC-backed) | AI content marketplace + agentic ads | Early stage | **Live.** Data syndication + native ads in AI conversations. IAB CoMP participant. |

### Assessment

The marketplace landscape has expanded significantly since November 2025. The MVFP evaluation question - "Does a proprietary marketplace connect with liquid demand?" - remains the key test, and the answer is still mostly no. Microsoft PCM is the strongest candidate because Copilot provides built-in demand.

**The structural problem** (per [Alan Chapell in Digiday](https://digiday.com/media/the-case-for-and-against-publisher-content-marketplaces/)): "The black market is the marketplace. As long as scraping is cheap, easy, and largely consequence-free, a formal content marketplace is competing against a de facto free alternative."

**The opportunity:** Marketplaces handle transactions. They don't provide transparency. Members licensing content through Microsoft PCM, ProRata, or directly still need independent measurement of what happened to their content. Telemetry is the verification layer that sits alongside any marketplace.

---

## 6. AI platform engagement map

How SPUR's founding members currently relate to AI platforms:

| Platform | Guardian | FT | BBC | Telegraph | Sky News | Telemetry support |
|----------|----------|-----|-----|-----------|----------|-------------------|
| **Google** | Licensed (AI display rights) | Licensed | No deal | No deal | Unclear | None |
| **OpenAI** | Licensed | Licensed | No deal | No deal | Unclear | None |
| **Microsoft** | PCM participant (likely) | TBC | TBC | TBC | TBC | Limited ([Bing AI Performance Report](https://www.bing.com/webmasters/aiperformance) - citation counts, no clicks, Copilot only, sampled) |
| **Anthropic** | No deal | No deal | No deal | No deal | No deal | None |
| **Perplexity** | No deal (litigation risk) | No deal | No deal | No deal | No deal | None |

**The gap is almost universal.** Microsoft now provides limited citation visibility via the [Bing AI Performance Report](https://www.bing.com/webmasters/aiperformance) (Feb 2026) - citation counts and grounding queries for the Copilot ecosystem, but no clicks, no per-event data, and no programmatic access. Every other platform provides nothing. Even where licensing deals exist (Guardian-Google, FT-OpenAI), publishers receive payment but no visibility into actual usage. Google actively obscures AI-specific data by [rolling it into standard GSC metrics](https://momenticmarketing.com/blog/ai-performance-reports-bing-wmt) with no way to separate AI-generated visibility from traditional organic search.

---

## 7. Outreach priorities

### Tier 1: Reach out this week

**Microsoft - Nikhil Kolar (VP Microsoft AI)**
- PCM is the most aligned marketplace infrastructure
- Microsoft explicitly frames PCM as "building toward a sustainable content economy for the agentic web"
- If SPUR can get telemetry embedded as a PCM requirement, that's the forcing function for platform adoption
- Entry point: PCM already supports "bring-your-own-licence" - telemetry could be a standard condition

**Miso.ai**
- Overlapping publisher base with SPUR members (BBC, Guardian, USA Today, Newsweek)
- Project Sentinel monitors 8,300+ sites and documents AI scraping violations - exactly the audit data SPUR needs
- Proven attribution royalty model (O'Reilly pays creators based on per-answer contribution)
- Natural candidate to adopt OpenAttribution as an open standard alternative to their proprietary measurement
- Contact: Lucky Gunasekara, CEO

**ProRata.ai**
- 750+ publications, overlapping members (Guardian, Sky News)
- IAB CoMP working group participant - already engaged in standards
- Proprietary attribution could eventually adopt OpenAttribution if the standard gains sufficient traction
- Their Gist Answers is a working proof point for attribution-based revenue sharing
- $75M raised - well-resourced to implement standards
- Contact: Bill Gross, CEO / Michele Tobin, CRO (joined Feb 2026)

**Madhav Chinnappa (former Google, Reuters Institute)**
- Former Google News Partnerships lead - deep understanding of Google's content licensing posture
- Publicly advocated for a "NATO for news" model aligning with SPUR's mission
- Bridge to Google's measurement thinking (or lack thereof)
- Currently: visiting fellow at Reuters Institute for the Study of Journalism

### Tier 2: Reach out within two weeks

**IAB Tech Lab (CoMP working group)**
- OpenAttribution telemetry is the measurement layer that complements CoMP's transaction protocols
- CoMP handles discovery and monetisation; telemetry handles verification
- Working group includes 80+ executives - getting telemetry on their agenda amplifies SPUR's reach
- Risk: IAB may want to develop their own measurement component rather than adopt an external standard

**TollBit**
- 5,750+ publishers, Local Media Consortium integration
- Scraping data (volume, violation rates) is evidence SPUR can use in AI platform negotiations
- "Digital Trends received 4.1M bot scrapes in one week, referring 4,200 human visitors" - this is the kind of data point that makes the case
- Contact: Toshit Panigrahi, CEO

**Amazon (content marketplace)**
- Building content licensing infrastructure (details sparse)
- Rufus is the primary consumer - commerce context aligns with SPUR members who produce product-adjacent journalism
- SPUR should understand Amazon's approach before it solidifies

### Tier 3: Keep informed, engage when relevant

- **Cloudflare** - Already aligned. Content Signals + Pay Per Crawl are complementary infrastructure. No action needed.
- **Akamai** - Edge enforcement, KYA/KYAPay. Relevant when SPUR moves to Phase 4 (identity).
- **FetchRight / Peek-Then-Pay** - Supply-side protocol, early access. Complementary but no urgency.
- **Dappier** - Agentic ads model is interesting for SPUR revenue discussions but early stage.
- **Context4GPTs** - Two-sided marketplace, very early. Per-query framing is right but no traction.
- **Supertab** - RSL as a managed service (deployment, hosting, compliance monitoring). Relevant when members adopt RSL.
- **GEO platforms (Evertune, Profound, VantagePoint)** - Brand-side measurement. Not publisher-focused. Keep aware but not priority.

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

**The left column exists today.** RSL, Content Signals, and TDMRep are deployed or deploying.

**The middle column is emerging.** IAB CoMP, Microsoft PCM, and direct deals are creating transaction infrastructure.

**The right column is the gap.** No AI platform provides inference-time telemetry to publishers. OpenAttribution Telemetry is the only open standard designed for this. SPUR's leverage can create the demand-side adoption.

---

## What's changed since November 2025

| Development | Date | Significance |
|-------------|------|-------------|
| SPUR coalition launched | Feb 2026 | First coordinated publisher demand for standards. |
| Microsoft PCM launched | Feb 2026 | First major platform content marketplace. Sets the template others will follow. |
| ProRata raised $75M total | Sep 2025 + Feb 2026 | Best-capitalised attribution marketplace. 750+ publications. |
| Amazon content marketplace announced | Q1 2026 | Second major platform marketplace. Details sparse. |
| IAB CoMP working group formed | Aug 2025 | 80+ executives. No spec yet but governance credibility. |
| IAB "AI Accountability for Publishers Act" drafted | Feb 2026 | Federal legislation based on unjust enrichment theory. |
| RSL 1.0 reaches 1,500+ endorsements | Ongoing | Critical mass for sell-side adoption. |
| OpenAttribution Telemetry v0.4 + first live deployment | Feb 2026 | Spec, SDKs, reference server, and live deployment. |
| Bing AI Performance Report (public preview) | Feb 2026 | First AI platform to provide citation visibility data. Copilot ecosystem only, no clicks, sampled. Signals Microsoft is most willing to provide measurement. |
| Google confirms AI data rolled into GSC | Ongoing | AI Overview and AI Mode data mixed into standard GSC performance reports. No plan to separate. Actively obscuring AI-specific visibility. |
| EU AI Act full applicability approaching | Aug 2026 | Requires AI developers to check copyright reservations. Regulatory tailwind. |

---

## References

### Standards
- [RSL 1.0](https://rslstandard.org/rsl) - Really Simple Licensing (open standard)
- [RSL Collective](https://rslcollective.org/) - nonprofit collective licensing platform (ASCAP/BMI model for web content)
- [IAB CoMP](https://iabtechlab.com/content-monetization-protocols/) - Content Monetization Protocols
- [Cloudflare Content Signals](https://blog.cloudflare.com/content-signals-policy)
- [W3C TDMRep](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/)
- [C2PA](https://c2pa.org/) - Content Provenance and Authenticity
- [OpenAttribution Telemetry](https://github.com/openattribution-org/telemetry)
- [AIMS](https://github.com/openattribution-org/aims)
- [Peek-Then-Pay](https://peekthenpay.org/)

### Marketplaces and platforms
- [Microsoft PCM announcement](https://about.ads.microsoft.com/en/blog/post/february-2026/building-toward-a-sustainable-content-economy-for-the-agentic-web)
- [ProRata.ai](https://www.prorata.ai/)
- [Geodesix](https://geodesix.com/) (impact.com)
- [TollBit](https://tollbit.com/)
- [Cloudflare Pay Per Crawl](https://blog.cloudflare.com/content-signals-policy)
- [Dappier](https://dappier.com/)
- [Miso.ai](https://miso.ai/)
- [FetchRight](https://fetchright.ai/)
- [Supertab](https://www.supertab.co/) (RSL managed service)

### Coverage
- [Charlotte Tobitt, "UK news giants form 'NATO for news'"](https://pressgazette.co.uk/news/uk-news-giants-form-nato-for-news-group-to-defend-against-ai/) (Press Gazette, Feb 2026)
- [Jessica Davies, "The case for and against publisher content marketplaces"](https://digiday.com/media/the-case-for-and-against-publisher-content-marketplaces/) (Digiday, Feb 2026)
- [Nikhil Kolar, VP Microsoft AI, on PCM](https://digiday.com/media/qa-nikhil-kolar-vp-microsoft-ai-scales-its-click-to-sign-ai-content-marketplace/) (Digiday, Feb 2026)
- [IAB CoMP working group announcement](https://www.prnewswire.com/news-releases/iab-tech-lab-forms-ai-content-monetization-protocols-comp-working-group-to-set-ai-era-publisher-monetization-standards-302532738.html)

### Regulatory
- [EU AI Act](https://artificialintelligenceact.eu/) - Full applicability August 2026
- [CMA Google AI Overviews investigation](https://www.gov.uk/cma-cases/google-search-generative-experience)
- [IAB "AI Accountability for Publishers Act" draft](https://iabtechlab.com/) (February 2026)
