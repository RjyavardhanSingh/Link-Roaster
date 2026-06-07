import type { Request, Response } from 'express';
import { scrapeUrl, ScrapeError } from '../config/scraper';
import { generateAIResponse } from '../config/openRouterConfig';
import { createRoast, getAllRoasts } from '../models/roast';

const BLOCKED_DOMAINS = [
  'pornhub.com',
  'www.pornhub.com',
  'xvideos.com',
  'www.xvideos.com',
  'xnxx.com',
  'www.xnxx.com',
  'xhamster.com',
  'www.xhamster.com',
  'redtube.com',
  'www.redtube.com',
  'youporn.com',
  'www.youporn.com',
  'stripchat.com',
  'www.stripchat.com',
  'chaturbate.com',
  'www.chaturbate.com',
  'onlyfans.com',
  'www.onlyfans.com',
];

export async function roastUrl(req: Request, res: Response): Promise<void> {
  try {
    const { url, ipHash } = req.body;

    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'url is required' });
      return;
    }

    if (!ipHash || typeof ipHash !== 'string') {
      res.status(400).json({ error: 'ipHash is required' });
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      res.status(400).json({ error: 'Invalid URL format' });
      return;
    }

    const domain = parsedUrl.hostname;

    if (BLOCKED_DOMAINS.includes(domain)) {
      const saved = await createRoast({
        url, domain, ipHash,
        scrapeFailed: false,
        title: null,
        summary: '', interesting: '', questionable: '', verdict: '',
        isBlock: true,
        blockedReason: 'This domain is not allowed.',
      });
      res.status(201).json(saved);
      return;
    }

    let scrapedText: string;
    let scrapeFailed = false;

    try {
      scrapedText = await scrapeUrl(url);
    } catch (err) {
      scrapeFailed = true;
      if (err instanceof ScrapeError) {
        scrapedText = `[Scrape failed: ${err.message}]`;
      } else {
        scrapedText = '[Scrape failed: unknown error]';
      }
    }

    const aiResult = await generateAIResponse(url, scrapedText);

    const saved = await createRoast({
      url,
      domain,
      ipHash,
      scrapeFailed,
      title: aiResult.title || null,
      summary: aiResult.summary,
      interesting: aiResult.interesting,
      questionable: aiResult.questionable,
      verdict: aiResult.verdict,
      isBlock: aiResult.isBlocked,
      blockedReason: aiResult.blockedReason || null,
    });

    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Roast pipeline error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

export async function listRoasts(_req: Request, res: Response): Promise<void> {
  try {
    const roasts = await getAllRoasts();
    res.json(roasts);
  } catch (err: any) {
    console.error('Failed to fetch roasts:', err);
    res.status(500).json({ error: 'Failed to fetch roasts' });
  }
}
