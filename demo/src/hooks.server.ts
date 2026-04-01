import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { TelemetryClient } from '@openattribution/telemetry';

const COOKIE_NAME = 'spur_demo_auth';

// Known AI bot user-agent patterns
const AI_BOT_PATTERNS = [
	'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
	'ClaudeBot', 'Claude-Web',
	'Google-Extended', 'Googlebot-AI',
	'PerplexityBot', 'Perplexity-User',
	'Bytespider', 'CCBot',
	'anthropic-ai', 'cohere-ai',
	'Meta-ExternalAgent', 'Meta-ExternalFetcher',
	'Applebot-Extended',
	'YouBot', 'Diffbot',
	'ImagesiftBot', 'Timpibot',
];

function isAiBot(ua: string): string | null {
	for (const pattern of AI_BOT_PATTERNS) {
		if (ua.includes(pattern)) return pattern;
	}
	return null;
}

let edgeClient: TelemetryClient | null = null;

function getEdgeClient(): TelemetryClient | null {
	if (edgeClient) return edgeClient;
	const endpoint = env.OA_SERVER_URL;
	const apiKey = env.OA_PLATFORM_KEY;
	if (!endpoint || !apiKey) return null;
	edgeClient = new TelemetryClient({ endpoint, apiKey, failSilently: true });
	return edgeClient;
}

async function reportEdgeEvent(url: string, ua: string, botMatch: string) {
	const client = getEdgeClient();
	if (!client) return;

	const sessionId = await client.startSession({ initiatorType: 'user' });
	if (!sessionId) return;

	await client.recordEvent(sessionId, 'content_retrieved', {
		contentUrl: url,
		data: {
			source_role: 'edge',
			user_agent: ua,
			bot_match: botMatch,
		},
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	// AI bot telemetry - runs before auth, before resolve
	const ua = event.request.headers.get('user-agent') || '';
	const botMatch = isAiBot(ua);
	if (botMatch) {
		reportEdgeEvent(event.url.href, ua, botMatch);
	}

	const password = env.DEMO_PASSWORD;

	// If no password is set, skip auth (local dev)
	if (!password) return resolve(event);

	// Allow the login page and static assets through
	if (event.url.pathname === '/login') return resolve(event);
	if (event.url.pathname.startsWith('/_app/') || event.url.pathname.startsWith('/favicon')) {
		return resolve(event);
	}

	// Check auth cookie
	const cookie = event.cookies.get(COOKIE_NAME);
	if (cookie === password) return resolve(event);

	// Everything else redirects to login
	return new Response(null, {
		status: 302,
		headers: { Location: '/login' }
	});
};
