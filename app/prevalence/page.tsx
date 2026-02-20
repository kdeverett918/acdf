import type { Metadata } from 'next';
import PrevalenceContent from './PrevalenceContent';

export const metadata: Metadata = {
  title: 'Prevalence & Incidence',
  description: 'PROs detected greater postoperative increases in prevalence and new-onset incidence compared with DIGEST after ACDF surgery.',
};

export default function Page() {
  return <PrevalenceContent />;
}
