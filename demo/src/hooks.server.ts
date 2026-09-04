import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { telemetry } from '$lib/server/oa';

const COOKIE_NAME = 'spur_demo_auth';

/**
 * Known AI bot user-agent patterns, each mapped to the access `purpose`
 * of Content Telemetry spec 6.2 (open enum: training, inference,
 * search). Classifications follow each vendor's published bot
 * documentation, in the spirit of the spec's Annex C vendor mappings.
 */
const AI_BOT_PURPOSES: Record<string, 'training' | 'inference' | 'search'> = {
	'GPTBot': 'training',
	'ChatGPT-User': 'inference',
	'OAI-SearchBot': 'search',
	'ClaudeBot': 'training',
	'Claude-Web': 'inference',
	'Google-Extended': 'training',
	'Googlebot-AI': 'search',
	'PerplexityBot': 'search',
	'Perplexity-User': 'inference',
	'Bytespider': 'training',
	'CCBot': 'training',
	'anthropic-ai': 'training',
	'cohere-ai': 'training',
	'Meta-ExternalAgent': 'training',
	'Meta-ExternalFetcher': 'inference',
	'Applebot-Extended': 'training',
	'YouBot': 'search',
	'Diffbot': 'training',
	'ImagesiftBot': 'training',
	'Timpibot': 'training'
};

function isAiBot(ua: string): string | null {
	for (const pattern of Object.keys(AI_BOT_PURPOSES)) {
		if (ua.includes(pattern)) return pattern;
	}
	return null;
}

/**
 * Report an AI bot request as a standalone origin retrieval event
 * (Content Telemetry spec 7.1): no session, `source_role: "origin"` —
 * the origin web server observed the fetch, it did not initiate an
 * agent session. The SDK's failSilently client logs and swallows
 * failures: bot detection must never affect page serving.
 */
function reportOriginRetrieval(url: string, ua: string, botMatch: string) {
	if (!env.OA_TELEMETRY_URL) return;

	void telemetry.recordStandaloneEvent({
		type: 'content_retrieved',
		timestamp: new Date().toISOString(),
		sourceRole: 'origin',
		contentUrl: url,
		data: { user_agent: ua, bot_match: botMatch, purpose: AI_BOT_PURPOSES[botMatch] }
	});
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
