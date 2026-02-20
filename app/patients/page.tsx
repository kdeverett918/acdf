import type { Metadata } from 'next';
import { Suspense } from 'react';
import PatientExplorer from './PatientExplorer';

export const metadata: Metadata = {
  title: 'Patient Explorer',
  description: 'View complete outcome profiles for all 21 ACDF patients across six swallowing measures.',
};

export default function Page() {
  return (
    <>
      <div className="section-label">Individual Trajectories</div>
      <h2 className="page-title">Patient Explorer</h2>
      <p className="page-desc">Click any patient to see their complete outcome profile across all measures. Color coding reflects DIGEST change direction.</p>
      <Suspense fallback={<div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>Loading patient data...</div>}>
        <PatientExplorer />
      </Suspense>
    </>
  );
}
