export interface RoastResponse {
  id: string;
  url: string;
  domain: string;
  title: string | null;
  summary: string;
  interesting: string;
  questionable: string;
  verdict: string;
  isBlock: boolean;
  blockedReason: string | null;
  scrapeFailed: boolean;
  ipHash: string;
  createdAt: string;
}

export async function submitRoast(url: string): Promise<RoastResponse> {
  const ipHash = await generateIpHash();

  const res = await fetch('/api/roast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, ipHash }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function fetchRoasts(): Promise<RoastResponse[]> {
  const res = await fetch('/api/roasts');
  if (!res.ok) {
    throw new Error('Failed to fetch roasts');
  }
  return res.json();
}

async function generateIpHash(): Promise<string> {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  const bytes = new TextEncoder().encode(hex);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
