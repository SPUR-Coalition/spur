import { MISTRAL_API_KEY } from '$env/static/private';

const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function* streamMistralChat(
	messages: Array<{ role: string; content: string }>
): AsyncGenerator<string> {
	const res = await fetch(MISTRAL_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${MISTRAL_API_KEY}`
		},
		body: JSON.stringify({
			model: 'mistral-small-latest',
			messages,
			stream: true,
			max_tokens: 2048
		})
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Mistral API error ${res.status}: ${body}`);
	}
	if (!res.body) throw new Error('No response body from Mistral');

	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop() ?? '';

		for (const line of lines) {
			if (!line.startsWith('data: ')) continue;
			const data = line.slice(6).trim();
			if (data === '[DONE]') return;
			try {
				const parsed = JSON.parse(data);
				const content = parsed.choices?.[0]?.delta?.content;
				if (content) yield content;
			} catch {
				// Skip malformed chunks
			}
		}
	}
}
