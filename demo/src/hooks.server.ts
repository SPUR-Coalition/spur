import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

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

/**
 * Report an AI bot request as a standalone origin retrieval event
 * (Content Telemetry spec 7.1): no session, `source_role: "origin"` —
 * the origin web server observed the fetch, it did not initiate an
 * agent session. Posted directly because the SDK (0.4.0) only records
 * events inside a session. Failures are logged and swallowed: bot
 * detection must never affect page serving.
 */
async function reportOriginRetrieval(url: string, ua: string, botMatch: string) {
	const endpoint = env.OA_TELEMETRY_URL;
	const apiKey = env.OA_PLATFORM_KEY;
	if (!endpoint || !apiKey) return;

	try {
		const res = await fetch(`${endpoint}/events`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
			body: JSON.stringify({
				document_type: 'event',
				event: {
					type: 'content_retrieved',
					timestamp: new Date().toISOString(),
					source_role: 'origin',
					content_url: url,
					data: { user_agent: ua, bot_match: botMatch }
				}
			})
		});
		if (!res.ok) {
			console.error(`Origin bot telemetry failed: ${res.status} ${await res.text()}`);
		}
	} catch (err) {
		console.error('Origin bot telemetry failed:', err);
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	// AI bot telemetry - runs before auth, before resolve
	const ua = event.request.headers.get('user-agent') || '';
	const botMatch = isAiBot(ua);
	if (botMatch) {
		reportOriginRetrieval(event.url.href, ua, botMatch);
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
