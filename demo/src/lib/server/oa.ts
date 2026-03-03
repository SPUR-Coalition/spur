import { OA_SERVER_URL, OA_PLATFORM_KEY, OA_PUBLISHER_KEY } from '$env/static/private';
import { TelemetryClient } from '@openattribution/telemetry';

// ---------------------------------------------------------------------------
// SDK client (platform key — for writing telemetry)
// ---------------------------------------------------------------------------

export const telemetry = new TelemetryClient({
	endpoint: OA_SERVER_URL,
	apiKey: OA_PLATFORM_KEY,
	failSilently: false
});

// ---------------------------------------------------------------------------
// Publisher read endpoints (publisher key — not part of the SDK)
// ---------------------------------------------------------------------------

async function publisherFetch(path: string) {
	const res = await fetch(`${OA_SERVER_URL}${path}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': OA_PUBLISHER_KEY
		}
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`OA server error ${res.status}: ${body}`);
	}
	return res.json();
}

export async function getPublisherSummary(since?: string) {
	const params = since ? `?since=${since}` : '';
	return publisherFetch(`/publisher/summary${params}`);
}

export async function getPublisherEvents(limit = 20) {
	return publisherFetch(`/publisher/events?limit=${limit}&offset=0`);
}

export async function getPublisherUrls(limit = 10) {
	return publisherFetch(`/publisher/urls?limit=${limit}&offset=0`);
}
