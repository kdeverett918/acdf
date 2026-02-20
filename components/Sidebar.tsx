'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { section: 'Study' },
  { page: '/', label: 'Dashboard', icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> },
  { page: '/outcomes', label: 'Outcome Explorer', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
  { page: '/prevalence', label: 'Prevalence & Incidence', icon: <><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></> },
  { section: 'Interactive Tools' },
  { page: '/patients', label: 'Patient Explorer', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { page: '/calculator', label: 'Score Calculators', icon: <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></> },
  { page: '/simulator', label: 'Risk Simulator', icon: <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></> },
  { page: '/concordance', label: 'Concordance Analysis', icon: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></> },
  { section: 'Reference' },
  { page: '/about', label: 'About & Citation', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation menu">
        <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <div className="logo">ACDF Outcomes</div>
          <div className="sub">Interactive Research Platform</div>
        </div>
        <nav className="sidebar-nav" aria-label="Section navigation">
          {navItems.map((item, i) => {
            if ('section' in item && item.section) {
              return <div key={i} className="nav-section">{item.section}</div>;
            }
            const isActive = pathname === item.page;
            return (
              <Link
                key={item.page}
                href={item.page!}
                className={`nav-item${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', fontSize: '.68rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
          Molfenter Lab &middot; NYU<br />Research Platform v2.0
        </div>
      </aside>

      {open && (
        <div
          className="sidebar-backdrop"
          onClick={() => setOpen(false)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(false); }}
          role="button"
          aria-label="Close navigation"
          tabIndex={0}
        />
      )}
    </>
  );
}
