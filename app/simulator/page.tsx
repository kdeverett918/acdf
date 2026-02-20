import type { Metadata } from 'next';
import SimulatorContent from './SimulatorContent';

export const metadata: Metadata = {
  title: 'Risk Simulator',
  description: 'Estimate post-ACDF swallowing outcome risk with adjustable patient parameters based on cohort patterns.',
};

export default function Page() {
  return <SimulatorContent />;
}
