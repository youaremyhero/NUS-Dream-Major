// js/scoring.js
import { QUESTIONS } from "./questions.js";
import { majorsBatch1, majorsBatch2, majorsBatch3, majorsBatch4, majorsBatch5 } from "./majors.js";

const ALL_MAJORS = [
  ...majorsBatch1,
  ...majorsBatch2,
  ...majorsBatch3,
  ...majorsBatch4,
  ...majorsBatch5
];

// index by id
const MAJOR_BY_ID = ALL_MAJORS.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {});

export function calculateResults(answers) {
  // 1) Aggregate MAJOR scores exactly as you do now
  const majorTotals = {};
  answers.forEach((ansIdx, qIdx) => {
    const q = QUESTIONS[qIdx];
    const option = q?.options?.[ansIdx];
    if (!option || !option.scores) return;
    Object.entries(option.scores).forEach(([majorId, val]) => {
      majorTotals[majorId] = (majorTotals[majorId] || 0) + Number(val);
    });
  });

  // 2) Rank majors
  const entries = Object.entries(majorTotals);
  if (!entries.length) {
    return {
      majorTotals: {},
      resultsArray: [],
      topMajors: [],
      qualityScores: {}
    };
  }

  const maxScore = Math.max(...entries.map(([, v]) => v));
  const safeMaxScore = maxScore > 0 ? maxScore : 1;
  const resultsArray = entries
    .map(([id, score]) => ({
      id,
      score,
      percent: Math.round((score / safeMaxScore) * 100)
    }))
    .sort((a, b) => (b.score === a.score ? a.id.localeCompare(b.id) : b.score - a.score));

  const topMajors = resultsArray.slice(0, 5);

  // 3) Derive QUALITY scores by pushing each major’s score into its qualities
  const qualityScores = {};
  for (const [majorId, score] of Object.entries(majorTotals)) {
    const meta = MAJOR_BY_ID[majorId];
    if (!meta?.qualities || !meta.qualities.length) continue;
    const share = score / meta.qualities.length; // equal spread into tagged qualities
    meta.qualities.forEach(q => {
      qualityScores[q] = (qualityScores[q] || 0) + share;
    });
  }

  return {
    majorTotals,      // map for debug/analytics
    resultsArray,     // sorted majors with percent
    topMajors,        // top-5 majors (downstream you’ll show top-3)
    qualityScores     // NEW: aggregate per quality
  };
}

export function saveResults(data) {
  localStorage.setItem("quizResults", JSON.stringify(data));
  window.location.href = "./results.html";
}

export function loadResults() {
  const data = localStorage.getItem("quizResults");
  return data ? JSON.parse(data) : null;
}
