'use client';

import { useState, useMemo } from 'react';
import '@/lib/chartSetup';
import { Bar } from 'react-chartjs-2';
import { seededRandom } from '@/lib/data';

interface SimResults {
  digestRisk: number;
  proRisk: number;
  discordance: number;
  measures: { label: string; risk: number }[];
}

function runSimulation(age: number, levels: number, preDigest: number, prePRO: number): SimResults {
  const seed = age * 1000 + levels * 100 + preDigest * 10 + prePRO;
  const rng = seededRandom(seed);
  const base = 30 + levels * 8 + preDigest * 10 + prePRO * 5 + (age > 60 ? 10 : age > 50 ? 5 : 0);
  const digestRisk = Math.min(Math.max(base + (rng() - .5) * 20, 5), 95);
  const proRisk = Math.min(Math.max(base * 1.6 + (rng() - .5) * 15, 10), 98);
  const discordance = Math.abs(proRisk - digestRisk);

  const measures = [
    { label: 'DIGEST Worsening', risk: digestRisk },
    { label: 'EAT-10 Worsening', risk: Math.min(proRisk + (rng() - .5) * 10, 98) },
    { label: 'SWAL-QoL Decline', risk: Math.min(proRisk + (rng() - .5) * 8, 98) },
    { label: 'Bazaz Worsening', risk: Math.min(proRisk * .95 + (rng() - .5) * 10, 98) },
    { label: 'HSS-DDI Worsening', risk: Math.min(proRisk * .9 + (rng() - .5) * 12, 98) },
  ];

  return { digestRisk, proRisk, discordance, measures };
}

export default function SimulatorContent() {
  const [age, setAge] = useState(52);
  const [levels, setLevels] = useState(2);
  const [preDigest, setPreDigest] = useState(0);
  const [prePRO, setPrePRO] = useState(1);
  const [ran, setRan] = useState(false);
  const [lastParams, setLastParams] = useState('');

  const currentParams = `${age}-${levels}-${preDigest}-${prePRO}`;

  const results = useMemo(() => {
    if (!ran) return null;
    return runSimulation(age, levels, preDigest, prePRO);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ran, lastParams]);

  const isStale = ran && currentParams !== lastParams;

  const handleSimulate = () => {
    setRan(true);
    setLastParams(currentParams);
  };

  const overallRisk = results ? (results.digestRisk + results.proRisk) / 2 : 0;
  const greenW = Math.max(100 - overallRisk * 1.2, 5);
  const amberW = Math.min(overallRisk * .6, 45);
  const redW = Math.max(100 - greenW - amberW, 0);

  return (
    <>
      <div className="section-label">Simulation</div>
      <h2 className="page-title">Risk Simulator</h2>
      <p className="page-desc">Adjust patient parameters to estimate post-ACDF swallowing outcome risk. Results are deterministic model estimates based on cohort patterns.</p>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '.95rem' }}>Patient Parameters</h3>
          <div className="form-group">
            <label>Age <span className="range-val">{age}</span></label>
            <input type="range" min={30} max={80} value={age} onChange={e => setAge(+e.target.value)} />
          </div>
          <div className="form-group">
            <label>Surgical Levels <span className="range-val">{levels}</span></label>
            <input type="range" min={1} max={4} value={levels} onChange={e => setLevels(+e.target.value)} />
          </div>
          <div className="form-group">
            <label>Pre-Op DIGEST <span className="range-val">{preDigest}</span></label>
            <input type="range" min={0} max={4} value={preDigest} onChange={e => setPreDigest(+e.target.value)} />
          </div>
          <div className="form-group">
            <label>Pre-Op PRO Severity <span className="range-val">{['None', 'Mild', 'Moderate', 'Severe'][prePRO]}</span></label>
            <input type="range" min={0} max={3} value={prePRO} onChange={e => setPrePRO(+e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '.5rem' }} onClick={handleSimulate}>
            {isStale ? 'Update Simulation' : 'Run Simulation'}
          </button>
        </div>

        <div className="card" style={{ minHeight: 320, position: 'relative' }}>
          {!results ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '.85rem', textAlign: 'center', marginTop: '5rem' }}>
              Adjust parameters and click &ldquo;Run Simulation&rdquo; to see risk estimates.
            </p>
          ) : (
            <>
              {isStale && (
                <div style={{ padding: '.5rem .75rem', background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.2)', borderRadius: 'var(--radius-xs)', marginBottom: '.75rem', fontSize: '.75rem', color: 'var(--amber)' }}>
                  Parameters changed &mdash; click &ldquo;Update Simulation&rdquo; to refresh results.
                </div>
              )}
              <h3 style={{ marginBottom: '.75rem', fontSize: '.95rem', opacity: isStale ? .6 : 1 }}>Risk Estimate</h3>
              <div className="risk-meter" role="img" aria-label={`Overall risk: ${overallRisk.toFixed(0)}%`} style={{ opacity: isStale ? .5 : 1 }}>
                <div className="risk-seg" style={{ width: `${greenW}%`, background: 'var(--green)' }} />
                <div className="risk-seg" style={{ width: `${amberW}%`, background: 'var(--amber)' }} />
                <div className="risk-seg" style={{ width: `${redW}%`, background: 'var(--red)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.7rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
                <span>Low Risk</span><span>High Risk</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.75rem', marginBottom: '1.25rem', opacity: isStale ? .5 : 1 }}>
                <div style={{ textAlign: 'center', padding: '.75rem', background: 'rgba(108,156,255,.06)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{results.digestRisk.toFixed(0)}%</div>
                  <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>VFSS Risk</div>
                </div>
                <div style={{ textAlign: 'center', padding: '.75rem', background: 'rgba(167,139,250,.06)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple)' }}>{results.proRisk.toFixed(0)}%</div>
                  <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>PRO Risk</div>
                </div>
                <div style={{ textAlign: 'center', padding: '.75rem', background: 'rgba(251,191,36,.06)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber)' }}>{results.discordance.toFixed(0)}%</div>
                  <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>Discordance</div>
                </div>
              </div>

              <div className="interp" style={{ marginTop: 0, padding: '1rem', opacity: isStale ? .5 : 1 }}>
                <p style={{ fontSize: '.8rem', marginBottom: 0 }}>
                  {results.proRisk > results.digestRisk + 15
                    ? 'PROs predict substantially greater worsening than VFSS \u2014 consistent with the study\'s central finding of patient-reported sensitivity.'
                    : results.discordance < 10
                    ? 'Relatively concordant risk estimates across measure types for this patient profile.'
                    : 'Moderate discordance between VFSS and PRO risk \u2014 clinical monitoring with both measure types recommended.'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {results && (
        <div className="card mt-1-5" style={{ opacity: isStale ? .5 : 1, transition: 'opacity .3s' }}>
          <h3 className="chart-heading-sm">Per-Measure Risk Breakdown</h3>
          <div className="chart-wrap" style={{ aspectRatio: '2.5/1' }}>
            <Bar
              data={{
                labels: results.measures.map(m => m.label),
                datasets: [{
                  label: 'Risk %',
                  data: results.measures.map(m => +m.risk.toFixed(1)),
                  backgroundColor: results.measures.map(m => m.risk > 60 ? 'rgba(248,113,113,.6)' : m.risk > 40 ? 'rgba(251,191,36,.6)' : 'rgba(52,211,153,.6)'),
                  borderRadius: 4,
                }]
              }}
              options={{
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: i => `Risk: ${i.raw}%` } } },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(38,51,84,.3)' } },
                }
              }}
            />
          </div>
        </div>
      )}

      <div className="interp">
        <h4>Disclaimer</h4>
        <p>This simulator provides <strong>illustrative estimates only</strong> based on patterns from a small (N=21) cohort. It is not a validated clinical prediction tool and should not be used for individual patient decision-making.</p>
      </div>
    </>
  );
}
