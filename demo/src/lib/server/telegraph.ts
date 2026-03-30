import { TELEGRAPH_API_KEY, TELEGRAPH_API_URL } from '$env/static/private';

// TELEGRAPH_API_URL overrides the default public RSS — set in production to
// point at the authenticated endpoint (e.g. https://api.telegraph.co.uk/tmg-feed).
const PUBLIC_URL = 'https://www.telegraph.co.uk/rss.xml';

export interface TelegraphItem {
	title: string;
	link: string;
	guid: string;
	pubDate: string;
	premium: boolean;
	category: string;
	description: string;
	body: string;
}

/** Fetch the Telegraph RSS feed — authenticated API in production, public RSS locally. */
async function fetchFeed(): Promise<TelegraphItem[]> {
	const useApi = !!TELEGRAPH_API_URL;
	const res = await fetch(useApi ? TELEGRAPH_API_URL : PUBLIC_URL, {
		headers: useApi
			? { app_key: TELEGRAPH_API_KEY, 'User-Agent': 'TMGH-Service' }
			: {}
	});
	if (!res.ok) throw new Error(`Telegraph RSS error: ${res.status}`);

	const xml = await res.text();
	return parseItems(xml);
}

/** Minimal XML parsing — extract <item> elements from RSS feed. */
function parseItems(xml: string): TelegraphItem[] {
	const items: TelegraphItem[] = [];
	const itemRegex = /<item>([\s\S]*?)<\/item>/g;
	let match;

	while ((match = itemRegex.exec(xml)) !== null) {
		const block = match[1];
		items.push({
			title: extractTag(block, 'title'),
			link: extractTag(block, 'link'),
			guid: extractGuid(block),
			pubDate: extractTag(block, 'pubDate'),
			premium: extractTag(block, 'premium') === 'true',
			category: extractCategory(block),
			description: extractTag(block, 'description'),
			body: extractEncodedContent(block)
		});
	}

	return items;
}

function extractTag(xml: string, tag: string): string {
	// Handle CDATA-wrapped content
	const cdataMatch = xml.match(new RegExp(`<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`));
	if (cdataMatch) return cdataMatch[1].trim();

	const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
	return match ? match[1].trim() : '';
}

function extractGuid(xml: string): string {
	const match = xml.match(/<guid[^>]*>([^<]*)<\/guid>/);
	return match ? match[1].trim() : '';
}

function extractCategory(xml: string): string {
	// API feed uses plain values: news, sport, opinion-comment, sponsored
	// Public feed used structure:section format — handle both for safety
	const structureMatch = xml.match(/<category[^>]*>structure:([^<]+)<\/category>/);
	if (structureMatch) return structureMatch[1].trim();
	const match = xml.match(/<category[^>]*>([^<]*)<\/category>/);
	return match ? match[1].trim() : '';
}

function extractEncodedContent(xml: string): string {
	const match = xml.match(/<content:encoded>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/content:encoded>/);
	if (!match) return '';
	// Strip HTML tags, keep text
	return match[1].replace(/<[^>]+>/g, '').trim();
}

/** Strip HTML tags from text. */
export function stripHtml(html: string): string {
	return html.replace(/<[^>]+>/g, '').trim();
}

/** Truncate text to roughly maxChars, breaking at a word boundary. */
export function truncateBody(body: string, maxChars = 2000): string {
	const clean = stripHtml(body);
	if (clean.length <= maxChars) return clean;
	const truncated = clean.slice(0, maxChars);
	const lastSpace = truncated.lastIndexOf(' ');
	return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

// Cache the feed for 5 minutes to avoid hammering the API on every chat message
let cachedItems: TelegraphItem[] = [];
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getCachedFeed(): Promise<TelegraphItem[]> {
	if (Date.now() - cacheTime > CACHE_TTL || cachedItems.length === 0) {
		cachedItems = await fetchFeed();
		cacheTime = Date.now();
	}
	return cachedItems;
}

/**
 * Search Telegraph articles by matching keywords against titles and descriptions.
 * Returns top matches ranked by keyword hit count.
 */
export async function searchTelegraph(query: string, maxResults = 5): Promise<TelegraphItem[]> {
	let items: TelegraphItem[];
	try {
		items = await getCachedFeed();
	} catch (err) {
		console.error('Telegraph feed unavailable:', err);
		return [];
	}

	// Extract keywords from query — strip operators and short words
	const keywords = query
		.replace(/\b(AND|OR|NOT)\b/g, '')
		.replace(/[""()]/g, '')
		.split(/\s+/)
		.filter((w) => w.length > 2)
		.map((w) => w.toLowerCase());

	if (keywords.length === 0) return items.slice(0, maxResults);

	// Score each article by keyword matches in title + description
	const scored = items.map((item) => {
		const text = `${item.title} ${item.description} ${item.category}`.toLowerCase();
		const score = keywords.reduce((sum, kw) => sum + (text.includes(kw) ? 1 : 0), 0);
		return { item, score };
	});

	return scored
		.filter((s) => s.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, maxResults)
		.map((s) => s.item);
}
