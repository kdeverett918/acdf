'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '.75rem' }}>Something went wrong</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginBottom: '1.5rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <button className="btn btn-primary" onClick={reset}>Try again</button>
    </div>
  );
}
