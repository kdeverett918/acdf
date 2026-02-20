'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import '@/lib/chartSetup';
import { Radar } from 'react-chartjs-2';
import { D, patients, measKeys, measLabels, maxScales } from '@/lib/data';

export default function PatientExplorer() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const sel = searchParams.get('select');
    if (sel !== null) setSelected(parseInt(sel, 10));
  }, [searchParams]);

  const filterCounts: Record<string, number> = { all: patients.length, worse: 0, stable: 0, improved: 0 };
  patients.forEach(pt => { if (pt.digestDir in filterCounts) filterCounts[pt.digestDir]++; });

  const p = selected !== null ? patients[selected] : null;

  const radarData = p ? (() => {
    const pre: number[] = [], post: number[] = [];
    measKeys.forEach(k => {
      const mx = maxScales[k];
      if (k === 'swalqol') { pre.push((100 - (p[k + '_pre'] as number)) / 100 * 100); post.push((100 - (p[k + '_post'] as number)) / 100 * 100); }
      else { pre.push((p[k + '_pre'] as number) / mx * 100); post.push((p[k + '_post'] as number) / mx * 100); }
    });
    return { pre, post };
  })() : null;

  return (
    <>
      <div className="card mb-1-5">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '.82rem', fontWeight: 600 }}>Filter:</span>
          {['all', 'worse', 'stable', 'improved'].map(f => (
            <button key={f} className={`btn filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {`${f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} (${filterCounts[f]})`}
            </button>
          ))}
        </div>
        <div className="patient-grid">
          {patients.filter(pt => filter === 'all' || pt.digestDir === filter).map(pt => (
            <div key={pt.id} className={`patient-chip ${pt.digestDir}${selected === pt.id - 1 ? ' selected' : ''}`}
              tabIndex={0} role="button" aria-label={`Patient ${pt.id}, DIGEST ${pt.digestDir}`}
              onClick={() => setSelected(pt.id - 1)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(pt.id - 1); } }}>
              {pt.label}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ minHeight: 320 }}>
          {!p ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '.85rem', textAlign: 'center', marginTop: '4rem' }}>Select a patient above to view their profile</p>
          ) : (
            <>
              <h3 style={{ marginBottom: '1rem' }}>{p.label} &mdash; Outcome Profile</h3>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {measKeys.map((k, i) => {
                  const ch = p[k + '_change'] as string;
                  const cls = ch === 'worse' ? 'badge-red' : ch === 'improved' ? 'badge-green' : 'badge-accent';
                  return <span key={k} className={`badge ${cls}`}>{measLabels[i]}: {ch}</span>;
                })}
              </div>
              {Object.keys(D).map(k => {
                const d = D[k];
                const pre = p[k + '_pre'] as number, post = p[k + '_post'] as number, diff = post - pre;
                const changeDir = p[k + '_change'] as string;
                const color = changeDir === 'worse' ? 'var(--red)' : changeDir === 'improved' ? 'var(--green)' : 'var(--accent)';
                const maxVal = maxScales[k];
                return (
                  <div key={k} style={{ marginBottom: '.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '.8rem', fontWeight: 600 }}>{d.label}</span>
                      <span style={{ fontSize: '.8rem', fontWeight: 700, color }}>{pre} &rarr; {post} ({diff > 0 ? '+' : ''}{diff})</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, marginTop: '.3rem', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(Math.abs(diff) / maxVal * 100, 100)}%`, background: color, borderRadius: 3, transition: 'width .6s' }} />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className="card">
          <h3 className="chart-heading-sm">Patient Outcome Radar</h3>
          <div className="radar-wrap">
            {radarData ? (
              <Radar
                data={{
                  labels: measLabels,
                  datasets: [
                    { label: 'Pre-op', data: radarData.pre, borderColor: 'rgba(108,156,255,.8)', backgroundColor: 'rgba(108,156,255,.15)', pointBackgroundColor: '#6c9cff', pointRadius: 4 },
                    { label: 'Post-op', data: radarData.post, borderColor: 'rgba(248,113,113,.8)', backgroundColor: 'rgba(248,113,113,.15)', pointBackgroundColor: '#f87171', pointRadius: 4 },
                  ]
                }}
                options={{
                  responsive: true, maintainAspectRatio: true,
                  plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: i => `${i.dataset.label}: ${(i.raw as number).toFixed(0)}% of max severity` } } },
                  scales: { r: { beginAtZero: true, max: 100, ticks: { display: false }, grid: { color: 'rgba(38,51,84,.3)' }, pointLabels: { font: { size: 11, weight: 600 as const } } } }
                }}
              />
            ) : <p style={{ color: 'var(--text-dim)', fontSize: '.85rem', textAlign: 'center', marginTop: '4rem' }}>Select a patient to see radar</p>}
          </div>
        </div>
      </div>

      <div className="card mt-1-5">
        <h3 className="chart-heading-sm">Outcome Alignment Matrix &mdash; All Patients</h3>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${measKeys.length},1fr)`, gap: 2, minWidth: 600 }}>
            {['', ...measLabels].map((h, i) => (
              <div key={i} style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.05em', color: 'var(--text-dim)', padding: '.5rem .35rem', textAlign: 'center', borderBottom: '2px solid var(--border)' }}>{h}</div>
            ))}
            {patients.map(pt => (
              <React.Fragment key={pt.id}>
                <div style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'grid', placeItems: 'center', padding: '.35rem', cursor: 'pointer' }}
                  tabIndex={0} role="button" onClick={() => setSelected(pt.id - 1)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(pt.id - 1); } }}>
                  {pt.label}
                </div>
                {measKeys.map(m => {
                  const v = pt[m + '_change'] as string;
                  const bg = v === 'worse' ? 'rgba(248,113,113,.15)' : v === 'improved' ? 'rgba(52,211,153,.15)' : 'rgba(108,156,255,.1)';
                  const col = v === 'worse' ? 'var(--red)' : v === 'improved' ? 'var(--green)' : 'var(--accent)';
                  const sym = v === 'worse' ? '\u2715' : v === 'improved' ? '\u2713' : '\u2013';
                  return (
                    <div key={m} style={{ padding: '.35rem', display: 'grid', placeItems: 'center' }}>
                      <div
                        style={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '.65rem', fontWeight: 700, background: bg, color: col }}
                        title={`${pt.label} ${m}: ${v}`}
                        aria-label={`${pt.label} ${m}: ${v}`}
                        role="img"
                      >{sym}</div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '.75rem', color: 'var(--text-muted)' }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', marginRight: '.3rem' }} />{'\u2713'} Improved</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', marginRight: '.3rem' }} />{'\u2013'} Stable</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--red)', marginRight: '.3rem' }} />{'\u2715'} Worsened</span>
          </div>
        </div>
      </div>
    </>
  );
}
