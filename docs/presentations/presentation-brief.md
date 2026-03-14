# SPUR Presentation Brief

Author: Alex Springer
Role: Tech Lead (OpenAttribution Director)
Audience: SPUR founding members - BBC, FT, Guardian, Sky News, Telegraph
Context: First technical presentation. They know OA, they know David brought me in. I need to show I know the landscape cold and have a clear build plan.
Tool: Gamma (or similar). Low text density. The docs have the detail - the deck tells the story.

---

## Structure

Three acts:

1. Landscape (where is the industry?) - slides 2-8
2. Baseline (where are SPUR members?) - slides 9-10
3. Roadmap (what do we build?) - slides 11-15

---

## Slide 1: Title

The AI content landscape and a technical roadmap for SPUR

Alex Springer, SPUR Tech Lead
March 2026

---

## Slide 2: Six areas of activity

The industry is coalescing around six areas. Some are maturing. Some barely exist.

Blocking - Licensing - Access - Telemetry - Attribution - Compensation

One visual. Six labels. That's it. The next six slides unpack each.

---

## Slide 3: Blocking

How publishers say no.

robots.txt (30 years old, still the main tool), Cloudflare Content Signals (~20% of web), W3C TDMRep (EU), IETF AI Preferences (working group formed, no draft). Google-Extended blocks training but not AI Overviews.

Key point: most adopted area, but fragmented. Five SPUR members, five different blocking strategies.

---

## Slide 4: Licensing

How publishers say yes (with terms).

RSL 1.0 - 1,500+ endorsements. Machine-readable terms, 8 payment types, infrastructure support from Cloudflare/Akamai/Fastly.
IAB CoMP - 80+ executives, three pillars (blocking, discovery, monetisation). No spec yet.
Peek-Then-Pay - MCP-native, publisher-side content delivery. Early.

Key point: RSL is furthest along. Only Guardian has adopted it.

---

## Slide 5: Access

How content actually flows to AI systems.

Microsoft PCM (Feb 2026) - click-to-sign, co-designed with AP/Conde Nast/Hearst/Vox. Copilot is buyer.
ProRata - 50/50 revenue share, 750+ publications, $75M raised.
TollBit - 5,750+ publishers via Freestar. Local Media Consortium.
Cloudflare Pay Per Crawl - HTTP 402, publisher sets price, zero-code.
Amazon - building something. Details sparse.

Key point: marketplaces handle transactions. They don't tell publishers what happened after.

---

## Slide 6: Telemetry

How publishers know what happened.

Microsoft Bing AI Performance Report (Feb 2026) - first platform to provide citation data. Citation counts only, Copilot only, no clicks, sampled, CSV export. Google actively hides AI data in Search Console.

Every other platform provides nothing.

Key point: Microsoft's willingness is a signal. The gap between what they offer (platform-controlled dashboard) and what's needed (publisher-controlled per-event data) is the build.

---

## Slide 7: Attribution

How content contribution is measured.

Miso.ai - monitors 8,300+ sites, per-answer attribution, pays royalties. BBC and Guardian are customers.
ProRata - proportional attribution scoring, 750+ publications.
GEO platforms (Evertune, Profound, VantagePoint) - brand-side, not publisher-side.

Key point: proprietary systems measuring within their own walls. No open cross-platform standard.

---

## Slide 8: Compensation

How money flows back.

Pay-per-crawl (Cloudflare, TollBit, IAB CoMP CPCr) - price per request. Handles scraping, not inference.
Pay-per-use royalties (RSL Collective) - nonprofit collective licensing platform built on the RSL standard. ASCAP/BMI model for web content. Publishers join free, collective negotiates with AI companies, royalties paid per AI output.
Pay-per-inference - price per retrieval or citation at generation time. The model publishers actually want. Requires telemetry to exist first.
Revenue share (ProRata 50/50, marketplace commission models).
Direct licensing (bilateral deals - Guardian/Google, FT/OpenAI).

Key point: compensation models exist. The data to make them fair doesn't. You can't price what you can't see.

---

## Slide 9: Where SPUR members stand today

PolicyCheck scan, 2 March 2026.

Table 1 - bot access matrix (GPTBot, ClaudeBot, Google-Extended, OAI-SearchBot, PerplexityBot, ChatGPT-User across all five members).

Table 2 - licensing signals (RSL, Content Signals, TDMRep). Guardian is the only one with RSL. Zero Content Signals or TDMRep across the board.

Let the tables speak. No editorialising.

---

## Slide 10: The deal landscape

Table - which SPUR members have deals with which platforms, and what telemetry each platform provides.

Google: Guardian + FT licensed. Telemetry: none (AI data hidden in GSC).
OpenAI: Guardian + FT licensed. Telemetry: none.
Microsoft: PCM participation TBC. Telemetry: limited (Bing report).
Anthropic: no deals. Telemetry: none.
Perplexity: no deals. Telemetry: none.

---

## Slide 11: What SPUR's technical stack looks like

Simple architecture diagram.

AI Platform -> POST /events -> SPUR Telemetry Endpoint -> each publisher sees their own data

Two event types:
content_retrieved - AI pulled content into context. Fields: URL, timestamp.
content_cited - AI showed content to a user. Fields: URL, timestamp, citation type.

Privacy: minimal. URLs and timestamps only. No queries, no user data, no conversation content.

---

## Slide 12: Roadmap - four phases

Visual timeline. One line per phase, keep it tight.

Phase 1 - Platform: SPUR members sign up, claim their web properties. Telemetry endpoint, API keys, domain verification. Nearly built.
Phase 2 - Agent adoption: demand-side first. Get AI agents emitting telemetry. Proof of concept with one agent, one publisher.
Phase 3 - Marketplace adoption: telemetry as a condition in marketplace deals (PCM, ProRata, RSL Collective). Multiple publishers receiving data.
Phase 4 - AI platforms at scale: dashboards, analytics, expanded event types, AIMS identity. The big platforms adopt because the ecosystem already runs on it.

---

## Slide 13: What's built and what's not

Done: OA Telemetry spec v0.4, Python + TypeScript SDKs, reference server, PolicyCheck scanner, first live deployment (Feb 2026), telemetry server (Rust, deployed on Fly.io)
Draft: AIMS agent identity spec v0.1
To build: publisher dashboard, licensing clause template

---

## Slide 14: Who to talk to next

Tier 1: Microsoft (PCM alignment), Miso.ai (overlapping publisher base, scraping data), ProRata (750+ publications, IAB participant), Madhav Chinnappa (Google bridge)
Tier 2: IAB Tech Lab CoMP, TollBit (scraping volume evidence), Amazon (understand their approach early)

---

## Slide 15: Close

Contact details. No tagline. No grand statement.

Alex Springer
alex@openattribution.org
openattribution.org

---

## Design notes

Same palette as OA deck: dark navy headings, red/coral (#D64200) accent, white backgrounds.
No pink callout boxes. No "key takeaway" boxes. Let the data do the work.
Tables clean with subtle row alternation.
Imagery: abstract data visualisation, network topology. No stock photos.
Low text density throughout - if a slide has more than 30 words of body text, cut it.
