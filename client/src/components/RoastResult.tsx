import type { RoastResponse } from '../api/roast';
import styles from './RoastResult.module.css';

interface Props {
  result: RoastResponse;
}

export default function RoastResult({ result }: Props) {
  if (result.isBlock) {
    return (
      <div className={styles.card}>
        <div className={styles.blocked}>
          <div className={styles.label}>Blocked</div>
          <p className={styles.blockedText}>
            {result.blockedReason || 'This content is not allowed.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.domain}>{result.domain}</div>
        <div className={styles.title}>{result.title || result.domain}</div>
      </div>
      <div className={styles.body}>
        <div className={styles.section}>
          <div className={styles.label}>Summary</div>
          <p className={styles.text}>{result.summary}</p>
        </div>
        <div className={styles.section}>
          <div className={styles.label}>Interesting</div>
          <p className={styles.text}>{result.interesting}</p>
        </div>
        <div className={styles.section}>
          <div className={styles.label}>Questionable</div>
          <p className={styles.text}>{result.questionable}</p>
        </div>
        <div className={styles.section}>
          <div className={styles.label}>Verdict</div>
          <p className={styles.verdict}>{result.verdict}</p>
        </div>
      </div>
    </div>
  );
}
