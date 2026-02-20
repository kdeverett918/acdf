'use client';

import '@/lib/chartSetup';
import { Bar } from 'react-chartjs-2';
import { D, maxScales } from '@/lib/data';

const keys = Object.keys(D);
const normPre = keys.map(k => { const v = D[k].preMean, mx = maxScales[k]; return k === 'swalqol' ? ((100 - v) / 100 * 100) : ((v / mx) * 100); });
const normPost = keys.map(k => { const v = D[k].postMean, mx = maxScales[k]; return k === 'swalqol' ? ((100 - v) / 100 * 100) : ((v / mx) * 100); });

export default function DashboardContent() {
  return (
    <>
      <div className="section-label">Jones-Rastelli et al. (2025) &middot; Laryngoscope &middot; DOI: 10.1002/lary.32352</div>
      <h1 className="page-title">ACDF Swallowing Outcomes</h1>
      <p className="page-desc">
        Comparing videofluoroscopic (VFSS) and patient-reported outcome measures of swallowing
        pre- to six weeks post ACDF surgery in 21 prospectively recruited patients.
      </p>
      <p style={{ fontSize: '.82rem', color: 'var(--text-dim)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text-muted)' }}>R. Brynn Jones-Rastelli</strong><sup>1,2</sup> &middot;{' '}
        <strong style={{ color: 'var(--text-muted)' }}>Milan R. Amin</strong><sup>2</sup> &middot;{' '}
        <strong style={{ color: 'var(--text-muted)' }}>Mridula Anandhakrishnan</strong><sup>1</sup> &middot;{' '}
        <strong style={{ color: 'var(--text-muted)' }}>Matina Balou</strong><sup>2</sup> &middot;{' '}
        <strong style={{ color: 'var(--text-muted)' }}>Claire Crossman</strong><sup>1,2</sup> &middot;{' '}
        <strong style={{ color: 'var(--text-muted)' }}>Erica G. Herzberg</strong><sup>2</sup> &middot;{' '}
        <strong style={{ color: 'var(--text-muted)' }}>Aaron M. Johnson</strong><sup>2</sup> &middot;{' '}
        <strong style={{ color: 'var(--accent)' }}>Sonja M. Molfenter</strong><sup>1,2</sup>
        <br /><span style={{ fontSize: '.72rem' }}><sup>1</sup> NYU Steinhardt &nbsp; <sup>2</sup> NYU Grossman School of Medicine</span>
      </p>

      <div className="grid-4 mb-2">
        <div className="card stat-card"><div className="num" style={{ color: 'var(--accent)' }}>21</div><div className="lbl">Participants</div></div>
        <div className="card stat-card" title="All 6 outcome measures showed statistically significant worsening post-ACDF (p < .05)"><div className="num" style={{ color: 'var(--red)' }}>6/6</div><div className="lbl">All Measures Sig. Worsened</div></div>
        <div className="card stat-card"><div className="num" style={{ color: 'var(--amber)' }}>2&times;</div><div className="lbl">PRO vs VFSS Incidence</div></div>
        <div className="card stat-card"><div className="num" style={{ color: 'var(--purple)' }}>&ne;</div><div className="lbl">Patient-Level Agreement</div></div>
      </div>

      <div className="grid-2 mb-1-5">
        <div className="card">
          <h3 className="chart-heading">Pre vs Post-Op Severity (Normalized % of Scale)</h3>
          <div className="chart-wrap" style={{ aspectRatio: '16/9' }}>
            <Bar
              data={{
                labels: keys.map(k => D[k].label),
                datasets: [
                  { label: 'Pre-op Severity', data: normPre.map(v => +v.toFixed(1)), backgroundColor: 'rgba(108,156,255,.6)', borderRadius: 4 },
                  { label: 'Post-op Severity', data: normPost.map(v => +v.toFixed(1)), backgroundColor: 'rgba(248,113,113,.6)', borderRadius: 4 },
                ]
              }}
              options={{
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: i => `${i.dataset.label}: ${i.raw}% of max severity` } } },
                scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(38,51,84,.3)' } } }
              }}
            />
          </div>
        </div>
        <div className="card">
          <h3 className="chart-heading">Detection Sensitivity Gap</h3>
          <div className="chart-wrap" style={{ aspectRatio: '16/9' }}>
            <Bar
              data={{
                labels: ['DIGEST', 'Bazaz', 'EAT-10', 'SWAL-QoL', 'HSS-DDI'],
                datasets: [
                  { label: 'VFSS Incidence', data: [29, null, null, null, null], backgroundColor: 'rgba(108,156,255,.6)', borderRadius: 4 },
                  { label: 'PRO Incidence', data: [null, 59, 53, 59, 47], backgroundColor: 'rgba(167,139,250,.6)', borderRadius: 4 },
                ]
              }}
              options={{
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: i => `${i.dataset.label}: ${i.raw}%` } } },
                scales: { x: { grid: { display: false }, stacked: true }, y: { stacked: true, beginAtZero: true, max: 70, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(38,51,84,.3)' } } }
              }}
            />
          </div>
        </div>
      </div>

      <div className="card mb-1-5">
        <h3 className="chart-heading">Study Design</h3>
        <div className="timeline">
          {[
            { color: 'var(--accent)', title: 'Enrollment', text: '21 patients prospectively recruited prior to primary ACDF surgery' },
            { color: 'var(--purple)', title: 'Pre-Operative Assessment', text: 'VFSS (DIGEST + MBSImP) and 4 PROs (Bazaz, EAT-10, SWAL-QoL, HSS-DDI) administered' },
            { color: 'var(--amber)', title: 'ACDF Surgery', text: 'Anterior cervical discectomy and fusion procedure performed' },
            { color: 'var(--red)', title: '6-Week Post-Operative Assessment', text: 'Repeat VFSS and all PROs \u2014 all 6 measures significantly worse' },
            { color: 'var(--green)', title: 'Analysis', text: 'Within-subject comparison reveals discordance between instrumental and patient-reported findings' },
          ].map((item, i) => (
            <div className="tl-item" key={i}>
              <div className="tl-dot" style={{ background: item.color }} />
              <div className="tl-content"><h4>{item.title}</h4><p>{item.text}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="interp">
        <h4>Central Finding</h4>
        <p>The presence or absence of dysphagia symptoms <strong>does not reliably correspond</strong> with observed physical impairments after ACDF. PROs detected greater increases in prevalence and incidence than DIGEST, and while overall rates of clinically meaningful change were similar, <strong>they did not consistently identify the same patients</strong>.</p>
      </div>
      <div className="page-footer">Jones-Rastelli et al. (2025) &middot; <em>Laryngoscope</em> &middot; Molfenter Lab, NYU</div>
    </>
  );
}
