import type { RequestHandler } from './$types';
import { getPublisherSummary, getPublisherEvents, getPublisherUrls, OaReadError } from '$lib/server/oa';

const VALID_PUBLISHERS = ['guardian', 'telegraph'];

function json(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

export const GET: RequestHandler = async ({ url }) => {
	const view = url.searchParams.get('view') ?? 'summary';
	const limit = Number(url.searchParams.get('limit') ?? 20);
	const publisher = url.searchParams.get('publisher') ?? 'guardian';

	if (!VALID_PUBLISHERS.includes(publisher)) {
		return json({ error: `Invalid publisher: ${publisher}` }, 400);
	}

	try {
		switch (view) {
			case 'summary':
				return json(await getPublisherSummary(publisher));
			case 'events':
				return json(await getPublisherEvents(publisher, limit));
			case 'urls':
				return json(await getPublisherUrls(publisher, limit));
			default:
				return json({ error: 'Invalid view' }, 400);
		}
	} catch (err) {
		// Surface what actually failed: auth problems (stale key) come back
		// as 502 with the upstream status attached, so the pane can show a
		// real diagnostic instead of blanking.
		if (err instanceof OaReadError) {
			return json({ error: err.detail, upstream_status: err.status }, 502);
		}
		console.error(`Publisher ${view} fetch failed for ${publisher}:`, err);
		return json({ error: 'OA server unreachable' }, 502);
	}
};
