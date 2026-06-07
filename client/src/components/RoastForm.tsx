import { type FormEvent, useState } from 'react';
import styles from './RoastForm.module.css';

interface Props {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export default function RoastForm({ onSubmit, loading }: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim() && !loading) {
      onSubmit(url.trim());
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="url"
        placeholder="Enter a URL to roast..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        required
      />
      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? 'Roasting...' : 'Roast'}
      </button>
    </form>
  );
}
