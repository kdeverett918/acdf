import type { Metadata } from 'next';
import CalculatorContent from './CalculatorContent';

export const metadata: Metadata = {
  title: 'Score Calculators',
  description: 'Calculate DIGEST, EAT-10, Bazaz, and HSS-DDI scores and compare with the ACDF study cohort distribution.',
};

export default function Page() {
  return <CalculatorContent />;
}
