import "clsx";
import { a1 as ensure_array_like, a2 as attr_class, a3 as stringify, e as escape_html, a4 as attr } from "../../chunks/index2.js";
import { w as writable } from "../../chunks/index.js";
const telemetryEvents = writable([]);
const currentSessionId = writable(null);
const dashboardRefreshTrigger = writable(0);
function ChatPane($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let messages = [];
    let input = "";
    let isStreaming = false;
    $$renderer2.push(`<div class="chat-container svelte-m6m4xa"><div class="messages svelte-m6m4xa">`);
    if (messages.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="empty svelte-m6m4xa"><p class="empty-title svelte-m6m4xa">Ask about Guardian journalism</p> <p class="empty-hint svelte-m6m4xa">Try: "What has the Guardian reported about AI regulation?"</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array = ensure_array_like(messages);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let msg = each_array[$$index_1];
      $$renderer2.push(`<div${attr_class(`message ${stringify(msg.role)}`, "svelte-m6m4xa")}><div class="message-label svelte-m6m4xa">${escape_html(msg.role === "user" ? "You" : "Assistant")}</div> <div class="message-content svelte-m6m4xa">${escape_html(msg.content)}`);
      if (msg.role === "assistant" && isStreaming) ;
      else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (msg.sources && msg.sources.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="sources svelte-m6m4xa"><div class="sources-label svelte-m6m4xa">Sources retrieved:</div> <!--[-->`);
        const each_array_1 = ensure_array_like(msg.sources);
        for (let i = 0, $$length2 = each_array_1.length; i < $$length2; i++) {
          let source = each_array_1[i];
          $$renderer2.push(`<a${attr("href", source.url)} target="_blank" rel="noopener" class="source svelte-m6m4xa">[${escape_html(i + 1)}] ${escape_html(source.headline)}</a>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <form class="input-area svelte-m6m4xa"><input type="text"${attr("value", input)} placeholder="Ask about Guardian content..."${attr("disabled", isStreaming, true)} class="svelte-m6m4xa"/> <button type="submit"${attr("disabled", !input.trim(), true)} class="svelte-m6m4xa">Send</button></form></div>`);
  });
}
function TelemetryPane($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let events = [];
    let sessionId = null;
    telemetryEvents.subscribe((v) => {
      events = v;
    });
    currentSessionId.subscribe((v) => {
      sessionId = v;
    });
    function shortUrl(url) {
      try {
        const u = new URL(url);
        return u.pathname.length > 50 ? u.pathname.slice(0, 47) + "..." : u.pathname;
      } catch {
        return url;
      }
    }
    function formatTime(iso) {
      return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    $$renderer2.push(`<div class="telemetry-container svelte-161srx7">`);
    if (sessionId) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="session-badge svelte-161srx7">Session: <code class="svelte-161srx7">${escape_html(sessionId.slice(0, 8))}...</code></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="events svelte-161srx7">`);
    if (events.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="empty svelte-161srx7"><p>No telemetry events yet.</p> <p class="hint svelte-161srx7">Events appear here as the chat retrieves and cites Guardian content.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array = ensure_array_like(events);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let event = each_array[i];
      $$renderer2.push(`<div${attr_class("event svelte-161srx7", void 0, {
        "retrieved": event.type === "content_retrieved",
        "cited": event.type === "content_cited"
      })}><div class="event-header svelte-161srx7"><span${attr_class("badge svelte-161srx7", void 0, {
        "badge-retrieved": event.type === "content_retrieved",
        "badge-cited": event.type === "content_cited"
      })}>${escape_html(event.type === "content_retrieved" ? "RETRIEVED" : "CITED")}</span> <span class="count svelte-161srx7">${escape_html(event.count)} URL${escape_html(event.count !== 1 ? "s" : "")}</span> <span class="time svelte-161srx7">${escape_html(formatTime(event.timestamp))}</span></div> <div class="event-urls svelte-161srx7"><!--[-->`);
      const each_array_1 = ensure_array_like(event.urls);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let url = each_array_1[$$index];
        $$renderer2.push(`<a${attr("href", url)} target="_blank" rel="noopener" class="url svelte-161srx7">${escape_html(shortUrl(url))}</a>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="legend svelte-161srx7"><span class="legend-item svelte-161srx7"><span class="dot retrieved-dot svelte-161srx7"></span> content_retrieved</span> <span class="legend-item svelte-161srx7"><span class="dot cited-dot svelte-161srx7"></span> content_cited</span></div></div>`);
  });
}
function DashboardPane($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let summary = null;
    let recentEvents = [];
    let topUrls = [];
    let loading = true;
    let error = null;
    async function fetchData() {
      try {
        error = null;
        const [summaryRes, eventsRes, urlsRes] = await Promise.all([
          fetch("/api/publisher?view=summary"),
          fetch("/api/publisher?view=events&limit=10"),
          fetch("/api/publisher?view=urls&limit=10")
        ]);
        if (summaryRes.ok) summary = await summaryRes.json();
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          recentEvents = data.items;
        }
        if (urlsRes.ok) {
          const data = await urlsRes.json();
          topUrls = data.items;
        }
      } catch (err) {
        error = String(err);
      } finally {
        loading = false;
      }
    }
    dashboardRefreshTrigger.subscribe(() => {
      setTimeout(fetchData, 500);
    });
    function shortUrl(url) {
      try {
        const u = new URL(url);
        return u.pathname.length > 40 ? u.pathname.slice(0, 37) + "..." : u.pathname;
      } catch {
        return url;
      }
    }
    function formatTime(iso) {
      return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    $$renderer2.push(`<div class="dashboard-container svelte-kkdqag">`);
    if (loading) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-kkdqag">Loading publisher data...</div>`);
    } else if (error) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="error svelte-kkdqag">${escape_html(error)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="content svelte-kkdqag">`);
      if (summary) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="cards svelte-kkdqag"><div class="card svelte-kkdqag"><div class="card-value svelte-kkdqag">${escape_html(summary.total_events)}</div> <div class="card-label svelte-kkdqag">Total events</div></div> <div class="card svelte-kkdqag"><div class="card-value svelte-kkdqag">${escape_html(summary.total_sessions)}</div> <div class="card-label svelte-kkdqag">Sessions</div></div> <!--[-->`);
        const each_array = ensure_array_like(summary.events_by_type);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let evt = each_array[$$index];
          $$renderer2.push(`<div class="card svelte-kkdqag"><div class="card-value svelte-kkdqag">${escape_html(evt.count)}</div> <div class="card-label svelte-kkdqag">${escape_html(evt.event_type)}</div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (topUrls.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="section svelte-kkdqag"><div class="section-title svelte-kkdqag">Top URLs</div> <div class="url-list svelte-kkdqag"><!--[-->`);
        const each_array_1 = ensure_array_like(topUrls);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let url = each_array_1[$$index_1];
          $$renderer2.push(`<div class="url-row svelte-kkdqag"><a${attr("href", url.content_url)} target="_blank" rel="noopener" class="url-path svelte-kkdqag">${escape_html(shortUrl(url.content_url))}</a> <div class="url-stats svelte-kkdqag"><span class="stat svelte-kkdqag">${escape_html(url.total_events)} events</span> <span class="stat svelte-kkdqag">${escape_html(url.unique_sessions)} sessions</span></div></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (recentEvents.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="section svelte-kkdqag"><div class="section-title svelte-kkdqag">Recent events</div> <div class="events-list svelte-kkdqag"><!--[-->`);
        const each_array_2 = ensure_array_like(recentEvents);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let event = each_array_2[$$index_2];
          $$renderer2.push(`<div class="event-row svelte-kkdqag"><span${attr_class("event-badge svelte-kkdqag", void 0, {
            "retrieved": event.event_type === "content_retrieved",
            "cited": event.event_type === "content_cited"
          })}>${escape_html(event.event_type === "content_retrieved" ? "RET" : "CIT")}</span> <span class="event-url svelte-kkdqag">${escape_html(event.content_url ? shortUrl(event.content_url) : "-")}</span> <span class="event-time svelte-kkdqag">${escape_html(formatTime(event.event_timestamp))}</span></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (!summary?.total_events) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="no-data svelte-kkdqag"><p>No telemetry data yet.</p> <p class="hint svelte-kkdqag">Use the chat to generate content_retrieved and content_cited events.</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer) {
  $$renderer.push(`<div class="panes svelte-1uha8ag"><div class="pane chat svelte-1uha8ag"><div class="pane-header svelte-1uha8ag">Agent chat</div> `);
  ChatPane($$renderer);
  $$renderer.push(`<!----></div> <div class="pane telemetry svelte-1uha8ag"><div class="pane-header svelte-1uha8ag">Telemetry events</div> `);
  TelemetryPane($$renderer);
  $$renderer.push(`<!----></div> <div class="pane dashboard svelte-1uha8ag"><div class="pane-header svelte-1uha8ag">Publisher dashboard (The Guardian)</div> `);
  DashboardPane($$renderer);
  $$renderer.push(`<!----></div></div>`);
}
export {
  _page as default
};
