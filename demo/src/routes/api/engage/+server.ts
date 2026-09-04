import type { RequestHandler } from './$types';
import { telemetry } from '$lib/server/oa';

export const POST: RequestHandler = async ({ request }) => {
	const { sessionId, url, presentationId } = await request.json();

	if (!sessionId || !url) {
		return new Response(JSON.stringify({ error: 'sessionId and url required' }), { status: 400 });
	}

	try {
		// An agent-reported engagement references the exact presentation the
		// click occurred on (spec 6.7); the id was minted with the response's
		// content_presented event and passed through the client.
		await telemetry.recordEvent(sessionId, 'content_engaged', {
			contentUrl: url,
			...(typeof presentationId === 'string' && presentationId ? { presentationId } : {}),
			data: { engagement_type: 'link_click' }
		});
		return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
	}
};
