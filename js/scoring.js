// js/scoring.js
import { QUESTIONS } from "./questions.js";

export function calculateResults(answers) {
  const totals = {};
  answers.forEach((ans, idx) => {
    const q = questions[idx];
    const option = q?.options?.[ans];
    if (!option) return;
    Object.entries(option.scores || {}).forEach(([id, val]) => {
      totals[id] = (totals[id] || 0) + Number(val);
    });
  });

  const entries = Object.entries(totals);
  if (!entries.length) return { totals:{}, resultsArray:[], topMajors:[], clusters:{} };

  const maxScore = Math.max(...entries.map(([,v])=>v));
  const resultsArray = entries.map(([id,score]) => ({
    id, score, percent: Math.round((score / maxScore) * 100)
  })).sort((a,b)=> b.score===a.score ? a.id.localeCompare(b.id) : b.score - a.score);

  // Map to majors metadata if available (done in results.js)
  const topMajors = resultsArray.slice(0,5);

  const clusters = {};
  topMajors.forEach(m=>{
    const cluster = "Cluster"; // placeholder, final mapping in results.js using majors metadata
    clusters[cluster] = clusters[cluster] || [];
    clusters[cluster].push(m);
  });

  return { totals, resultsArray, topMajors, clusters };
}

export function identifyQualities(topMajors, qualitiesMap) {
  // Placeholder: qualities are derived from majors metadata in results.js
  return Object.keys(qualitiesMap).slice(0,6).map(k=>({ name:k, description:qualitiesMap[k] }));
}

export function saveResults(data) {
  localStorage.setItem("quizResults", JSON.stringify(data));
  history.pushState({}, "", "/results");
  window.location.href = "./results.html";
}

export function loadResults() {
  const data = localStorage.getItem("quizResults");
  return data ? JSON.parse(data) : null;
}
