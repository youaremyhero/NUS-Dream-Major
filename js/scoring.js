// js/scoring.js
import { QUESTIONS_LIKERT } from "./config/questionsLikert.js";
import { majorsBatch1, majorsBatch2, majorsBatch3, majorsBatch4, majorsBatch5 } from "./majors.js";

/* -------------------------------------------------------
   1) Majors index and cluster mapping
------------------------------------------------------- */
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

// Bridge between Likert cluster IDs and majors.js cluster labels
const CLUSTER_ID_TO_LABEL = {
  BIZ_MGMT: "Business & Management",
  COMP_AI: "Computing & AI",
  ENG_TECH: "Engineering & Technology",
  DESIGN_ARCH: "Design & Architecture",
  SOC_SCI: "Social Sciences",
  HUMANITIES_CULT: "Humanities & Cultural Studies",
  SCI_QUANT: "Sciences & Quantitative",
  HEALTH_LIFE: "Health & Life Sciences",
  LAW_LEGAL: "Law & Legal Studies",
  MUSIC_PERF: "Music & Performing Arts"
};

// Invert map: label → Likert cluster ID
const LABEL_TO_CLUSTER_ID = Object.entries(CLUSTER_ID_TO_LABEL)
  .reduce((acc, [cid, label]) => {
    acc[label] = cid;
    return acc;
  }, {});

/* -------------------------------------------------------
   2) Likert scaling and weights
------------------------------------------------------- */
// Centered scale: 1..5 → [-1, -0.5, 0, +0.5, +1]
const LIKERT_TO_SIGNED = { 1: -1, 2: -0.5, 3: 0, 4: 0.5, 5: 1 };
const toSigned = (val) => LIKERT_TO_SIGNED[val] ?? 0;

// Weights: you can tune these if needed
const W_CLUSTER = 1.0;   // how strongly cluster scores influence majors
const W_HINT = 1.0;      // how strongly majorsHints push specific majors
const W_QUAL_HINT = 1.0; // how strongly qualitiesHints add to qualities directly

/* -------------------------------------------------------
   3) Main scoring pipeline
------------------------------------------------------- */
export function calculateResults(answers) {
  const clusterScores = {};         // clusterId → score
  const majorTotals = {};           // majorId → score (from hints + cluster spillover)
  const qualityScoresHints = {};    // qualities derived directly from qualitiesHints

  // Pass 1: accumulate raw cluster scores, major hints, and quality hints
  answers.forEach((val, i) => {
    const q = QUESTIONS_LIKERT[i];
    if (!q) return;

    const signed = toSigned(val);

    // Cluster signals
    (q.clusters || []).forEach(({ id, w }) => {
      clusterScores[id] = (clusterScores[id] || 0) + signed * (w || 0);
    });

    // Major nudges
    (q.majorsHints || []).forEach(({ id, w }) => {
      majorTotals[id] = (majorTotals[id] || 0) + signed * (w || 0) * W_HINT;
    });

    // Direct qualities (optional)
    (q.qualitiesHints || []).forEach(({ quality, w }) => {
      qualityScoresHints[quality] = (qualityScoresHints[quality] || 0) + signed * (w || 0) * W_QUAL_HINT;
    });
  });

  // Pass 2: spill cluster scores into majors that belong to that cluster
  ALL_MAJORS.forEach((m) => {
    const clusterId = LABEL_TO_CLUSTER_ID[m.cluster];
    if (!clusterId) return;
    const spill = (clusterScores[clusterId] || 0) * W_CLUSTER;
    if (spill !== 0) {
      majorTotals[m.id] = (majorTotals[m.id] || 0) + spill;
    }
  });

  // Nothing to rank?
  const entries = Object.entries(majorTotals);
  if (!entries.length) {
    return {
      clusterScores,
      majorTotals: {},
      resultsArray: [],
      topMajors: [],
      topMajors3: [],
      qualityScores: {},
      qualityScoresHints: {},
      qualityScoresFromMajors: {}
    };
  }

  // Optional: normalize to non-negative for display (shift baseline)
  const scores = entries.map(([, s]) => s);
  const minScore = Math.min(...scores);
  const shiftedTotals = Object.fromEntries(
    entries.map(([id, s]) => [id, minScore < 0 ? s - minScore : s])
  );
  const shiftedEntries = Object.entries(shiftedTotals);

  // Percent scaling guard
  const maxShifted = Math.max(...shiftedEntries.map(([, s]) => s), 1);

  // Initial sort by score desc, then by id for stable ordering
  let sorted = shiftedEntries
    .map(([id, score]) => ({ id, score, percent: Math.round((score / maxShifted) * 100) }))
    .sort((a, b) => (b.score === a.score ? a.id.localeCompare(b.id) : b.score - a.score));

  // Pass 3: diversity-biased tie handling for final pick list
  const arranged = applyDiversityBias(sorted);

  // Derive top picks
  const topMajors = arranged.slice(0, 5);
  const topMajors3 = arranged.slice(0, 3);

  // Pass 4: push major totals into qualities (via majors metadata)
  // (Use unshifted totals for relative contribution, but clamp negatives to 0)
  const qualityScoresFromMajors = {};
  Object.entries(majorTotals).forEach(([mid, rawScore]) => {
    const m = MAJOR_BY_ID[mid];
    if (!m?.qualities || !m.qualities.length) return;
    const contrib = Math.max(0, rawScore) / m.qualities.length;
    m.qualities.forEach(q => {
      qualityScoresFromMajors[q] = (qualityScoresFromMajors[q] || 0) + contrib;
    });
  });

  // Final qualities = hints (+) from-majors
  const qualityScores = mergeAdd(qualityScoresHints, qualityScoresFromMajors);

  return {
    clusterScores,
    majorTotals,                 // raw (may include negatives)
    resultsArray: arranged,      // array of { id, score, percent }
    topMajors,
    topMajors3,
    qualityScores,               // combined
    qualityScoresHints,
    qualityScoresFromMajors
  };
}

/* -------------------------------------------------------
   4) Diversity-bias on ties (clusters)
   Prefers spreading clusters in top picks.
------------------------------------------------------- */
function applyDiversityBias(sortedList, pickN = 9999) {
  const countsByCluster = {};
  const result = [];

  // We process in score-desc groups (same score)
  const groups = groupBy(sortedList, (x) => String(x.score));

  groups.forEach((group) => {
    // Sort this tie-group by "current cluster count asc" to favour under-represented clusters
    const reweighted = group.slice().sort((a, b) => {
      const ca = clusterCountFor(a.id, countsByCluster);
      const cb = clusterCountFor(b.id, countsByCluster);
      if (ca === cb) return a.id.localeCompare(b.id);
      return ca - cb; // fewer → earlier
    });

    reweighted.forEach(item => {
      if (result.length >= pickN) return;
      result.push(item);
      // update cluster count
      const m = MAJOR_BY_ID[item.id];
      const label = m?.cluster;
      if (label) countsByCluster[label] = (countsByCluster[label] || 0) + 1;
    });
  });

  return result;
}

function clusterCountFor(majorId, counts) {
  const m = MAJOR_BY_ID[majorId];
  const label = m?.cluster;
  return label ? (counts[label] || 0) : 0;
}

function groupBy(arr, keyFn) {
  const map = new Map();
  arr.forEach((x) => {
    const k = keyFn(x);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(x);
  });
  // preserve original order of groups (already sorted by score desc)
  return Array.from(map.values());
}

function mergeAdd(a = {}, b = {}) {
  const out = { ...a };
  Object.entries(b).forEach(([k, v]) => {
    out[k] = (out[k] || 0) + (v || 0);
  });
  return out;
}

/* -------------------------------------------------------
   5) Persistence
------------------------------------------------------- */
export function saveResults(data) {
  localStorage.setItem("quizResults", JSON.stringify(data));
  window.location.href = "./results.html";
}

export function loadResults() {
  const data = localStorage.getItem("quizResults");
  return data ? JSON.parse(data) : null;
}
