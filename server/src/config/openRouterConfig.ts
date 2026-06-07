import { OpenRouter } from '@openrouter/sdk';

export interface RoastAIResponse {
  isBlocked: boolean;
  title: string;
  summary: string;
  interesting: string;
  questionable: string;
  verdict: string;
  blockedReason: string | null;
}

const client = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_KEY,
});

export async function generateAIResponse(url: string, scrapedText: string): Promise<RoastAIResponse> {
  const completion = await client.chat.send({
    chatRequest: {
    model: '~openai/gpt-latest',
    maxTokens: 600,
    messages: [
      {
        role: 'user',
        content: `You are a witty, sharp internet critic. A user has submitted this URL for roasting:
URL: ${url}

Scraped page content:
"""
${scrapedText.slice(0, 3000)}
"""

FIRST — check if this content is:
- Adult / explicit / sexual
- Violent or gory
- Hateful or discriminatory
- Spam or malicious

If YES to any — respond ONLY with this JSON:
{"isBlocked": true, "blockedReason": "reason here", "title": "", "summary": "", "interesting": "", "questionable": "", "verdict": ""}

If content is SAFE — roast it and respond ONLY with this JSON:
{"isBlocked": false, "title": "page title or inferred title", "summary": "2-3 sentence neutral summary of what this page is", "interesting": "what stands out or is noteworthy about this page", "questionable": "what seems dubious, biased, or worth side-eyeing", "verdict": "one savage and funny one-liner verdict", "blockedReason": null}

IMPORTANT: Respond with ONLY the JSON object. No markdown, no backticks, no extra text.`,
      },
    ],
  }
  });

  const raw = completion?.choices?.[0]?.message?.content ?? '';
  if (!raw) {
    throw new Error('AI returned empty response');
  }

  try {
    const parsed: RoastAIResponse = JSON.parse(raw);
    return parsed;
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as RoastAIResponse;
    }
    throw new Error('Failed to parse AI response as JSON');
  }
}
