import { g as getPublisherUrls, a as getPublisherEvents, b as getPublisherSummary } from "../../../../chunks/oa.js";
const GET = async ({ url }) => {
  const view = url.searchParams.get("view") ?? "summary";
  const limit = Number(url.searchParams.get("limit") ?? 20);
  try {
    let data;
    switch (view) {
      case "summary":
        data = await getPublisherSummary();
        break;
      case "events":
        data = await getPublisherEvents(limit);
        break;
      case "urls":
        data = await getPublisherUrls(limit);
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid view" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
};
export {
  GET
};
