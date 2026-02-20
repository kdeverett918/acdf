import type { Metadata } from 'next';
import { Suspense } from 'react';
import OutcomeExplorer from './OutcomeExplorer';

export const metadata: Metadata = {
  title: 'Outcome Explorer',
  description: 'Select any measure to see per-patient pre/post data, statistics, and clinical context for ACDF swallowing outcomes.',
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading outcome data...</div>}>
      <OutcomeExplorer />
    </Suspense>
  );
}
