import { useEffect, useState } from 'react';
import type { RoastResponse } from '../api/roast';
import { fetchRoasts } from '../api/roast';
import styles from './RoastFeed.module.css';

interface Props {
  newRoast?: RoastResponse | null;
  onSelect: (roast: RoastResponse) => void;
}

export default function RoastFeed({ newRoast, onSelect }: Props) {
  const [roasts, setRoasts] = useState<RoastResponse[]>([]);

  useEffect(() => {
    fetchRoasts()
      .then(setRoasts)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (newRoast && !newRoast.isBlock) {
      setRoasts(prev => {
        const filtered = prev.filter(r => r.id !== newRoast.id);
        return [newRoast, ...filtered];
      });
    }
  }, [newRoast]);

  if (roasts.length === 0) {
    return (
      <div className={styles.feed}>
        <div className={styles.heading}>Recent Roasts</div>
        <p className={styles.empty}>No roasts yet. Submit a URL above to get started.</p>
      </div>
    );
  }

  return (
    <div className={styles.feed}>
      <div className={styles.heading}>Recent Roasts</div>
      {roasts.map(r => (
        <button key={r.id} className={styles.item} onClick={() => onSelect(r)}>
          <div className={styles.itemDomain}>{r.domain}</div>
          <div className={styles.itemTitle}>{r.title || r.domain}</div>
          <div className={styles.itemVerdict}>{r.verdict}</div>
          {r.scrapeFailed && <span className={styles.tag}>Scrape failed</span>}
        </button>
      ))}
    </div>
  );
}
