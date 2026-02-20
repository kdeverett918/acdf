export default function About() {
  const instruments = [
    { name: 'DIGEST', full: 'Dynamic Imaging Grade of Swallowing Toxicity', type: 'Instrumental (VFSS)', scale: '0–4', desc: 'Composite grade of swallowing safety and efficiency from videofluoroscopy.' },
    { name: 'MBSImP PTS', full: 'Modified Barium Swallow Impairment Profile – Pharyngeal Total Score', type: 'Instrumental (VFSS)', scale: '0–28', desc: 'Quantifies pharyngeal impairment severity across multiple physiological components.' },
    { name: 'EAT-10', full: 'Eating Assessment Tool', type: 'Patient-Reported (PRO)', scale: '0–40', desc: 'Self-administered symptom severity screening. Scores ≥3 considered abnormal.' },
    { name: 'SWAL-QoL', full: 'Swallowing Quality of Life Questionnaire', type: 'Patient-Reported (PRO)', scale: '0–100', desc: 'Measures swallowing-related quality of life. Lower scores = worse function.' },
    { name: 'Bazaz', full: 'Bazaz Dysphagia Scale', type: 'Patient-Reported (PRO)', scale: '0–3', desc: 'Widely used in spine surgery to grade dysphagia severity post-operatively.' },
    { name: 'HSS-DDI', full: 'Hospital for Special Surgery Dysphagia & Dysphonia Index', type: 'Patient-Reported (PRO)', scale: '0–100', desc: 'Developed specifically for cervical spine surgery population.' },
  ];

  return (
    <>
      <div className="section-label">Reference</div>
      <h2 className="page-title">About &amp; Citation</h2>
      <p className="page-desc">Details about this interactive research platform and the underlying publication.</p>

      <div className="card mb-1-5">
        <h3 style={{ marginBottom: '.75rem', fontSize: '1rem' }}>Citation</h3>
        <div style={{ padding: '1rem 1.25rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1rem' }}>
          <p style={{ fontSize: '.85rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
            Jones-Rastelli, R.B., Amin, M.R., Anandhakrishnan, M., Balou, M., Crossman, C., Herzberg, E.G., Johnson, A.M., &amp; Molfenter, S.M. (2025). Comparing videofluoroscopic and patient-reported outcome measures of swallowing pre- to post-anterior cervical discectomy and fusion. <em style={{ color: 'var(--text)' }}>The Laryngoscope</em>. DOI: <a href="https://doi.org/10.1002/lary.32352" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>10.1002/lary.32352</a>
          </p>
        </div>
      </div>

      <div className="card mb-1-5">
        <h3 style={{ marginBottom: '.75rem', fontSize: '1rem' }}>Authors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '.75rem' }}>
          {[
            { name: 'R. Brynn Jones-Rastelli', aff: 'NYU Steinhardt & NYU Grossman School of Medicine' },
            { name: 'Milan R. Amin', aff: 'NYU Grossman School of Medicine' },
            { name: 'Mridula Anandhakrishnan', aff: 'NYU Steinhardt' },
            { name: 'Matina Balou', aff: 'NYU Grossman School of Medicine' },
            { name: 'Claire Crossman', aff: 'NYU Steinhardt & NYU Grossman School of Medicine' },
            { name: 'Erica G. Herzberg', aff: 'NYU Grossman School of Medicine' },
            { name: 'Aaron M. Johnson', aff: 'NYU Grossman School of Medicine' },
            { name: 'Sonja M. Molfenter', aff: 'NYU Steinhardt & NYU Grossman School of Medicine', highlight: true },
          ].map(a => (
            <div key={a.name} style={{ padding: '.75rem 1rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: '.85rem', color: a.highlight ? 'var(--accent)' : 'var(--text)' }}>{a.name}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--text-dim)', marginTop: '.15rem' }}>{a.aff}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-1-5">
        <h3 style={{ marginBottom: '.75rem', fontSize: '1rem' }}>Instruments Used</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead>
              <tr>
                {['Instrument', 'Full Name', 'Type', 'Scale', 'Description'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '.6rem .75rem', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instruments.map(inst => (
                <tr key={inst.name}>
                  <td style={{ padding: '.6rem .75rem', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{inst.name}</td>
                  <td style={{ padding: '.6rem .75rem', borderBottom: '1px solid var(--border)' }}>{inst.full}</td>
                  <td style={{ padding: '.6rem .75rem', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}><span className={`badge ${inst.type.includes('PRO') ? 'badge-purple' : 'badge-accent'}`}>{inst.type}</span></td>
                  <td style={{ padding: '.6rem .75rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '.8rem' }}>{inst.scale}</td>
                  <td style={{ padding: '.6rem .75rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>{inst.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2 mb-1-5">
        <div className="card">
          <h3 style={{ marginBottom: '.5rem', fontSize: '1rem' }}>Study Design</h3>
          <ul style={{ fontSize: '.84rem', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
            <li>Prospective observational cohort</li>
            <li>21 patients undergoing primary ACDF</li>
            <li>Pre-operative and 6-week post-operative assessments</li>
            <li>2 instrumental measures (VFSS-based) and 4 patient-reported outcomes</li>
            <li>Within-subject comparison of measure agreement</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '.5rem', fontSize: '1rem' }}>Key Findings</h3>
          <ul style={{ fontSize: '.84rem', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
            <li>All 6 measures significantly worse post-ACDF (p &lt; .05)</li>
            <li>PROs detected ~2&times; greater new-onset incidence than DIGEST</li>
            <li>Rates of clinically meaningful change were similar across measure types</li>
            <li>Measures did not consistently identify the same patients as worsened</li>
            <li>PROs showed high internal agreement but only moderate VFSS concordance</li>
          </ul>
        </div>
      </div>

      <div className="interp">
        <h4>Platform Disclaimer</h4>
        <p>This interactive research platform is provided <strong>for educational and research purposes only</strong>. Clinical tools (calculators, simulator) are illustrative and have <strong>not been independently validated</strong> for clinical decision-making. Always consult with qualified healthcare professionals for patient care decisions.</p>
        <p style={{ marginBottom: 0 }}>Platform developed by the Molfenter Lab at NYU. Built with Next.js and Chart.js.</p>
      </div>
      <div className="page-footer">Jones-Rastelli et al. (2025) &middot; <em>Laryngoscope</em> &middot; Molfenter Lab, NYU</div>
    </>
  );
}
