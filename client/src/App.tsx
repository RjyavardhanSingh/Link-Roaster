import { useState } from 'react';
import RoastForm from './components/RoastForm';
import RoastResult from './components/RoastResult';
import RoastFeed from './components/RoastFeed';
import Modal from './components/Modal';
import type { RoastResponse } from './api/roast';
import { submitRoast } from './api/roast';
import heroImage from './assets/heroImage.png';
import styles from './App.module.css';

export default function App() {
  const [result, setResult] = useState<RoastResponse | null>(null);
  const [selectedRoast, setSelectedRoast] = useState<RoastResponse | null>(null);
  const [newRoast, setNewRoast] = useState<RoastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoast = async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await submitRoast(url);
      setResult(data);
      if (!data.isBlock) setNewRoast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoast = (roast: RoastResponse) => {
    setSelectedRoast(roast);
  };

  return (
    <div className={styles.page}>
      <img className={styles.hero} src={heroImage} alt="" />

      <header className={styles.brand}>
        <h1 className={styles.logo}>Link Roaster</h1>
        <p className={styles.tagline}>
          Submit a URL. Get it roasted by AI.
        </p>
      </header>

      <RoastForm onSubmit={handleRoast} loading={loading} />

      {error && (
        <div style={{
          maxWidth: 640, margin: '24px auto 0', padding: '14px 20px',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {result && <RoastResult result={result} />}

      <RoastFeed
        newRoast={newRoast}
        onSelect={handleSelectRoast}
      />

      <Modal open={!!selectedRoast} onClose={() => setSelectedRoast(null)}>
        {selectedRoast && (
          <RoastResult
            result={selectedRoast}
            onClose={() => setSelectedRoast(null)}
          />
        )}
      </Modal>
    </div>
  );
}
