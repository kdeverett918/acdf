'use client';

import { useState } from 'react';
import '@/lib/chartSetup';
import { Bar } from 'react-chartjs-2';
import { D } from '@/lib/data';

interface CalcItem {
  label: string;
  options: string[];
  values?: number[];
}

interface Instrument {
  key: string;
  label: string;
  scale: string;
  max: number;
  items: CalcItem[];
  calc: (vals: number[]) => number;
  interp: (s: number) => [string, string];
}

const digestLookup = [[0,1,2],[1,2,3],[2,3,4]];

const instruments: Instrument[] = [
  {
    key: 'digest', label: 'DIGEST', scale: '0\u20134', max: 4,
    items: [
      { label: 'Safety Profile (PAS)', options: ['0 \u2013 No aspiration', '1 \u2013 Penetration / trace', '2 \u2013 Aspiration'] },
      { label: 'Efficiency Profile (Residue)', options: ['0 \u2013 No residue', '1 \u2013 Mild residue', '2 \u2013 Severe residue'] },
    ],
    calc: (vals: number[]) => digestLookup[vals[0]][vals[1]],
    interp: (s: number) => s === 0 ? ['Normal', 'score-normal'] : s <= 1 ? ['Mild', 'score-mild'] : s <= 2 ? ['Moderate', 'score-moderate'] : ['Severe', 'score-severe'],
  },
  {
    key: 'eat10', label: 'EAT-10', scale: '0\u201340', max: 40,
    items: Array.from({ length: 10 }, (_, i) => ({
      label: ['Weight loss', 'Going out for meals', 'Swallowing liquids', 'Swallowing solids', 'Swallowing pills',
              'Swallowing is painful', 'Pleasure of eating', 'Food sticks in throat', 'Coughing when eating', 'Swallowing is stressful'][i],
      options: ['0 \u2013 No problem', '1 \u2013 Minor', '2 \u2013 Moderate', '3 \u2013 Severe', '4 \u2013 Worst']
    })),
    calc: (vals: number[]) => vals.reduce((a, b) => a + b, 0),
    interp: (s: number) => s < 3 ? ['Normal', 'score-normal'] : s < 15 ? ['Abnormal (\u22653)', 'score-mild'] : s < 30 ? ['Moderate\u2013Severe', 'score-moderate'] : ['Severe', 'score-severe'],
  },
  {
    key: 'bazaz', label: 'Bazaz', scale: '0\u20133', max: 3,
    items: [{ label: 'Dysphagia Severity', options: ['0 \u2013 None', '1 \u2013 Mild (rare)', '2 \u2013 Moderate (occasional solids)', '3 \u2013 Severe (frequent / liquids)'] }],
    calc: (vals: number[]) => vals[0],
    interp: (s: number) => s === 0 ? ['None', 'score-normal'] : s === 1 ? ['Mild', 'score-mild'] : s === 2 ? ['Moderate', 'score-moderate'] : ['Severe', 'score-severe'],
  },
  {
    key: 'hssddi', label: 'HSS-DDI', scale: '0\u2013100', max: 100,
    items: Array.from({ length: 10 }, (_, i) => ({
      label: ['Difficulty swallowing solids', 'Difficulty swallowing liquids', 'Choking episodes', 'Voice changes',
              'Pain with swallowing', 'Diet modification', 'Eating slower', 'Throat clearing', 'Globus sensation', 'Aspiration concern'][i],
      options: ['0 \u2013 Not at all', '1\u20133 \u2013 Mild', '4\u20136 \u2013 Moderate', '7\u201310 \u2013 Severe'],
      values: [0, 3, 6, 10],
    })),
    calc: (vals: number[]) => vals.reduce((a, b) => a + b, 0),
    interp: (s: number) => s < 12 ? ['Minimal', 'score-normal'] : s < 30 ? ['Mild', 'score-mild'] : s < 60 ? ['Moderate', 'score-moderate'] : ['Severe', 'score-severe'],
  },
];

export default function CalculatorContent() {
  const [active, setActive] = useState(0);
  const inst = instruments[active];
  const [vals, setVals] = useState<number[]>(inst.items.map(() => 0));

  const handleTab = (i: number) => {
    setActive(i);
    setVals(instruments[i].items.map(() => 0));
  };

  const score = inst.calc(vals);
  const [interpLabel, interpClass] = inst.interp(score);

  const d = D[inst.key];
  const distLabels = d.pre.map((_, i) => `P${String(i + 1).padStart(2, '0')}`);

  return (
    <>
      <div className="section-label">Clinical Tools</div>
      <h2 className="page-title">Score Calculators</h2>
      <p className="page-desc">Calculate scores for each instrument and see how they compare to the study cohort distribution.</p>

      <div className="tab-row" role="tablist">
        {instruments.map((tab, i) => (
          <button key={tab.key} role="tab" aria-selected={active === i} className={`tab-btn${active === i ? ' active' : ''}`} onClick={() => handleTab(i)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '.75rem', fontSize: '.95rem' }}>{inst.label} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>({inst.scale})</span></h3>
          {inst.items.map((item, i) => (
            <div className="form-group" key={i}>
              <label>{item.label}</label>
              <select
                value={vals[i]}
                onChange={e => { const nv = [...vals]; nv[i] = parseInt(e.target.value, 10); setVals(nv); }}
              >
                {item.options.map((opt, j) => (
                  <option key={j} value={item.values ? item.values[j] : j}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
          <div className={`score-result ${interpClass}`}>
            <div className="score-val">{score}</div>
            <div className="score-label">{inst.label} Score (max {inst.max})</div>
            <div className="score-interp">{interpLabel}</div>
          </div>
        </div>

        <div className="card">
          <h3 className="chart-heading-sm">Study Cohort Distribution (Post-Op)</h3>
          <div className="chart-wrap" style={{ aspectRatio: '16/10' }}>
            <Bar
              data={{
                labels: distLabels,
                datasets: [{
                  label: 'Post-op Score',
                  data: d.post,
                  backgroundColor: d.post.map(v => v >= score && score > 0 ? 'rgba(108,156,255,.7)' : 'rgba(108,156,255,.25)'),
                  borderRadius: 3,
                }]
              }}
              options={{
                responsive: true, maintainAspectRatio: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { callbacks: { label: i => `Score: ${i.raw}` } },
                },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                  y: { beginAtZero: true, title: { display: true, text: inst.label + ' Score' }, grid: { color: 'rgba(38,51,84,.3)' } },
                }
              }}
            />
          </div>
          <p style={{ fontSize: '.78rem', color: 'var(--text-dim)', marginTop: '.75rem', textAlign: 'center' }}>
            Highlighted bars show patients at or above your calculated score.
          </p>
        </div>
      </div>
    </>
  );
}
