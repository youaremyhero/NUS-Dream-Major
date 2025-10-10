// js/scoring.js
import { QUESTIONS_LIKERT } from "./config/questionsLikert.js";
import { majorsBatch1, majorsBatch2, majorsBatch3, majorsBatch4, majorsBatch5 } from "./majors.js";

/* ---------------------------------------------------
   1) Cluster Name → Canonical clusterId
   Keep these labels in sync with config/qualitiesConfig.js if needed
--------------------------------------------------- */
function mapClusterNameToId(name = "") {
  const n = String(name).trim().toLowerCase();
  switch (n) {
    case "business & management":
      return "BUSINESS_MGMT";
    case "computing & ai":
      return "COMPUTING_AI";
    case "engineering & technology":
      return "ENGINEERING_TECH";
    case "design & architecture":
      return "DESIGN_ARCH";
    case "social sciences":
      return "SOCIAL_SCI";
    case "humanities & cultural studies":
      return "HUMANITIES_CULTURE";
    case "sciences & quantitative":
      return "SCIENCES_QUANT";
    case "health & life sciences":
      return "HEALTH_LIFE";
    case "law & legal studies":
      return "LAW_LEGAL";
    case "music & performing arts":
      return "MUSIC_PERF";
    default:
      return "UNMAPPED";
  }
}

/* ---------------------------------------------------
   2) Enrich majors with clusterId (derived automatically)
--------------------------------------------------- */
const RAW_ALL_MAJORS = [
  ...majorsBatch1,
  ...majorsBatch2,
  ...majorsBatch3,
  ...majorsBatch4,
  ...majorsBatch5
];

// attach clusterId
const ALL_MAJORS = RAW_ALL_MAJORS.map(m => ({
  ...m,
  clusterId: m.clusterId || mapClusterNameToId(m.cluster)
}));

// index by id
const MAJOR_BY_ID = ALL_MAJORS.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {});

/* ---------------------------------------------------
   3) Likert scaling
--------------------------------------------------- */
function scaleLikert(val) {
  const num = Number(val);
  return num < 1 ? 0 : (num - 1) / 4; // 1→0, 5→1
}

/* ---------------------------------------------------
   4) Main scoring
--------------------------------------------------- */
export function calculateResults(answers) {
  const clusterTotals = {};
  const majorTotals = {};
  const qualityScores = {};

  answers.forEach((val, idx) => {
    const q = QUESTIONS_LIKERT[idx];
    const weight = scaleLikert(val);
    if (weight <= 0 || !q) return;

    // Cluster scores
    if (Array.isArray(q.clusters)) {
      q.clusters.forEach(({ id, w }) => {
        clusterTotals[id] = (clusterTotals[id] || 0) + (Number(w) || 0) * weight;
      });
    }

    // Explicit major nudges
    if (Array.isArray(q.majorsHints)) {
      q.majorsHints.forEach(({ id, w }) => {
        majorTotals[id] = (majorTotals[id] || 0) + (Number(w) || 0) * weight;
      });
    }

    // Qualities from question (optional)
    if (Array.isArray(q.qualitiesHints)) {
      q.qualitiesHints.forEach(({ quality, w }) => {
        qualityScores[quality] = (qualityScores[quality] || 0) + (Number(w) || 0) * weight;
      });
    }
  });

  // Spread cluster influence → majors in that cluster
  for (const [clusterId, score] of Object.entries(clusterTotals)) {
    ALL_MAJORS
      .filter((m) => m.clusterId === clusterId)
      .forEach((m) => {
        // "soft" distribution; adjust factor as you tune
        majorTotals[m.id] = (majorTotals[m.id] || 0) + score / 2;
      });
  }

  // Rank majors
  const entries = Object.entries(majorTotals);
  if (!entries.length) {
    return { majorTotals: {}, resultsArray: [], topMajors: [], qualityScores };
  }
  const maxScore = Math.max(...entries.map(([, v]) => v)) || 1;
  const resultsArray = entries
    .map(([id, score]) => ({
      id,
      score,
      percent: Math.round((score / maxScore) * 100)
    }))
    .sort((a, b) => b.score - a.score);

  const topMajors = resultsArray.slice(0, 5);

  // Smooth quality profile by blending majors' own qualities
  for (const [majorId, score] of Object.entries(majorTotals)) {
    const meta = MAJOR_BY_ID[majorId];
    if (!meta?.qualities?.length) continue;
    const share = score / meta.qualities.length;
    meta.qualities.forEach((q) => {
      qualityScores[q] = (qualityScores[q] || 0) + share * 0.3;
    });
  }

  return { majorTotals, resultsArray, topMajors, qualityScores };
}

export function saveResults(data) {
  localStorage.setItem("quizResults", JSON.stringify(data));
  window.location.href = "./results.html";
}

export function loadResults() {
  const data = localStorage.getItem("quizResults");
  return data ? JSON.parse(data) : null;
}
