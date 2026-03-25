import type { RequestHandler } from './$types';
import { getPublisherSummary, getPublisherEvents, getPublisherUrls } from '$lib/server/oa';

const VALID_PUBLISHERS = ['guardian', 'telegraph'];

export const GET: RequestHandler = async ({ url }) => {
	const view = url.searchParams.get('view') ?? 'summary';
	const limit = Number(url.searchParams.get('limit') ?? 20);
	const publisher = url.searchParams.get('publisher') ?? 'guardian';

	if (!VALID_PUBLISHERS.includes(publisher)) {
		return new Response(JSON.stringify({ error: `Invalid publisher: ${publisher}` }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		let data;
		switch (view) {
			case 'summary':
				data = await getPublisherSummary(publisher);
				break;
			case 'events':
				data = await getPublisherEvents(publisher, limit);
				break;
			case 'urls':
				data = await getPublisherUrls(publisher, limit);
				break;
			default:
				return new Response(JSON.stringify({ error: 'Invalid view' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				});
		}

		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
