import type { RequestHandler } from './$types';
import { searchGuardian, truncateBody } from '$lib/server/guardian';
import { startSession, emitEvents } from '$lib/server/oa';
import { streamMistralChat } from '$lib/server/mistral';

function parseCitationMarkers(text: string): number[] {
	const matches = text.matchAll(/\[(\d+)\]/g);
	const indices = new Set<number>();
	for (const m of matches) {
		const idx = parseInt(m[1], 10) - 1; // [1]-indexed → 0-indexed
		if (idx >= 0) indices.add(idx);
	}
	return [...indices].sort((a, b) => a - b);
}

export const POST: RequestHandler = async ({ request }) => {
	const { message, history = [], sessionId } = await request.json();

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			const send = (event: string, data: unknown) => {
				controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
			};

			try {
				// 1. Search Guardian
				const articles = await searchGuardian(message);
				send('sources', {
					articles: articles.map((a) => ({
						url: a.webUrl,
						headline: a.fields?.headline ?? a.webTitle,
						byline: a.fields?.byline ?? null,
						section: a.sectionName,
						date: a.webPublicationDate
					}))
				});

				// 2. Start or reuse OA session
				let sid = sessionId;
				if (!sid) {
					const res = await startSession();
					sid = res.session_id;
					send('session', { session_id: sid });
				}

				// 3. Emit content_retrieved events
				const retrievedUrls = articles.map((a) => a.webUrl);
				if (retrievedUrls.length > 0) {
					await emitEvents(sid, 'content_retrieved', retrievedUrls);
					send('telemetry', {
						type: 'content_retrieved',
						count: retrievedUrls.length,
						urls: retrievedUrls
					});
				}

				// 4. Build Mistral prompt
				const context = articles
					.map((a, i) => {
						const headline = a.fields?.headline ?? a.webTitle;
						const standfirst = a.fields?.standfirst ?? '';
						const body = a.fields?.body ? truncateBody(a.fields.body, 2000) : '';
						return `[${i + 1}] ${headline}\nURL: ${a.webUrl}\n${standfirst}\n${body}`;
					})
					.join('\n\n---\n\n');

				const systemPrompt =
					`You are a research assistant powered by Guardian journalism. ` +
					`Answer the user's question using ONLY the provided articles. ` +
					`Cite sources using [n] markers matching the article numbers. ` +
					`If the articles don't contain relevant information, say so. ` +
					`Be concise and informative.`;

				const messages = [
					{ role: 'system', content: systemPrompt },
					...history.map((m: { role: string; content: string }) => ({
						role: m.role,
						content: m.content
					})),
					{
						role: 'user',
						content: `Articles:\n\n${context}\n\n---\n\nQuestion: ${message}`
					}
				];

				// 5. Stream Mistral response
				let fullResponse = '';
				for await (const chunk of streamMistralChat(messages)) {
					fullResponse += chunk;
					send('token', { text: chunk });
				}

				// 6. Parse citations and emit content_cited
				const citedIndices = parseCitationMarkers(fullResponse);
				const validCited = citedIndices.filter((i) => i >= 0 && i < articles.length);
				const citedUrls = validCited.map((i) => articles[i].webUrl);

				if (citedUrls.length > 0) {
					await emitEvents(sid, 'content_cited', citedUrls);
					send('telemetry', {
						type: 'content_cited',
						count: citedUrls.length,
						urls: citedUrls
					});
				}

				// 7. Done
				send('done', {
					session_id: sid,
					citations: validCited.map((i) => ({
						marker: `[${i + 1}]`,
						url: articles[i]?.webUrl,
						headline: articles[i]?.fields?.headline ?? articles[i]?.webTitle
					}))
				});
			} catch (err) {
				send('error', { message: String(err) });
			} finally {
				controller.close();
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
