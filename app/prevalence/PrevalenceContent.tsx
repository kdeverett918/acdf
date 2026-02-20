'use client';

import '@/lib/chartSetup';
import { Bar } from 'react-chartjs-2';

export default function PrevalenceContent() {
  return (
    <>
      <div className="section-label">Detection Rates</div>
      <h2 className="page-title">Prevalence &amp; Incidence</h2>
      <p className="page-desc">PROs detected far greater postoperative increases in both point prevalence and new-onset incidence compared with DIGEST.</p>

      <div className="grid-2 mb-1-5">
        <div className="card">
          <h3 className="chart-heading-sm">Point Prevalence</h3>
          <div className="chart-wrap" style={{ aspectRatio: '16/10' }}>
            <Bar data={{ labels: ['DIGEST','Bazaz','EAT-10','SWAL-QoL','HSS-DDI'], datasets: [
              { label: 'Pre-op', data: [19,19,14,14,19], backgroundColor: 'rgba(108,156,255,.6)', borderRadius: 4 },
              { label: 'Post-op', data: [43,71,62,67,57], backgroundColor: 'rgba(248,113,113,.6)', borderRadius: 4 },
            ]}} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: i => `${i.dataset.label}: ${i.raw}%` } } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(38,51,84,.3)' } } } }} />
          </div>
        </div>
        <div className="card">
          <h3 className="chart-heading-sm">New Post-Op Incidence</h3>
          <div className="chart-wrap" style={{ aspectRatio: '16/10' }}>
            <Bar data={{ labels: ['DIGEST','Bazaz','EAT-10','SWAL-QoL','HSS-DDI'], datasets: [{ label: 'New Cases', data: [29,59,53,59,47], backgroundColor: ['rgba(108,156,255,.6)','rgba(167,139,250,.6)','rgba(167,139,250,.6)','rgba(167,139,250,.6)','rgba(167,139,250,.6)'], borderRadius: 4 }] }} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: i => `Incidence: ${i.raw}%` } } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 80, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(38,51,84,.3)' } } } }} />
          </div>
        </div>
      </div>

      <div className="card mb-1-5">
        <h3 className="chart-heading-sm">Clinically Meaningful Change by Measure</h3>
        <div className="chart-wrap" style={{ aspectRatio: '2.5/1' }}>
          <Bar data={{ labels: ['DIGEST','EAT-10','SWAL-QoL','HSS-DDI','Bazaz'], datasets: [
            { label: 'Improved', data: [5,0,0,0,0], backgroundColor: 'rgba(52,211,153,.6)', borderRadius: 3 },
            { label: 'Stable', data: [57,52,52,52,57], backgroundColor: 'rgba(108,156,255,.35)', borderRadius: 3 },
            { label: 'Worsened', data: [38,48,48,48,43], backgroundColor: 'rgba(248,113,113,.6)', borderRadius: 3 },
          ]}} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: i => `${i.dataset.label}: ${i.raw}%` } } }, scales: { x: { grid: { display: false }, stacked: true }, y: { stacked: true, beginAtZero: true, max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(38,51,84,.3)' } } } }} />
        </div>
      </div>

      <div className="interp">
        <h4>Clinical Interpretation</h4>
        <p>Patients may perceive swallowing difficulties (globus sensation, effortful swallowing) <strong>even when objective pharyngeal physiology appears relatively preserved</strong>. Conversely, some patients with observable VFSS changes may <strong>not report symptoms</strong> due to compensation strategies or reduced awareness.</p>
      </div>
      <div className="page-footer">Jones-Rastelli et al. (2025) &middot; <em>Laryngoscope</em> &middot; Molfenter Lab, NYU</div>
    </>
  );
}
