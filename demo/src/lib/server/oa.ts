import { OA_TELEMETRY_URL, OA_API_URL, OA_PLATFORM_KEY, OA_PUBLISHER_KEY_GUARDIAN, OA_PUBLISHER_KEY_TELEGRAPH } from '$env/static/private';
import { TelemetryClient } from '@openattribution/telemetry';

// ---------------------------------------------------------------------------
// Auth contract (one place, matching the OA server):
//   - Writes (sessions, events) use the agent org's oat_pk_ key via the SDK.
//   - Reads (/content-owners/*) use each publisher's own oat_pub_ key,
//     sent as X-API-Key. A publisher key only sees its verified domains.
// Keys are minted per org through the OA identity API and configured here
// via env — never hardcoded, never shared between publishers.
// ---------------------------------------------------------------------------

export const telemetry = new TelemetryClient({
	endpoint: OA_TELEMETRY_URL,
	apiKey: OA_PLATFORM_KEY,
	// Chat must keep streaming if telemetry is down; the SDK logs failures
	// server-side. The read path below does NOT fail silently, so a broken
	// OA connection always surfaces in the publisher dashboard.
	failSilently: true
});

const publisherKeys: Record<string, string> = {
	guardian: OA_PUBLISHER_KEY_GUARDIAN,
	telegraph: OA_PUBLISHER_KEY_TELEGRAPH
};

/** Upstream OA read failure, carrying the status for the proxy to relay. */
export class OaReadError extends Error {
	constructor(
		public readonly status: number,
		public readonly detail: string
	) {
		super(`OA read failed (${status}): ${detail}`);
	}
}

async function publisherFetch(publisherId: string, path: string) {
	const key = publisherKeys[publisherId];
	if (!key) throw new OaReadError(500, `No publisher key configured for: ${publisherId}`);

	const res = await fetch(`${OA_API_URL}${path}`, {
		headers: { 'X-API-Key': key }
	});

	if (!res.ok) {
		const body = await res.text();
		console.error(`OA read ${path} for ${publisherId} failed: ${res.status} ${body}`);
		throw new OaReadError(res.status, body.slice(0, 500));
	}
	return res.json();
}

export async function getPublisherSummary(publisherId: string, since?: string) {
	const params = since ? `?since=${since}` : '';
	return publisherFetch(publisherId, `/content-owners/summary${params}`);
}

export async function getPublisherEvents(publisherId: string, limit = 20) {
	return publisherFetch(publisherId, `/content-owners/events?limit=${limit}&offset=0`);
}

export async function getPublisherUrls(publisherId: string, limit = 10) {
	return publisherFetch(publisherId, `/content-owners/urls?limit=${limit}&offset=0`);
}
