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

  const extracted = tryExtractJsonLd($) || tryExtractArticle($) || tryExtractBody($);

  if (!extracted || extracted.length < 50) {
    const meta = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    if (meta.length >= 50) return meta.slice(0, 3000);
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
    if (title) return `[Scraped URL] ${title}`;
    throw new ScrapeError('Page appears to be behind a paywall or has no readable content');
  }

  return extracted.slice(0, 8000);
}

function tryExtractJsonLd($: cheerio.CheerioAPI): string | null {
  const blocks: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).text());
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item.articleBody) blocks.push(item.articleBody);
        if (item.description) blocks.push(item.description);
        if (item.text) blocks.push(item.text);
      }
    } catch {}
  });
  return blocks.length > 0 ? blocks.join('\n\n') : null;
}

function tryExtractArticle($: cheerio.CheerioAPI): string | null {
  const article = $('article').first();
  if (!article.length) return null;
  article.find('script, style, nav, footer, header, aside, iframe, noscript, svg').remove();
  const text = article.text().replace(/\s+/g, ' ').trim();
  return text.length >= 50 ? text : null;
}

function tryExtractBody($: cheerio.CheerioAPI): string | null {
  const clone = $('body').clone();
  clone.find('script, style, nav, footer, header, aside, iframe, noscript, svg, [role="navigation"]').remove();
  const text = clone.text().replace(/\s+/g, ' ').trim();
  return text.length >= 50 ? text : null;
}
