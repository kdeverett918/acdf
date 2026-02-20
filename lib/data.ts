export interface Measure {
  key: string;
  label: string;
  fullName: string;
  type: string;
  scale: string;
  dir: string;
  pre: number[];
  post: number[];
  preMean: number;
  postMean: number;
  preSD: number;
  postSD: number;
  p: string;
  mcid: number;
  desc: string;
}

export interface Patient {
  id: number;
  label: string;
  digestDir: string;
  [key: string]: number | string;
}

export const D: Record<string, Measure> = {
  digest: {
    key: 'digest', label: 'DIGEST', fullName: 'Dynamic Imaging Grade of Swallowing Toxicity',
    type: 'Instrumental (VFSS)', scale: '0\u20134', dir: 'Higher = worse',
    pre: [0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0],
    post: [1,0,1,1,0,1,2,0,1,0,1,1,0,0,1,0,1,0,1,2,0],
    preMean: .24, postMean: .57, preSD: .44, postSD: .60, p: '0.012', mcid: 1,
    desc: 'DIGEST grades overall swallowing safety and efficiency from videofluoroscopy. Scores shifted toward mild-to-moderate impairment post-ACDF.'
  },
  mbsimp: {
    key: 'mbsimp', label: 'MBSImP PTS', fullName: 'MBSImP Pharyngeal Total Score',
    type: 'Instrumental (VFSS)', scale: '0\u201328', dir: 'Higher = worse',
    pre: [2,3,1,5,2,3,4,1,2,3,6,2,1,3,5,2,4,1,3,7,2],
    post: [4,5,3,8,3,5,7,2,4,4,8,4,3,4,7,3,6,3,5,10,3],
    preMean: 3.0, postMean: 5.0, preSD: 1.6, postSD: 2.1, p: '0.003', mcid: 3,
    desc: 'Quantifies pharyngeal swallowing impairment severity across multiple physiological components.'
  },
  eat10: {
    key: 'eat10', label: 'EAT-10', fullName: 'Eating Assessment Tool',
    type: 'Patient-Reported (PRO)', scale: '0\u201340', dir: 'Higher = worse (\u22653 abnormal)',
    pre: [0,2,0,3,1,0,5,0,1,0,4,0,1,2,3,0,1,0,2,6,0],
    post: [4,8,2,10,3,5,12,1,6,3,9,4,2,5,8,3,7,2,5,14,1],
    preMean: 1.5, postMean: 5.4, preSD: 1.8, postSD: 3.6, p: '<0.001', mcid: 3,
    desc: 'Self-administered symptom severity tool. Many patients crossed the \u22653 clinical threshold post-ACDF.'
  },
  swalqol: {
    key: 'swalqol', label: 'SWAL-QoL', fullName: 'Swallowing Quality of Life Questionnaire',
    type: 'Patient-Reported (PRO)', scale: '0\u2013100', dir: 'Lower = worse',
    pre: [98,92,100,85,95,97,80,100,96,98,82,97,99,93,86,100,95,100,94,76,100],
    post: [82,78,92,68,86,80,62,95,76,90,70,82,92,80,72,88,78,94,82,58,92],
    preMean: 93.5, postMean: 80.4, preSD: 7.3, postSD: 9.8, p: '<0.001', mcid: -14,
    desc: 'Captures swallowing-related quality of life across multiple domains. Broad decline indicates substantial QoL impact.'
  },
  bazaz: {
    key: 'bazaz', label: 'Bazaz', fullName: 'Bazaz Dysphagia Scale',
    type: 'Patient-Reported (PRO)', scale: '0\u20133', dir: 'Higher = worse',
    pre: [0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,2,0],
    post: [1,1,0,2,1,1,2,0,1,0,2,1,0,1,2,0,1,0,1,3,0],
    preMean: .29, postMean: .95, preSD: .56, postSD: .80, p: '0.002', mcid: 1,
    desc: 'Widely used in spine surgery to grade dysphagia severity. Confirms common new/worsening difficulty.'
  },
  hssddi: {
    key: 'hssddi', label: 'HSS-DDI', fullName: 'Hospital for Special Surgery Dysphagia & Dysphonia Index',
    type: 'Patient-Reported (PRO)', scale: '0\u2013100', dir: 'Higher = worse',
    pre: [2,5,0,12,3,2,15,0,4,1,10,3,1,4,11,2,5,0,3,18,1],
    post: [14,20,5,28,12,16,32,3,18,8,24,15,6,14,22,8,18,5,14,38,4],
    preMean: 4.9, postMean: 15.4, preSD: 5.1, postSD: 9.3, p: '<0.001', mcid: 12,
    desc: 'Developed specifically for cervical spine surgery. Reflects multifaceted impact on swallowing and voice.'
  }
};

export const patients: Patient[] = [];
for (let i = 0; i < 21; i++) {
  const p: Patient = { id: i + 1, label: `P${String(i + 1).padStart(2, '0')}`, digestDir: 'stable' };
  Object.keys(D).forEach(k => {
    p[k + '_pre'] = D[k].pre[i];
    p[k + '_post'] = D[k].post[i];
    const diff = D[k].post[i] - D[k].pre[i];
    const mcid = D[k].mcid;
    if (k === 'swalqol') p[k + '_change'] = diff <= mcid ? 'worse' : diff >= Math.abs(mcid) ? 'improved' : 'stable';
    else p[k + '_change'] = diff >= mcid ? 'worse' : diff <= -mcid ? 'improved' : 'stable';
  });
  p.digestDir = p.digest_change as string;
  patients.push(p);
}

export const measKeys = ['digest', 'mbsimp', 'eat10', 'swalqol', 'bazaz', 'hssddi'];
export const measLabels = ['DIGEST', 'MBSImP PTS', 'EAT-10', 'SWAL-QoL', 'Bazaz', 'HSS-DDI'];

export const agreeMatrix = [
  [100, 90, 52, 48, 57, 52],
  [90, 100, 50, 46, 54, 50],
  [52, 50, 100, 76, 81, 71],
  [48, 46, 76, 100, 71, 67],
  [57, 54, 81, 71, 100, 76],
  [52, 50, 71, 67, 76, 100]
];

export const maxScales: Record<string, number> = {
  digest: 4, mbsimp: 28, eat10: 40, swalqol: 100, bazaz: 3, hssddi: 100
};

export function seededRandom(seed: number) {
  let s = seed | 0;
  return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s % 1000) / 1000; };
}
