# SPUR Presentation Brief (for Gamma)

Author: Alex Springer, SPUR Tech Lead / OpenAttribution Director
Audience: SPUR members (first review: David Buttle, Dominic Young)
Style reference: Introducing OpenAttribution deck (same colour palette, layout patterns)
Colour palette: Dark navy headings, red/coral accent (#D64200), pink callout boxes, white backgrounds

---

## Slide 1: Title

**Layout:** Split - text left, image right (abstract network/data visualisation, similar to OA deck cover)

**Section label:** SPUR COALITION

**Heading:**
Technical Roadmap & Landscape Review

**Subheading (red):**
Inference-Time Telemetry for Publishers

**Date:** March 2026

**Footer:**
Prepared by Alex Springer, SPUR Tech Lead
OpenAttribution.org

---

## Slide 2: The problem

**Layout:** Split - image left (magnifying glass over data/charts, similar to OA "closing the visibility gap" slide), text right

**Heading:**
Publishers license content to AI platforms but have no visibility into how it's used

**Body:**
Even where deals exist - Guardian with Google, FT with OpenAI - publishers receive payment but zero data on actual usage. How often was content retrieved? How often was it cited? Was it represented accurately?

**Callout box (pink):**
This is the principle that was never conceded for search. Google defended it with billions. If AI platforms concede the right to telemetry - even at the most basic level - publishers have the upper hand when negotiating further granularity.

---

## Slide 3: The landscape at a glance

**Layout:** Full width, three numbered cards with red accent bars (like the OA "Chips, Energy, and Content" slide)

**Section label:** LANDSCAPE

**Heading:**
Three layers, one critical gap

**Body:**
A growing ecosystem of standards and platforms addresses different parts of the content value chain. Two layers are maturing. One barely exists.

**Card 1:** Rights Reservation
Publishers can now declare what's permitted. Cloudflare Content Signals (~20% of the web), RSL (1,500+ orgs), TDMRep (EU compliance), IETF AI Preferences working group forming.

**Card 2:** Licensing & Transactions
Money can flow. RSL defines machine-readable terms and payment models. IAB CoMP working group (80+ executives) is developing transaction protocols. Microsoft PCM launched February 2026.

**Card 3:** Measurement & Telemetry
The gap. Microsoft's Bing AI Performance Report (Feb 2026) is the first platform-provided citation data - but it's limited to citation counts in the Copilot ecosystem, with no clicks and no programmatic access. Google actively hides AI-specific data in standard Search Console. Every other platform provides nothing. Publishers cannot independently verify compliance. Without measurement, there is no basis for fair pricing.

---

## Slide 4: Rights reservation - detail

**Layout:** Full width, table or numbered list

**Section label:** RIGHTS RESERVATION

**Heading:**
Publishers can declare permissions. AI platforms may or may not respect them.

**Table:**

| Standard | Owner | Status |
|----------|-------|--------|
| Cloudflare Content Signals | Cloudflare | Most adopted. Per-path, per-bot targeting. ~20% of web. |
| W3C TDMRep | W3C Community Group | Final spec (Feb 2024). EU Copyright Directive compliance. Binary. |
| IETF AI Preferences | IETF | Working group formed. No draft yet. Best governance path. |
| RSL Crawler Auth Protocol | RSL Collective | Live. Layered on top of RSL licence terms. |
| robots.txt extensions | Various | Fragmented. Google-Extended blocks training but NOT AI Overviews. |

**Callout box (pink):**
Rights reservation tells AI platforms what's allowed. It does not tell publishers what actually happened. A publisher can block training via Content Signals, but has no way to know if the signal was respected.

---

## Slide 5: Licensing and transactions - detail

**Layout:** Full width, numbered vertical list (like OA "Nascent Solutions" slide)

**Section label:** LICENSING

**Heading:**
Machine-readable licensing is emerging, but adoption is the bottleneck

**Item 1:** RSL 1.0 (Really Simple Licensing)
1,500+ organisations endorse. XML-based machine-readable terms. 8 payment types. Crawler Authorization Protocol + Open License Protocol. Infrastructure support from Cloudflare, Akamai, Fastly. Supertab providing payment rails (beta).

**Item 2:** IAB CoMP
Working group formed August 2025. 80+ executives including Dotdash Meredith, Bertelsmann, Cloudflare, Meta, Google. Three pillars: bot blocking, content discovery, monetisation APIs. No published specification yet. Also drafted "AI Accountability for Publishers Act" (Feb 2026).

**Item 3:** Peek-Then-Pay
Five-step flow from discovery to payment. Publishers serve pre-chunked content. MCP-native. Early access, no public adoption numbers.

---

## Slide 6: Content marketplaces

**Layout:** Split - image left (futuristic city/commerce imagery), numbered list right

**Section label:** MARKETPLACES

**Heading:**
Structured exchanges are being built. Demand is the question.

**Item 1:** Microsoft PCM (Feb 2026)
Click-to-sign model. Co-designed with AP, Conde Nast, Hearst, USA TODAY, Vox Media. Supports bring-your-own-licence. Copilot is primary consumer. Most aligned with SPUR's interests.

**Item 2:** ProRata.ai ($75M raised)
50/50 revenue share with 750+ publications. Gist Answers consumer chatbot. IAB CoMP participant.

**Item 3:** TollBit
5,750+ publishers via Freestar integration. Local Media Consortium (5,000 local news members). Data: Digital Trends received 4.1M bot scrapes in one week, referring only 4,200 human visitors.

**Item 4:** Cloudflare Pay Per Crawl
Publishers set per-request price. HTTP 402 responses. Zero-code adoption. Widest potential reach.

**Item 5:** Amazon
Building parallel marketplace. Details sparse. Rufus is likely primary consumer.

**Callout box (pink):**
"The black market is the marketplace. As long as scraping is cheap, easy, and largely consequence-free, a formal content marketplace is competing against a de facto free alternative." - Alan Chapell, SPUR launch

---

## Slide 7: The universal gap

**Layout:** Full width table

**Section label:** AI PLATFORM ENGAGEMENT

**Heading:**
One platform has started sharing. The rest provide nothing.

**Table:**

| Platform | Guardian | FT | BBC | Telegraph | Sky News | Telemetry |
|----------|----------|-----|-----|-----------|----------|-----------|
| Google | Licensed | Licensed | No deal | No deal | Unclear | None (AI data hidden in GSC) |
| OpenAI | Licensed | Licensed | No deal | No deal | Unclear | None |
| Microsoft | PCM (likely) | TBC | TBC | TBC | TBC | Limited (Bing AI Performance Report) |
| Anthropic | No deal | No deal | No deal | No deal | No deal | None |
| Perplexity | No deal | No deal | No deal | No deal | No deal | None |

**Body:**
Microsoft launched the Bing AI Performance Report (Feb 2026) - the first platform to provide any citation data. But it's limited: citation counts only, no clicks, Copilot ecosystem only, sampled, dashboard with CSV export. Publishers see what Microsoft chooses to show. Google actively hides AI-specific data by rolling it into standard Search Console metrics with no way to separate.

**Callout box (pink):**
Microsoft's report is a significant signal - they're willing to provide measurement data. That makes them the natural first target for SPUR's telemetry requirement. The gap between what Bing provides (platform-controlled citation counts) and what OA Telemetry provides (publisher-controlled per-event data across all platforms) is the upgrade path.

---

## Slide 8: Your domains today (PolicyCheck baseline)

**Layout:** Full width table with colour-coded cells

**Section label:** BASELINE

**Heading:**
PolicyCheck scan: SPUR members, 2 March 2026

**Body:**
We ran OpenAttribution's PolicyCheck compliance scanner against all five founding member domains. This is your current posture.

**Table 1: AI bot access**

| Bot | BBC | FT | Guardian | Sky News | Telegraph |
|-----|-----|-----|----------|----------|-----------|
| GPTBot (OpenAI) | Blocked | Allowed | Allowed | Blocked | Blocked |
| ClaudeBot (Anthropic) | Blocked | Blocked | Blocked | Allowed | Blocked |
| Google-Extended | Blocked | Blocked | Allowed | Allowed | Blocked |
| OAI-SearchBot | Blocked | Allowed | Allowed | Allowed | Blocked |
| PerplexityBot | Blocked | Blocked | Blocked | Allowed | Blocked |
| ChatGPT-User | Blocked | Allowed | Allowed | Allowed | Blocked |

**Table 2: Licensing signals**

| Signal | BBC | FT | Guardian | Sky News | Telegraph |
|--------|-----|-----|----------|----------|-----------|
| RSL licence | No | No | Yes | No | No |
| Content Signals | No | No | No | No | No |
| W3C TDMRep | No | No | No | No | No |

**Callout box (pink):**
Five publishers, five different strategies. Bilateral deals are visible through the allow lists (FT allows GPTBot, Guardian allows GPTBot + Google-Extended). Zero adoption of modern licensing signals. The Telegraph blocks 57 AI user agents - the most comprehensive in the group. Everyone blocks CCBot.

---

## Slide 9: Two events, one standard

**Layout:** Two cards side by side with red top borders (reuse exact pattern from OA deck "Two Events, One Standard" slide)

**Heading:**
Two events, one standard

**Body:**
The full lifecycle of content within AI systems requires tracking two distinct event types.

**Left card: content_retrieved**
When: AI system pulls content into context (e.g., for RAG, summarisation, or synthesis).
Fields: Content URL, Timestamp, Platform ID.
What it tells you: How often your content is being used behind the scenes - even when users never explicitly see it.

**Right card: content_cited**
When: AI system surfaces content to a user (e.g., as a direct quote, paraphrase, or reference).
Fields: Content URL, Timestamp, Citation type (direct quote, paraphrase, reference), Prominence score.
What it tells you: How often your content reaches end users and in what form - demonstrating its direct influence.

**Callout box (pink):**
Privacy level: minimal. Publishers see content URLs and timestamps only. No query text, no user data, no conversation content. Enough to measure usage without requiring AI platforms to share anything sensitive.

---

## Slide 10: SPUR's leverage

**Layout:** Full width, 2x2 grid of numbered items (like OA "Economic Viability" slide)

**Heading:**
Why collective action changes the equation

**Body:**
No individual publisher can force AI platform compliance. SPUR's founding members collectively represent enough leverage to make telemetry a licensing condition.

**Item 1 (red heading):** No telemetry, no licence
SPUR members include telemetry requirements in licensing agreements. AI platforms that want access to BBC, FT, Guardian, Sky, and Telegraph content must emit usage data.

**Item 2 (red heading):** One integration, many publishers
A standardised telemetry spec means AI platforms implement once and cover all SPUR members - and any future adopters. Lower friction than bespoke deals.

**Item 3 (red heading):** Data creates leverage
"Your platform retrieved our content 2.3M times last month and cited it 400K times." This is the basis for fair compensation negotiations. Without it, publishers negotiate blind.

**Item 4 (red heading):** Regulatory tailwind
EU AI Act (full applicability August 2026) requires AI developers to check copyright reservations. CMA investigating Google AI Overviews. IAB drafting "AI Accountability for Publishers Act." The direction is towards transparency.

---

## Slide 11: Phase 1 - Foundation

**Layout:** Full width, three items with numbered circles

**Section label:** ROADMAP

**Heading:**
Phase 1: Foundation

**Subheading:**
SPUR members can audit their current posture and agree on what to require.

**Item 1:** Member compliance audit (DONE)
PolicyCheck scan completed 2 March 2026. Results on the previous slide. Five different blocking strategies, one RSL licence (Guardian), zero Content Signals or TDMRep adoption.

**Item 2:** SPUR Telemetry Profile v0.1
Formalise the two core event types into a SPUR-specific profile. Precise enough for OpenAI/Anthropic/Google to implement against. Privacy recommendation: minimal (URLs + timestamps only).

**Item 3:** Licensing clause template
Draft contractual language: "Licensee shall emit OpenAttribution Telemetry events conforming to the SPUR Telemetry Profile for all content retrieved or cited. Events shall be transmitted to a telemetry endpoint designated by Licensor within 24 hours." Something concrete for members to put in front of AI platform legal teams.

---

## Slide 12: Phase 2 - Infrastructure

**Layout:** Split - architecture diagram or image left, text right

**Heading:**
Phase 2: Infrastructure

**Subheading:**
A working telemetry endpoint any SPUR member can point their licensing agreements at.

**Item 1:** SPUR telemetry endpoint
Shared processing endpoint hosted under OpenAttribution. Each AI platform gets an API key. Each publisher gets read access to events involving their content (matched by URL domain). Multi-tenant - no publisher sees another's data.

**Item 2:** Guardian integration
Guardian's structured API as the first concrete proof point. One publisher, one AI platform, real telemetry flowing end-to-end.

**Item 3:** API key authentication
Simple, proven, works today. SPUR issues keys to AI platforms. Every event tied to a known platform. AIMS-based cryptographic identity comes later (Phase 4).

**Architecture text (or simple diagram):**
AI Platform (OpenAI, Anthropic, Google...)
  -> POST /events (content_retrieved, content_cited)
  -> SPUR Telemetry Endpoint
  -> BBC | FT | Guardian | Sky | Telegraph | ...

---

## Slide 13: Phase 3 - Adoption

**Layout:** Full width, two sections side by side

**Heading:**
Phase 3: Adoption

**Subheading:**
Multiple publishers receiving telemetry. At least one AI platform emitting it.

**Left section: Member onboarding**
- Domain registration (bbc.co.uk, theguardian.com, ft.com, etc.)
- Dashboard access for each member
- Licensing clause adoption in next AI platform negotiation

**Right section: AI platform engagement**
Target platforms (in order of likely engagement):
1. Microsoft/Bing - Building content marketplace, most aligned
2. Anthropic - Positioning as responsible AI, telemetry fits brand
3. Perplexity - Facing publisher backlash, compliance is damage control
4. OpenAI - Largest user, least likely to voluntarily comply
5. Google - Under CMA scrutiny, regulatory pressure may help

**Callout box (pink):**
RSL integration amplifies the effect. RSL declares what's permitted, telemetry measures what actually happened. Mismatch = licence violation, with evidence. 1,500+ organisations already endorse RSL.

---

## Slide 14: Phase 4 - Scale

**Layout:** Full width, numbered list (like OA "Nascent Solutions" style)

**Heading:**
Phase 4: Scale

**Subheading:**
SPUR telemetry becomes an industry expectation, not just a coalition requirement.

**Item 1:** Expanded event types
content_displayed (distinguish retrieval from display), content_engaged (user interaction), commerce events. Already specified in OpenAttribution Telemetry v0.4. Adding them is a configuration change.

**Item 2:** AIMS agent identity
Move from API keys to cryptographic verification. AI platforms publish manifests at /.well-known/aims/. Agent-to-agent trust chains for multi-hop pipelines.

**Item 3:** Attribution computation
Which content is retrieved most? Cited most? What's the retrieval-to-citation ratio? Cross-publisher comparison (anonymised). Data for licensing negotiations.

**Item 4:** International expansion
Telemetry spec is language/region agnostic. EU AI Act creates regulatory tailwind. Target markets: US (NYT, WaPo), EU (GDPR + AI Act), Australia (News Corp).

---

## Slide 15: Timeline

**Layout:** Horizontal timeline with 4 phases (reuse exact pattern from OA "Timeline: The Road Ahead" slide)

**Heading:**
Timeline: the road ahead

**Phase 1 - Foundation:**
Member audit complete. SPUR Telemetry Profile v0.1 published. Licensing clause template drafted.

**Phase 2 - Infrastructure:**
SPUR telemetry endpoint live. Guardian integration demo working. API key auth operational.

**Phase 3 - Adoption:**
All five members onboarded. At least one AI platform emitting telemetry. RSL integration guide published.

**Phase 4 - Scale:**
Expanded event types. AIMS identity piloted. Attribution computation. International outreach.

**Callout box (pink):**
The standards defined in 2026 will shape the content economy for the next decade. Early participants have the greatest influence on the frameworks that govern AI content measurement.

---

## Slide 16: Outreach priorities

**Layout:** Full width, tiered list

**Section label:** NEXT STEPS

**Heading:**
Who SPUR needs to talk to

**Tier 1: This week**
- Microsoft (Nikhil Kolar, VP AI) - PCM is the most aligned marketplace. If telemetry becomes a PCM condition, that's the forcing function.
- Miso.ai (Lucky Gunasekara, CEO) - Overlapping publisher base (BBC, Guardian). Project Sentinel monitors 8,300+ sites. Natural candidate to adopt open standards.
- ProRata.ai (Bill Gross / Michele Tobin) - 750+ publications, overlapping members. IAB CoMP participant. $75M raised.
- Madhav Chinnappa - Publicly endorsed SPUR at launch. Former Google News Partnerships. Bridge to Google's thinking.

**Tier 2: Within two weeks**
- IAB Tech Lab (CoMP working group) - Telemetry is the measurement layer that complements CoMP's transaction protocols.
- TollBit (Toshit Panigrahi, CEO) - 5,750+ publishers. Scraping volume data is evidence for negotiations.
- Amazon - Building content marketplace. Understand their approach before it solidifies.

---

## Slide 17: What's ready today

**Layout:** Split - text left, image right (sunrise/horizon image like OA closing slide)

**Section label:** RESOURCES

**Heading:**
The building blocks exist

**Items (with status indicators):**

Done:
- OpenAttribution Telemetry spec v0.4 (Apache 2.0)
- Python SDK (PyPI) + TypeScript SDK (npm)
- Reference server implementation
- First live deployment (February 2026)
- PolicyCheck compliance scanner (crates.io, API, web UI)

Draft:
- AIMS agent identity spec v0.1

To build:
- SPUR telemetry endpoint (deploy reference server)
- Publisher dashboard
- Licensing clause template (legal working group)

**Callout box (pink):**
The technology is not the bottleneck. The telemetry spec is published, the SDKs are shipped, the reference server exists. What's needed is collective publisher demand that makes AI platform adoption non-optional.

---

## Slide 18: Standards integration map

**Layout:** Full width, three-column visual (like OA deck standards flow)

**Heading:**
How it all fits together

**Column 1: Publisher declares terms**
- RSL: "ai-input permitted, payment: subscription, attribution required"
- Content Signals: "search=yes, ai-input=yes, ai-train=no"
- TDMRep: "tdm-reservation: 1"

**Column 2: AI platform accesses content**
- Checks robots.txt + RSL + Content Signals
- Negotiates licence via RSL OLP, marketplace, or direct agreement
- Accesses content within licence scope

**Column 3: SPUR measures usage**
- OpenAttribution Telemetry: emits content_retrieved, content_cited
- SPUR endpoint validates events against RSL terms
- Dashboard shows each publisher their usage data

**Body:**
The left column exists today. The middle column is emerging. The right column is the gap SPUR fills.

---

## Slide 19: Close

**Layout:** Clean, minimal (like OA "Thank You" slide)

**Heading:**
Measurement is the missing layer

**Body:**
Rights reservation and licensing infrastructure are maturing. What publishers lack is independent verification of what happens to their content inside AI systems.

SPUR's collective leverage can create the demand-side adoption that no individual publisher can achieve alone.

**Footer:**
Alex Springer
SPUR Tech Lead / OpenAttribution Director
alex@openattribution.org

---

## Design notes for Gamma

- Use the same colour palette as the OA deck: dark navy (#1B1B3A or similar) for headings, red (#D64200) for accent text and card borders, pink (#FDE8E8 or similar) for callout boxes
- Callout boxes should have a small icon (speech bubble or similar) on the left
- Numbered items use circled numbers in red/coral
- Imagery: abstract data visualisation, network graphs, magnifying glass over data. Avoid stock photos of people.
- Tables should be clean with subtle row alternation
- Section labels are small caps in a pill/badge shape
- Keep text density low - the docs have all the detail, the deck tells the story
