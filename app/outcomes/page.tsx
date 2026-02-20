'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/lib/chartSetup';
import { Bar } from 'react-chartjs-2';
import { D } from '@/lib/data';

const allKeys = Object.keys(D);

export default function OutcomeExplorer() {
  const [active, setActive] = useState('digest');
  const router = useRouter();
  const d = D[active];
  const labels = d.pre.map((_, i) => `P${String(i + 1).padStart(2, '0')}`);
  const isSQ = active === 'swalqol';
  const changes = d.post.map((v, i) => v - d.pre[i]);
  const diff = isSQ ? (d.preMean - d.postMean).toFixed(1) : (d.postMean - d.preMean).toFixed(1);
  const arrow = isSQ ? '\u2193' : '\u2191';

  return (
    <>
      <div className="section-label">Interactive Exploration</div>
      <h2 className="page-title">Outcome Explorer</h2>
      <p className="page-desc">Select any measure to see per-patient pre/post data, statistics, and clinical context. Click individual patient bars for detail.</p>

      <div className="tab-row" role="tablist">
        {allKeys.map(k => (
          <button key={k} role="tab" aria-selected={active === k} className={`tab-btn${active === k ? ' active' : ''}`} onClick={() => setActive(k)}>
            {D[k].label}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="chart-wrap" style={{ aspectRatio: '16/10' }}>
            <Bar
              data={{ labels, datasets: [
                { label: 'Pre-op', data: d.pre, backgroundColor: 'rgba(108,156,255,.6)', borderRadius: 3 },
                { label: 'Post-op', data: d.post, backgroundColor: 'rgba(248,113,113,.6)', borderRadius: 3 },
              ]}}
              options={{
                responsive: true, maintainAspectRatio: true,
                interaction: { mode: 'index' as const, intersect: false },
                onClick: (_e, els) => { if (els.length) router.push(`/patients?select=${els[0].index}`); },
                plugins: { legend: { position: 'top' }, tooltip: { callbacks: { title: i => `Patient ${i[0].label}` } } },
                scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { beginAtZero: true, reverse: isSQ, title: { display: true, text: d.label + ' Score' }, grid: { color: 'rgba(38,51,84,.3)' } } }
              }}
            />
          </div>
        </div>
        <div className="card">
          <div className="section-label" style={{ marginBottom: '.25rem' }}>{d.type}</div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '.25rem' }}>{d.fullName}</h3>
          <p style={{ fontSize: '.75rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>Scale: {d.scale} &middot; {d.dir}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '.85rem', background: 'rgba(108,156,255,.06)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>{d.preMean}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Pre-op Mean (SD: {d.preSD})</div>
            </div>
            <div style={{ textAlign: 'center', padding: '.85rem', background: 'rgba(248,113,113,.06)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--red)' }}>{d.postMean}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Post-op Mean (SD: {d.postSD})</div>
            </div>
          </div>
          <div style={{ padding: '.65rem .85rem', background: 'rgba(248,113,113,.06)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--red)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--red)' }}>{arrow} {diff} point change</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>p = {d.p} &middot; MCID: {Math.abs(d.mcid)}</div>
          </div>
          <p style={{ fontSize: '.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{d.desc}</p>
          <p style={{ fontSize: '.75rem', color: 'var(--text-dim)', marginTop: '.75rem', fontStyle: 'italic' }}>Click any chart bar to jump to Patient Explorer for that individual.</p>
        </div>
      </div>

      <div className="card mt-1-5">
        <h3 className="chart-heading-sm">Individual Change Scores (Post minus Pre)</h3>
        <div className="chart-wrap" style={{ aspectRatio: '2/1' }}>
          <Bar
            data={{ labels, datasets: [{
              label: 'Change (Post - Pre)', data: changes,
              backgroundColor: changes.map(c => c === 0 ? 'rgba(108,156,255,.35)' : isSQ ? (c < 0 ? 'rgba(248,113,113,.6)' : 'rgba(52,211,153,.6)') : (c > 0 ? 'rgba(248,113,113,.6)' : 'rgba(52,211,153,.6)')),
              borderRadius: 3,
            }]}}
            options={{
              responsive: true, maintainAspectRatio: true,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: i => `Change: ${(i.raw as number) > 0 ? '+' : ''}${i.raw}` } } },
              scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { title: { display: true, text: 'Score Change' }, grid: { color: 'rgba(38,51,84,.3)' } } }
            }}
          />
        </div>
      </div>
    </>
  );
}
