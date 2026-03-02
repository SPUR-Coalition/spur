# SPUR member baseline: PolicyCheck scan

**Date:** 2 March 2026
**Tool:** OpenAttribution PolicyCheck v0.4.0
**Raw data:** `policycheck-results.csv`

---

## Summary

PolicyCheck scanned all five SPUR founding members across robots.txt, RSL, Content Signals (Cloudflare), W3C TDMRep, and 26 known AI crawlers.

The headline: rights reservation (blocking) is widespread but inconsistent. Structured licensing signals barely exist. Measurement is absent entirely.

---

## AI bot access matrix

| Bot | Category | BBC | FT | Guardian | Sky News | Telegraph |
|-----|----------|-----|-----|----------|----------|-----------|
| **GPTBot** | Training | Blocked | Allowed | Allowed | Blocked | Blocked |
| **ClaudeBot** | Training | Blocked | Blocked | Blocked | Allowed | Blocked |
| **Google-Extended** | Training | Blocked | Blocked | Allowed | Allowed | Blocked |
| **Meta-ExternalAgent** | Training | Blocked | Blocked | Blocked | Allowed | Blocked |
| **CCBot** | Training | Blocked | Blocked | Blocked | Blocked | Blocked |
| **Bytespider** | Training | Blocked | Blocked | Blocked | Allowed | Blocked |
| **cohere-ai** | Training | Blocked | Blocked | Allowed | Allowed | Blocked |
| **OAI-SearchBot** | Search | Blocked | Allowed | Allowed | Allowed | Blocked |
| **PerplexityBot** | Search | Blocked | Blocked | Blocked | Allowed | Blocked |
| **DuckAssistBot** | Search | Allowed | Allowed | Blocked | Allowed | Blocked |
| **ChatGPT-User** | User-triggered | Blocked | Allowed | Allowed | Allowed | Blocked |
| **Perplexity-User** | User-triggered | Blocked | Blocked | Allowed | Allowed | Blocked |

---

## Blocking posture (summary)

| Publisher | Training bots blocked | Search bots blocked | User-triggered blocked | Posture |
|-----------|----------------------|--------------------|-----------------------|---------|
| **BBC** | 14/16 | 2/4 | 2/3 | Hard block (nearly everything) |
| **FT** | 11/16 | 1/4 | 1/3 | Selective (OpenAI deal visible) |
| **Guardian** | 8/16 | 2/4 | 0/3 | Moderate (OpenAI + Google allowed) |
| **Sky News** | 2/16 | 0/4 | 0/3 | Mostly open (only GPTBot + CCBot) |
| **Telegraph** | 16/16 | 3/4 | 3/3 | Total lockdown |

---

## Licensing and measurement signals

| Signal | BBC | FT | Guardian | Sky News | Telegraph |
|--------|-----|-----|----------|----------|-----------|
| **RSL licence** | None | None | Yes (1 group) | None | None |
| **Content Signals (search)** | Unspecified | Unspecified | Unspecified | Unspecified | Unspecified |
| **Content Signals (ai-input)** | Unspecified | Unspecified | Unspecified | Unspecified | Unspecified |
| **Content Signals (ai-train)** | Unspecified | Unspecified | Unspecified | Unspecified | Unspecified |
| **W3C TDMRep** | None | None | None | None | None |
| **Markdown agents** | No | No | No | No | No |
| **Crawl delay** | None | 1s | None | None | None |

---

## Key findings

### 1. No coordination on blocking

Every member has a different blocking strategy. BBC and Telegraph block nearly everything. Sky News blocks almost nothing. FT and Guardian have selective deals visible through their allow lists. Five publishers, five different approaches.

### 2. Deal structures visible through robots.txt

- **FT allows GPTBot + OAI-SearchBot + ChatGPT-User** - likely has an OpenAI licensing deal
- **Guardian allows GPTBot + Google-Extended + OAI-SearchBot** - likely has deals with both OpenAI and Google
- **Sky News allows almost everything except GPTBot** - either no deals or a deliberate "open except OpenAI training" stance
- These bilateral deals are being negotiated blind - no usage data, no measurement, no leverage

### 3. RSL adoption: 1 out of 5

Only the Guardian has published an RSL licence (group-scoped, at `https://theguardian.com/license.xml`). The other four have no machine-readable licensing signal at all. They're negotiating in legal meetings, not through structured data.

### 4. No measurement infrastructure exists

Zero Content Signals. Zero TDMRep policies. Zero Markdown agent support. Not a single SPUR member has any form of structured measurement for AI content usage. This validates the roadmap thesis: the measurement layer doesn't exist yet and needs to be built.

### 5. Telegraph is the most aggressive

57 user agents listed in robots.txt - by far the most comprehensive. Includes newer bots like DeepSeekBot, Grok, MistralAI-User, OAI-Operator, bedrockbot, and ChatGLM-Spider. Total lockdown posture across training, search, and user-triggered categories.

### 6. BBC blocks ProRataInc specifically

Notable that BBC explicitly blocks ProRataInc (ProRata.ai's crawler) - one of the competing approaches to content attribution. This is a signal that BBC is aware of and actively managing third-party attribution attempts.

---

## What this means for the roadmap

**Phase 1 is validated.** PolicyCheck can produce this baseline for any publisher. The immediate deliverable is a dashboard that tracks these signals over time - publishers can see when platforms change their crawling behaviour and whether their blocking is effective.

**The measurement gap is real.** All five members are using robots.txt (a 30-year-old standard designed for search engines) as their primary AI governance tool. None have adopted modern standards for structured licensing or usage measurement.

**Telemetry adoption is the unlock.** The path from "block everything and hope" to "measure, licence, and get paid" requires OA Telemetry in licensing agreements. This scan proves the starting position: all stick, no carrot, no data.

---

## Reproducing this scan

```bash
cd ~/projects/openattribution/policycheck
cargo build --release -p policycheck

# Single domain
./target/release/policycheck analyze --url https://www.bbc.co.uk

# All SPUR members (CSV)
./target/release/policycheck analyze --csv spur-domains.csv --format csv --output results.csv

# JSON output for programmatic use
./target/release/policycheck analyze --csv spur-domains.csv --format json
```
