# OpenAttribution ≠ NarrativAI ≠ SPUR

**This is not a fuzzy line. It's a firewall.**

## The Three Entities

| Entity | What it is | Alex's role | Output |
|--------|-----------|-------------|--------|
| **SPUR** | Publisher coalition | Tech lead (via OA hat) | Requirements, adoption, collective leverage |
| **OpenAttribution** | Standards body | Director | Open specs, SDKs, reference implementations |
| **NarrativAI** | Commercial platform | CEO/CTO | Commercial infrastructure on top of standards |

## In This Repo

Everything in this repo is **SPUR coalition work, delivered through the OpenAttribution hat**. It must be:

- Neutral to any commercial implementer
- Usable by NarrativAI competitors
- Open source (Apache 2.0 / MIT)
- Free of NarrativAI product positioning

## The Test

Before writing anything, ask:

1. Would a NarrativAI competitor be comfortable with this?
2. Does this advance the industry or advance one vendor?
3. If someone else built a commercial platform on this, would that be a success?

If the answer to #3 is "yes", it's correctly scoped.

## Good Examples

> "The SPUR telemetry endpoint processes content_retrieved and content_cited events from any AI platform."

> "PolicyCheck scanned all five founding members. Here's the compliance baseline."

> "The OpenAttribution Telemetry spec defines four privacy levels. We recommend 'minimal' for Phase 1."

## Bad Examples

> "NarrativAI's processing server is the recommended implementation."

> "Publishers should use NarrativAI's dashboard to view their telemetry data."

> "As creators of the standard, we know the best way to implement it."

## Practical Boundaries

**SPUR work (this repo) includes:**
- Telemetry endpoint built on OpenAttribution reference server
- PolicyCheck scans and compliance baselines for members
- Technical roadmaps and specs for the coalition
- Integration guides for AI platforms
- Presentation materials for David and Dominic

**SPUR work does NOT include:**
- NarrativAI commercial features or pricing
- Positioning NarrativAI as the preferred implementer
- Proprietary extensions to the standards
- Anything that only works if you use NarrativAI

## The W3C Pattern

OpenAttribution writes the spec. NarrativAI builds one of the first browsers. SPUR represents the users who need the web to work. The spec's credibility doesn't depend on any single browser's success.
