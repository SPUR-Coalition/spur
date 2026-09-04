# Demo runbook

How to stand up and drive the SPUR telemetry demo against a local OpenAttribution
server. This is the script for live walkthroughs (e.g. the Arc XP / Washington Post
deep-dive).

## Stack

> **Wire version.** The demo emits Content Telemetry **v1.0** (SDK
> `@openattribution/telemetry` 1.0.x): `schema_version: "1.0"`,
> `content_presented` events, and presentation-bound engagements. The
> server it points at must accept v1.0 documents — a v0.1-only server
> rejects every write (and the SDK fails silently, so the chat keeps
> working while the dashboard stays empty).

Three processes: Postgres, an OpenAttribution server (`oa-server`, port 8080), and
this SvelteKit app (port 5173). The demo talks to the server only through the
env-configured `OA_TELEMETRY_URL` (writes) and `OA_API_URL` (reads).

## 1. Server

In your OA server checkout, with local Postgres running:

```sh
createdb oa_demo_local
# .env points DATABASE_URL at postgresql://<you>@localhost/oa_demo_local,
# DEV_MODE=true, PORT=8080. Migrations apply at boot.
cargo run -p oa-server
```

## 2. Keys

The demo needs three API keys, one per organisation:

| Env var | Org | Key type | Scope |
|---|---|---|---|
| `OA_PLATFORM_KEY` | spur-chat-agent | `oat_pk_` write key | `telemetry:write` |
| `OA_PUBLISHER_KEY_GUARDIAN` | guardian | `oat_pub_` read key | `telemetry:read` |
| `OA_PUBLISHER_KEY_TELEGRAPH` | telegraph | `oat_pub_` read key | `telemetry:read` |

Locally, mint all three with the server's `scripts/provision-local-demo.sh`
(it also marks the two publisher domains verified in the local database and
prints ready-to-paste env lines — keys are shown once, never stored). Re-run it
any time to rotate; restart `oa-server` afterwards so the domain index refreshes.

Against a shared server there is no script: each publisher org's own members mint
keys via `POST /api/v1/identity/api-keys`, and reads return data only for domains
the publisher has verified via DNS TXT / well-known proof.

## 3. Demo app

```sh
cd demo && cp .env.example .env   # fill in keys from step 2 + content API keys
npm install && npm run dev        # http://localhost:5173
```

Smoke-check before an audience: `curl -s $OA_API_URL/content-owners/summary
-H "X-API-Key: $OA_PUBLISHER_KEY_GUARDIAN"` returns JSON with `"domains":
["theguardian.com"]`, and the dashboard pane shows zeros (not an error banner).

## 4. The walkthrough

1. **Ask a question** — e.g. *"What's the latest on AI regulation?"* The left
   pane (Agent chat) searches Guardian + Telegraph, grounds a Mistral answer in
   the articles, and cites inline with [n] markers.
2. **Watch the middle pane (Telemetry events)** as the answer streams:
   `content_retrieved` fires per article fetched, `content_grounded` as articles
   enter the model context, `content_cited` when the answer's citations are
   parsed out. Each card shows the event type, publisher, and URLs — this is the
   Content Telemetry wire format leaving the agent in real time.
3. **Open the right pane (Publisher dashboard)** — this is The Guardian's view,
   read back from the OA server with the Guardian's own key: totals, funnel
   breakdown by event type, which agents touched their content, top URLs, recent
   events. Switch to the **Telegraph tab**: same session, but only Telegraph's
   share of it — per-publisher keys cannot see each other's telemetry.
4. **Click a citation** in the chat answer: a `content_engaged` event lands and
   the dashboard picks it up on next refresh — retrieval to engagement, closed.
5. **Ask a follow-up** question: previously retrieved articles re-ground
   (`cached: true`), showing turn-level grounding without re-retrieval.

What each pane proves: the chat is an ordinary grounded agent with the telemetry
SDK dropped in (writes, one key); the middle pane is the event stream as emitted;
the dashboard is the publisher's independent, authenticated read of the same
events (reads, per-publisher keys, domain-scoped).

If the dashboard errors, it says why (e.g. `Publisher feed failed (OA server
returned 401)…` for a stale key) — re-run the provisioning script and update
`.env`. A healthy-but-empty dashboard means the write key is stale: the chat
degrades gracefully when telemetry writes fail, so check the dev-server console
for SDK errors.
