import type { Metadata } from 'next';
import ConcordanceContent from './ConcordanceContent';

export const metadata: Metadata = {
  title: 'Concordance Analysis',
  description: 'Examining pairwise agreement between VFSS and patient-reported swallowing measures after ACDF surgery.',
};

export default function Page() {
  return <ConcordanceContent />;
}
