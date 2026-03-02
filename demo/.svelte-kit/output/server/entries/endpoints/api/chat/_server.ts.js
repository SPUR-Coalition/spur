import { G as GUARDIAN_API_KEY, M as MISTRAL_API_KEY, s as startSession, e as emitEvents } from "../../../../chunks/oa.js";
const BASE_URL = "https://content.guardianapis.com";
async function searchGuardian(query, pageSize = 5) {
  const params = new URLSearchParams({
    q: query,
    "show-fields": "headline,byline,body,standfirst,wordcount",
    "page-size": String(pageSize),
    "order-by": "relevance",
    "api-key": GUARDIAN_API_KEY
  });
  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error(`Guardian API error: ${res.status}`);
  const data = await res.json();
  return data.response.results ?? [];
}
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}
function truncateBody(body, maxChars = 2e3) {
  const clean = stripHtml(body);
  if (clean.length <= maxChars) return clean;
  const truncated = clean.slice(0, maxChars);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
async function* streamMistralChat(messages) {
  const res = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages,
      stream: true,
      max_tokens: 2048
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mistral API error ${res.status}: ${body}`);
  }
  if (!res.body) throw new Error("No response body from Mistral");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
      }
    }
  }
}
function parseCitationMarkers(text) {
  const matches = text.matchAll(/\[(\d+)\]/g);
  const indices = /* @__PURE__ */ new Set();
  for (const m of matches) {
    const idx = parseInt(m[1], 10) - 1;
    if (idx >= 0) indices.add(idx);
  }
  return [...indices].sort((a, b) => a - b);
}
const POST = async ({ request }) => {
  const { message, history = [], sessionId } = await request.json();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event, data) => {
        controller.enqueue(encoder.encode(`event: ${event}
data: ${JSON.stringify(data)}

`));
      };
      try {
        const articles = await searchGuardian(message);
        send("sources", {
          articles: articles.map((a) => ({
            url: a.webUrl,
            headline: a.fields?.headline ?? a.webTitle,
            byline: a.fields?.byline ?? null,
            section: a.sectionName,
            date: a.webPublicationDate
          }))
        });
        let sid = sessionId;
        if (!sid) {
          const res = await startSession();
          sid = res.session_id;
          send("session", { session_id: sid });
        }
        const retrievedUrls = articles.map((a) => a.webUrl);
        if (retrievedUrls.length > 0) {
          await emitEvents(sid, "content_retrieved", retrievedUrls);
          send("telemetry", {
            type: "content_retrieved",
            count: retrievedUrls.length,
            urls: retrievedUrls
          });
        }
        const context = articles.map((a, i) => {
          const headline = a.fields?.headline ?? a.webTitle;
          const standfirst = a.fields?.standfirst ?? "";
          const body = a.fields?.body ? truncateBody(a.fields.body, 2e3) : "";
          return `[${i + 1}] ${headline}
URL: ${a.webUrl}
${standfirst}
${body}`;
        }).join("\n\n---\n\n");
        const systemPrompt = `You are a research assistant powered by Guardian journalism. Answer the user's question using ONLY the provided articles. Cite sources using [n] markers matching the article numbers. If the articles don't contain relevant information, say so. Be concise and informative.`;
        const messages = [
          { role: "system", content: systemPrompt },
          ...history.map((m) => ({
            role: m.role,
            content: m.content
          })),
          {
            role: "user",
            content: `Articles:

${context}

---

Question: ${message}`
          }
        ];
        let fullResponse = "";
        for await (const chunk of streamMistralChat(messages)) {
          fullResponse += chunk;
          send("token", { text: chunk });
        }
        const citedIndices = parseCitationMarkers(fullResponse);
        const validCited = citedIndices.filter((i) => i >= 0 && i < articles.length);
        const citedUrls = validCited.map((i) => articles[i].webUrl);
        if (citedUrls.length > 0) {
          await emitEvents(sid, "content_cited", citedUrls);
          send("telemetry", {
            type: "content_cited",
            count: citedUrls.length,
            urls: citedUrls
          });
        }
        send("done", {
          session_id: sid,
          citations: validCited.map((i) => ({
            marker: `[${i + 1}]`,
            url: articles[i]?.webUrl,
            headline: articles[i]?.fields?.headline ?? articles[i]?.webTitle
          }))
        });
      } catch (err) {
        send("error", { message: String(err) });
      } finally {
        controller.close();
      }
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  });
};
export {
  POST
};
