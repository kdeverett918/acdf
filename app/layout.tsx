import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'ACDF Swallowing Outcomes \u2014 Interactive Research Platform',
  description: 'Interactive visualization of ACDF swallowing outcomes \u2014 Jones-Rastelli et al., Laryngoscope 2025',
  openGraph: {
    title: 'ACDF Swallowing Outcomes \u2014 Interactive Research Platform',
    description: 'Comparing VFSS and patient-reported swallowing outcomes pre- and post-ACDF surgery.',
    type: 'website',
  },
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>\ud83d\udcca</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: 'var(--font-sans)' }}>
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <div className="app">
          <Sidebar />
          <main className="main" id="main-content">
            <div className="page-wrap">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
