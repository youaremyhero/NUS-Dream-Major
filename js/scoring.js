// js/scoring.js
import { QUESTIONS_LIKERT } from "./config/questionsLikert.js";
import { majorsBatch1, majorsBatch2, majorsBatch3, majorsBatch4, majorsBatch5 } from "./majors.js";

const ALL_MAJORS = [
  ...majorsBatch1,
  ...majorsBatch2,
  ...majorsBatch3,
  ...majorsBatch4,
  ...majorsBatch5
];

const MAJOR_BY_ID = ALL_MAJORS.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {});

// Converts a 1–5 Likert value to a 0–1 weight
function scaleLikert(val) {
  const num = Number(val);
  return num < 1 ? 0 : (num - 1) / 4; // 1→0, 5→1
}

export function calculateResults(answers) {
  const clusterTotals = {};
  const majorTotals = {};
  const qualityScores = {};

  answers.forEach((val, idx) => {
    const q = QUESTIONS_LIKERT[idx];
    const weight = scaleLikert(val);
    if (weight <= 0 || !q) return;

    // Cluster scores
    q.clusters?.forEach(({ id, w }) => {
      clusterTotals[id] = (clusterTotals[id] || 0) + w * weight;
    });

    // Major hints
    q.majorsHints?.forEach(({ id, w }) => {
      majorTotals[id] = (majorTotals[id] || 0) + w * weight;
    });

    // Quality hints
    q.qualitiesHints?.forEach(({ quality, w }) => {
      qualityScores[quality] = (qualityScores[quality] || 0) + w * weight;
    });
  });

  // Spread cluster influence to majors within that cluster
  for (const [clusterId, score] of Object.entries(clusterTotals)) {
    ALL_MAJORS.filter((m) => m.clusterId === clusterId).forEach((m) => {
      majorTotals[m.id] = (majorTotals[m.id] || 0) + score / 2; // distribute softly
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

  // Quality smoothing: include major qualities
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
