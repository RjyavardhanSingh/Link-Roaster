import * as cheerio from 'cheerio';

const SCRAPE_TIMEOUT = 10000;

export class ScrapeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScrapeError';
  }
}

export async function scrapeUrl(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    });
  } catch (err: any) {
    throw new ScrapeError(`Failed to fetch URL: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ScrapeError(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
    throw new ScrapeError('URL does not point to an HTML page');
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $('script, style, nav, footer, header, aside, iframe, noscript, svg, [role="navigation"]').remove();

  const text = $('body')
    .text()
    .replace(/\s+/g, ' ')
    .trim();

  if (!text || text.length < 50) {
    throw new ScrapeError('Page appears to be behind a paywall or has no readable content');
  }

  return text.slice(0, 8000);
}
