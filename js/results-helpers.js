// results-helpers.js
// Bridges majors.js and resources.js for the Results page

import {
  generalResources,
  facultyResources,
  majorResources,
  specialProgrammeRules
} from "./resources.js";

/* ---------------------------------------------------------
   Resource Lookup
--------------------------------------------------------- */

export function getResourcesForMajor(id, majorObj) {
  if (!id) return { general: generalResources, faculty: [], major: [] };
  const faculty = majorObj?.faculty || "";
  return {
    general: generalResources,
    faculty: facultyResources[faculty] || [],
    major: majorResources[id] || []
  };
}

/* ---------------------------------------------------------
   Special Programme Recommendation Engine
--------------------------------------------------------- */

// simple cache to prevent recomputation
const cache = new Map();

function matchToken(id, token) {
  if (!id || !token) return false;
  if (token.endsWith("*")) return id.startsWith(token.slice(0, -1));
  return id === token;
}

export function getSpecialProgrammeRecs(topIds = []) {
  const key = topIds.join("_");
  if (cache.has(key)) return cache.get(key);

  const [top1, top2] = topIds;
  const output = [];

  specialProgrammeRules.forEach(rule => {
    const ok1 =
      Array.isArray(rule.ifTop1) && rule.ifTop1.some(t => matchToken(top1, t));
    const ok2 =
      !rule.ifTop2 ||
      (Array.isArray(rule.ifTop2) && rule.ifTop2.some(t => matchToken(top2, t)));
    if (ok1 && ok2 && rule.recommend?.length) {
      rule.recommend.slice(0, rule.cap ?? 1).forEach(rec => output.push(rec));
    }
  });

  cache.set(key, output);
  return output;
}

/* ---------------------------------------------------------
   Notes
--------------------------------------------------------- */
/**
 * - Keeps URL-independent lookups (so you can change link sets later
 *   without touching results.js)
 * - All links remain editable in resources.js
 * - Cached calls make it efficient if results are re-rendered
 */

