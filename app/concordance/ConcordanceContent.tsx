'use client';

import '@/lib/chartSetup';
import type { Plugin } from 'chart.js';
import { Bar, Scatter, Radar } from 'react-chartjs-2';
import { measLabels, agreeMatrix, D } from '@/lib/data';

const pairs: [number, number, string][] = [];
for (let i = 0; i < measLabels.length; i++) {
  for (let j = i + 1; j < measLabels.length; j++) {
    pairs.push([i, j, `${measLabels[i]} \u00d7 ${measLabels[j]}`]);
  }
}
pairs.sort((a, b) => agreeMatrix[b[0]][b[1]] - agreeMatrix[a[0]][a[1]]);

const heatLabels = ['DIGEST', 'MBSImP', 'EAT-10', 'SWAL-Q', 'Bazaz', 'HSS-DDI'];

const heatmapPlugin: Plugin<'scatter'> = {
  id: 'heatmapLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const dataset = chart.data.datasets[0];
    meta.data.forEach((point, i) => {
      const raw = dataset.data[i] as unknown as { v: number };
      ctx.save();
      ctx.fillStyle = '#e2e8f4';
      ctx.font = 'bold 10px Inter,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(raw.v), point.x, point.y);
      ctx.restore();
    });
  },
};

const proKeys = ['eat10', 'swalqol', 'bazaz', 'hssddi'];
const proLabels = proKeys.map(k => D[k].label);

export default function ConcordanceContent() {
  return (
    <>
      <div className="section-label">Agreement Patterns</div>
      <h2 className="page-title">Concordance Analysis</h2>
      <p className="page-desc">Examining how well different measures agree on which patients worsened post-ACDF. PROs cluster together while VFSS measures show more divergence.</p>

      <div className="grid-2 mb-1-5">
        <div className="card">
          <h3 className="chart-heading-sm">Pairwise Agreement (%)</h3>
          {pairs.map(([i, j, label]) => {
            const pct = agreeMatrix[i][j];
            const color = pct >= 75 ? 'var(--green)' : pct >= 55 ? 'var(--amber)' : 'var(--red)';
            return (
              <div className="conc-row" key={label}>
                <div className="conc-pair">{label}</div>
                <div className="conc-bar">
                  <div className="conc-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
                <div className="conc-pct" style={{ color }}>{pct}%</div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <h3 className="chart-heading-sm">Agreement Heatmap</h3>
          <div className="chart-wrap" style={{ aspectRatio: '1/1' }}>
            <Scatter
              data={{
                datasets: (() => {
                  const pts: { x: number; y: number; v: number }[] = [];
                  for (let i = 0; i < measLabels.length; i++) {
                    for (let j = 0; j < measLabels.length; j++) {
                      pts.push({ x: j, y: measLabels.length - 1 - i, v: agreeMatrix[i][j] });
                    }
                  }
                  return [{
                    data: pts,
                    backgroundColor: pts.map(p => {
                      const a = p.v / 100;
                      return p.v >= 75 ? `rgba(52,211,153,${.3 + a * .5})` : p.v >= 55 ? `rgba(251,191,36,${.3 + a * .4})` : `rgba(248,113,113,${.3 + a * .4})`;
                    }),
                    pointRadius: 18,
                    pointHoverRadius: 21,
                  }];
                })()
              }}
              options={{
                responsive: true, maintainAspectRatio: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => {
                        const p = ctx.raw as { x: number; y: number; v: number };
                        const r = measLabels[measLabels.length - 1 - p.y];
                        const c = measLabels[p.x];
                        return `${r} \u00d7 ${c}: ${p.v}%`;
                      }
                    }
                  },
                },
                scales: {
                  x: {
                    type: 'linear', min: -.5, max: measLabels.length - .5,
                    ticks: { stepSize: 1, callback: (v) => heatLabels[v as number] || '', font: { size: 10 } },
                    grid: { color: 'rgba(38,51,84,.15)' },
                  },
                  y: {
                    type: 'linear', min: -.5, max: measLabels.length - .5,
                    ticks: { stepSize: 1, callback: (v) => heatLabels[measLabels.length - 1 - (v as number)] || '', font: { size: 10 } },
                    grid: { color: 'rgba(38,51,84,.15)' },
                  },
                },
              }}
              plugins={[heatmapPlugin]}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '.75rem', fontSize: '.72rem', color: 'var(--text-muted)' }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'rgba(52,211,153,.7)', marginRight: '.3rem' }} />&ge;75% Strong</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'rgba(251,191,36,.6)', marginRight: '.3rem' }} />55&ndash;74% Moderate</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'rgba(248,113,113,.6)', marginRight: '.3rem' }} />&lt;55% Low</span>
          </div>
        </div>
      </div>

      <div className="grid-2 mb-1-5">
        <div className="card">
          <h3 className="chart-heading-sm">VFSS vs PRO Agreement Distribution</h3>
          <div className="chart-wrap" style={{ aspectRatio: '16/10' }}>
            <Bar
              data={{
                labels: ['DIGEST\u00d7EAT-10', 'DIGEST\u00d7SWAL-QoL', 'DIGEST\u00d7Bazaz', 'DIGEST\u00d7HSS-DDI', 'MBSImP\u00d7EAT-10', 'MBSImP\u00d7SWAL-QoL', 'MBSImP\u00d7Bazaz', 'MBSImP\u00d7HSS-DDI'],
                datasets: [{
                  label: 'Agreement %',
                  data: [agreeMatrix[0][2], agreeMatrix[0][3], agreeMatrix[0][4], agreeMatrix[0][5], agreeMatrix[1][2], agreeMatrix[1][3], agreeMatrix[1][4], agreeMatrix[1][5]],
                  backgroundColor: 'rgba(108,156,255,.5)',
                  borderRadius: 4,
                }]
              }}
              options={{
                responsive: true, maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: i => `Agreement: ${i.raw}%` } } },
                scales: {
                  x: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(38,51,84,.3)' } },
                  y: { grid: { display: false }, ticks: { font: { size: 11 } } },
                }
              }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="chart-heading-sm">PRO Cluster Radar</h3>
          <div className="radar-wrap">
            <Radar
              data={{
                labels: proLabels,
                datasets: [
                  {
                    label: 'PRO Worsening %',
                    data: proKeys.map(k => {
                      const d = D[k];
                      const mcid = d.mcid;
                      const worseCount = d.post.filter((v, i) => k === 'swalqol' ? (v - d.pre[i]) <= mcid : (v - d.pre[i]) >= mcid).length;
                      return +(worseCount / d.pre.length * 100).toFixed(0);
                    }),
                    borderColor: 'rgba(167,139,250,.8)',
                    backgroundColor: 'rgba(167,139,250,.15)',
                    pointBackgroundColor: '#a78bfa',
                    pointRadius: 5,
                  },
                  {
                    label: 'Agreement with DIGEST',
                    data: proKeys.map((_, i) => agreeMatrix[0][i + 2]),
                    borderColor: 'rgba(108,156,255,.8)',
                    backgroundColor: 'rgba(108,156,255,.15)',
                    pointBackgroundColor: '#6c9cff',
                    pointRadius: 5,
                  },
                ]
              }}
              options={{
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'top' } },
                scales: {
                  r: {
                    beginAtZero: true, max: 100,
                    ticks: { display: false },
                    grid: { color: 'rgba(38,51,84,.3)' },
                    pointLabels: { font: { size: 11, weight: 600 as const } },
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="interp">
        <h4>Key Insight</h4>
        <p>PROs show <strong>high internal agreement</strong> (67\u201381%) but only <strong>moderate concordance with VFSS</strong> (46\u201357%). This pattern supports that patient-reported symptoms and observed physiological changes <strong>capture partially overlapping but distinct constructs</strong> of swallowing function.</p>
      </div>
      <div className="page-footer">Jones-Rastelli et al. (2025) &middot; <em>Laryngoscope</em> &middot; Molfenter Lab, NYU</div>
    </>
  );
}
