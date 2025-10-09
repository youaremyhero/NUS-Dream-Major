// js/scoring.js
import { QUESTIONS } from "./questions.js";

/**
 * Calculate aggregate scores for each major based on answers.
 * @param {number[]} answers - array of selected option indices for each question
 * @returns {{
 *   totals: Record<string, number>,
 *   resultsArray: {id: string, score: number, percent: number}[],
 *   topMajors: {id: string, score: number, percent: number}[],
 *   topMajorIds: string[],
 *   clusters: Record<string, any[]>
 * }}
 */
export function calculateResults(answers) {
  const totals = {};

  // Safeguard: if answers length doesn't match QUESTIONS length, handle gracefully
  const count = Math.min(answers.length, QUESTIONS.length);

  for (let idx = 0; idx < count; idx++) {
    const ans = answers[idx];
    if (ans == null) continue; // unanswered

    const q = QUESTIONS[idx];                       // ✅ use the imported QUESTIONS
    const option = q?.options?.[ans];
    if (!option) continue;

    Object.entries(option.scores || {}).forEach(([id, val]) => {
      const n = Number(val) || 0;
      totals[id] = (totals[id] || 0) + n;
    });
  }

  const entries = Object.entries(totals);
  if (!entries.length) {
    return {
      totals: {},
      resultsArray: [],
      topMajors: [],
      topMajorIds: [],
      clusters: {}
    };
  }

  const maxScore = Math.max(...entries.map(([, v]) => v)) || 1; // prevent divide-by-zero

  // Build sorted result array with normalized percentage
  const resultsArray = entries
    .map(([id, score]) => ({
      id,
      score,
      percent: Math.round((score / maxScore) * 100)
    }))
    .sort((a, b) => (b.score === a.score ? a.id.localeCompare(b.id) : b.score - a.score));

  // Top 5
  const topMajors = resultsArray.slice(0, 5);
  const topMajorIds = topMajors.map(m => m.id);

  // (Optional placeholder) Clusters are better resolved in results.js using majors metadata
  const clusters = {};
  topMajors.forEach(m => {
    const cluster = "Cluster"; // real mapping done in results.js using majors metadata
    clusters[cluster] = clusters[cluster] || [];
    clusters[cluster].push(m);
  });

  return { totals, resultsArray, topMajors, topMajorIds, clusters };
}

/**
 * Derive qualities from majors metadata (optional — actual mapping can be in results.js)
 * @param {{id:string}[]} topMajors
 * @param {Record<string,string>} qualitiesMap
 * @returns {{name:string, description:string}[]}
 */
export function identifyQualities(topMajors, qualitiesMap) {
  // Placeholder: if you're computing qualities in results.js, you can ignore this
  return Object.keys(qualitiesMap)
    .slice(0, 6)
    .map(k => ({ name: k, description: qualitiesMap[k] }));
}

/**
 * Save data to localStorage. Navigation is handled in main.js.
 * @param {any} data
 */
export function saveResults(data) {
  localStorage.setItem("quizResults", JSON.stringify(data));
  // Do NOT pushState to '/results' for GitHub Pages — it will 404 without SPA routing.
  // Navigation is done in main.js after calling saveResults().
}

/**
 * Load results from localStorage
 * @returns {any|null}
 */
export function loadResults() {
  const data = localStorage.getItem("quizResults");
  return data ? JSON.parse(data) : null;
}
