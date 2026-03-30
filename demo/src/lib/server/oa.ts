import { OA_SERVER_URL, OA_PLATFORM_KEY, OA_PUBLISHER_KEY_GUARDIAN, OA_PUBLISHER_KEY_TELEGRAPH } from '$env/static/private';
import { TelemetryClient } from '@openattribution/telemetry';

// ---------------------------------------------------------------------------
// SDK client (platform key — for writing telemetry)
// ---------------------------------------------------------------------------

export const telemetry = new TelemetryClient({
	endpoint: OA_SERVER_URL,
	apiKey: OA_PLATFORM_KEY,
	failSilently: true
});

// ---------------------------------------------------------------------------
// Publisher read endpoints (per-publisher keys)
// ---------------------------------------------------------------------------

const publisherKeys: Record<string, string> = {
	guardian: OA_PUBLISHER_KEY_GUARDIAN,
	telegraph: OA_PUBLISHER_KEY_TELEGRAPH
};

async function publisherFetch(publisherId: string, path: string) {
	const key = publisherKeys[publisherId];
	if (!key) throw new Error(`No publisher key configured for: ${publisherId}`);

	const res = await fetch(`${OA_SERVER_URL}${path}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': key
		}
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`OA server error ${res.status}: ${body}`);
	}
	return res.json();
}

export async function getPublisherSummary(publisherId: string, since?: string) {
	const params = since ? `?since=${since}` : '';
	return publisherFetch(publisherId, `/publisher/summary${params}`);
}

export async function getPublisherEvents(publisherId: string, limit = 20) {
	return publisherFetch(publisherId, `/publisher/events?limit=${limit}&offset=0`);
}

export async function getPublisherUrls(publisherId: string, limit = 10) {
	return publisherFetch(publisherId, `/publisher/urls?limit=${limit}&offset=0`);
}
