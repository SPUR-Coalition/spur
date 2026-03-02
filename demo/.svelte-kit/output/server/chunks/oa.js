import { randomUUID } from "crypto";
const GUARDIAN_API_KEY = "1dae97c4-2179-45f4-b824-75d2cc3d3526";
const MISTRAL_API_KEY = "";
const OA_SERVER_URL = "https://oa-telemetry-server.fly.dev";
const OA_PLATFORM_KEY = "oat_pk_aa4fabc08dfa4c7bd5078f1a7e045d0d49fe3bafa8dfa261";
const OA_PUBLISHER_KEY = "oat_pub_78da32e588bcbcf02556c903bcf3ecf82219861feb614928";
async function oaFetch(path, opts = {}) {
  const key = opts.usePublisherKey ? OA_PUBLISHER_KEY : OA_PLATFORM_KEY;
  const { usePublisherKey: _, ...fetchOpts } = opts;
  const res = await fetch(`${OA_SERVER_URL}${path}`, {
    ...fetchOpts,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": key,
      ...opts.headers
    }
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OA server error ${res.status}: ${body}`);
  }
  return res.json();
}
async function startSession() {
  return oaFetch("/session/start", {
    method: "POST",
    body: JSON.stringify({
      initiator_type: "user",
      platform_id: "spur-demo",
      client_type: "web"
    })
  });
}
async function emitEvents(sessionId, eventType, contentUrls) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return oaFetch("/events", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      events: contentUrls.map((url) => ({
        id: randomUUID(),
        type: eventType,
        timestamp: now,
        content_url: url,
        data: eventType === "content_cited" ? { citation_type: "reference" } : {}
      }))
    })
  });
}
async function getPublisherSummary(since) {
  const params = "";
  return oaFetch(`/publisher/summary${params}`, { method: "GET", usePublisherKey: true });
}
async function getPublisherEvents(limit = 20) {
  return oaFetch(`/publisher/events?limit=${limit}&offset=0`, {
    method: "GET",
    usePublisherKey: true
  });
}
async function getPublisherUrls(limit = 10) {
  return oaFetch(`/publisher/urls?limit=${limit}&offset=0`, {
    method: "GET",
    usePublisherKey: true
  });
}
export {
  GUARDIAN_API_KEY as G,
  MISTRAL_API_KEY as M,
  getPublisherEvents as a,
  getPublisherSummary as b,
  emitEvents as e,
  getPublisherUrls as g,
  startSession as s
};
