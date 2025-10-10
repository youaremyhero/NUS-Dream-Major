// results.js
// Dynamically load results.css if not already loaded
(function loadResultsStyles() {
  if (!document.querySelector('link[href="css/results.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/results.css";
    document.head.appendChild(link);
  }
})();

import {
  QUALITY_FAMILIES,
  CLUSTER_QUALITY_PRIORITY,
  ADJACENT_CLUSTER_MAP,
  WHY_TEMPLATES_CLUSTER,
  WHY_TEMPLATES_MAJOR,
  DISPLAY_RULES,
  pickTop3DisplayQualities
} from "./config/qualitiesConfig.js";

import { majorsBatch1, majorsBatch2, majorsBatch3, majorsBatch4, majorsBatch5 } from "./majors.js";
import { getResourcesForMajor, getSpecialProgrammeRecs } from "./results-helpers.js";
import { loadResults } from "./scoring.js"; // read saved results

// -----------------------------
// Utilities
// -----------------------------
const ALL_MAJORS = [
  ...majorsBatch1,
  ...majorsBatch2,
  ...majorsBatch3,
  ...majorsBatch4,
  ...majorsBatch5
];

const byId = ALL_MAJORS.reduce((acc, m) => {
  acc[m.id] = m;
  return acc;
}, {});

function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}
function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.className) node.className = opts.className;
  if (opts.id) node.id = opts.id;
  if (opts.html != null) node.innerHTML = opts.html;
  if (opts.text != null) node.textContent = opts.text;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

// Confetti (fire once on results load) – uses window.confetti if present.
// Note: results.html already has a confetti burst. Keep this guard to avoid double-firing.
let confettiHasFired = false;
function fireConfettiOnce() {
  if (confettiHasFired) return;
  confettiHasFired = true;
  if (window.confetti) {
    window.confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.2 }
    });
  }
}

// -----------------------------
// Public Entry (Legacy Support)
// -----------------------------
/**
 * Legacy: If called directly with IDs/qualities, render a minimal page.
 * New default path is auto-init via loadResults() below.
 */
export function renderResultsPage({ topMajorIds = [], identifiedQualities = [] } = {}) {
  const container = $("#resultsRoot") || mountResultsRoot();
  container.innerHTML = ""; // reset

  try {
    const desired = new URL("./results.html", window.location.href);
    desired.search = "";
    desired.hash = "";
    const current = new URL(window.location.href);
    current.search = "";
    current.hash = "";
    if (current.href !== desired.href) {
      history.replaceState({}, "", desired.pathname);
    }
  } catch {}

  fireConfettiOnce();

  if (!topMajorIds.length) {
    container.appendChild(
      el("section", {
        className: "results-section",
        html: `
          <h2 class="section-title">Your Results</h2>
          <p class="muted">We couldn’t calculate matches this time. Please return to the quiz and try again.</p>
        `
      })
    );
    return;
  }

  const majors = topMajorIds.map(id => byId[id]).filter(Boolean);
  container.appendChild(renderTopQualitiesLegacy(identifiedQualities));
  container.appendChild(renderTopMajorsCards(majors.slice(0, 3), null));
  container.appendChild(renderExploreSimilarSection(majors[0]?.cluster || "", topMajorIds));
  container.appendChild(renderSpecialProgrammesSection(topMajorIds));
}

// -----------------------------
// Auto-init on page load
// -----------------------------
(function initFromStorage() {
  // only auto-init if we are on results.html (presence of #resultsPage)
  if (!document.getElementById("resultsPage")) return;

  const container = $("#resultsRoot") || mountResultsRoot();
  container.innerHTML = ""; // reset
  fireConfettiOnce();

  const data = loadResults(); // { clusterScores, majorTotals, resultsArray, topMajors, topMajors3, qualityScores, ... }
  if (!data || !data.resultsArray || !data.resultsArray.length) {
    container.appendChild(
      el("section", {
        className: "results-section",
        html: `
          <h2 class="section-title">Your Results</h2>
          <p class="muted">We couldn’t calculate matches this time. Please return to the quiz and try again.</p>
        `
      })
    );
    return;
  }

  // Prefer topMajors3, else topMajors, else resultsArray
  const baseList =
    (Array.isArray(data.topMajors3) && data.topMajors3.length && data.topMajors3) ||
    (Array.isArray(data.topMajors) && data.topMajors.length && data.topMajors) ||
    data.resultsArray;

  const topMajorsIds = baseList.slice(0, 3).map(x => x.id);
  const topMajorsMeta = topMajorsIds.map(id => byId[id]).filter(Boolean);

  // 1) Global Top 3 Qualities (biased to #1 cluster)
  const baseCluster = topMajorsMeta[0]?.cluster || "";
  const globalTopQualities = pickTop3DisplayQualities({
    qualityScores: data.qualityScores || {},
    clusterName: baseCluster,
    displayRules: DISPLAY_RULES,
    families: QUALITY_FAMILIES
  });
  container.appendChild(renderTopQualities(globalTopQualities));

  // 2) Top 3 Major Cards
  container.appendChild(renderTopMajorsCards(topMajorsMeta, data.qualityScores || {}));

  // 3) Explore Similar Majors (outbound links)
  container.appendChild(renderExploreSimilarSection(baseCluster, topMajorsIds));

  // 4) Special Programmes
  container.appendChild(renderSpecialProgrammesSection(topMajorsIds));
})();

// -----------------------------
// Mounting root
// -----------------------------
function mountResultsRoot() {
  let main = $("#resultsPage");
  if (!main) {
    main = el("main", { id: "resultsPage", className: "results-page" });
    document.body.appendChild(main);
  }
  const root = el("div", { id: "resultsRoot", className: "results-root" });
  main.appendChild(root);
  return root;
}

// -----------------------------
// Section: Top Qualities (GLOBAL)
// -----------------------------
function renderTopQualities(qualities = []) {
  const wrap = el("section", { className: "results-section qualities-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Your Top Qualities" }));

  // Descriptions are optional backups if you don’t embed them in templates:
  const desc = {
    "Analytical Thinking": "You break down complex problems and make sense of data and patterns.",
    "Creativity": "You generate fresh ideas and enjoy imaginative problem-solving.",
    "Leadership Potential": "You take initiative and bring people together to deliver results.",
    "Empathy": "You understand others’ experiences and value people-centric outcomes.",
    "Communication Skills": "You explain ideas clearly—through writing, visuals or speaking.",
    "Intercultural Competence": "You’re curious about cultures and collaborate across differences.",
    "Attention to Detail": "You notice the small things that improve quality and safety.",
    "Problem Solving": "You enjoy figuring out solutions and testing what works.",
    "Ethical Thinking": "You care about doing the right thing—even when it’s hard.",
    "Discipline": "You can focus, follow through and keep high standards.",
    "Negotiation": "You work towards win-win outcomes across different needs.",
    "Adaptability": "You learn fast and stay calm when things change.",
    "Collaboration": "You enjoy teamwork and shared goals.",
    "Critical Thinking": "You evaluate evidence and challenge assumptions.",
    "Visionary Thinking": "You imagine what’s next and connect today’s work to future impact.",
    "Strategic Planning": "You align resources and steps to reach bigger goals.",
    "Growth Mindset": "You believe skills grow with effort and feedback."
  };

  const list = el("div", { className: "qualities-grid" });
  (qualities.length ? qualities : ["Analytical Thinking"]).forEach(q => {
    const card = el("div", { className: "quality-card", attrs: { "data-quality": q } });
    card.appendChild(el("div", { className: "quality-name", text: q }));
    card.appendChild(el("p", { className: "quality-desc", text: desc[q] || "A core strength that aligns with multiple majors." }));
    list.appendChild(card);
  });

  wrap.appendChild(list);
  return wrap;
}

// Legacy top-qualities helper
function renderTopQualitiesLegacy(qualities = []) {
  return renderTopQualities(qualities.slice(0, 3));
}

// -----------------------------
// Section: Top 3 Majors (Cards)
// -----------------------------
function renderTopMajorsCards(majors = [], qualityScores = {}) {
  const wrap = el("section", { className: "results-section topmajors-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Your Top Matches" }));

  const grid = el("div", { className: "topmajors-grid", attrs: { role: "list" } });

  majors.forEach((m, idx) => {
    const card = el("article", { className: "topmajor-card", attrs: { role: "listitem" } });

    // Header
    const head = el("div", { className: "topmajor-head" });
    head.appendChild(el("div", { className: "rank-badge", text: String(idx + 1) }));
    head.appendChild(el("h3", { className: "topmajor-title", text: m.name }));
    head.appendChild(el("div", { className: "topmajor-sub", text: `${m.faculty} • ${m.cluster}` }));
    card.appendChild(head);

    // Description
    if (m.description) {
      card.appendChild(el("p", { className: "topmajor-blurb", text: m.description }));
    }

    // Top 3 display qualities (cluster-aware, using aggregate qualityScores)
    const displayQuals = pickTop3DisplayQualities({
      qualityScores,
      clusterName: m.cluster,
      displayRules: DISPLAY_RULES,
      families: QUALITY_FAMILIES
    });

    // Qualities chips
    if (displayQuals && displayQuals.length) {
      const qRow = el("div", { className: "topmajor-qualities" });
      displayQuals.forEach(q => {
        const chip = el("span", { className: "quality-chip", text: q });
        qRow.appendChild(chip);
      });
      card.appendChild(qRow);
    }

    // Why this fits — prefer major template; fallback to cluster template
    const tpl = (WHY_TEMPLATES_MAJOR[m.id] || WHY_TEMPLATES_CLUSTER[m.cluster] || "").trim();
    if (tpl) {
      const whyBox = el("div", { className: "why-fits" });
      whyBox.appendChild(el("h4", { className: "why-title", text: "Why this fits" }));
      const text = tpl.replace("{qualities}", displayQuals.join(", "));
      whyBox.appendChild(el("p", { className: "why-body", text }));
      card.appendChild(whyBox);
    }

    // Resources (outbound links)
    const res = getResourcesForMajor(m.id, m);
    const links = [].concat(res.major || [], res.faculty || [], res.general || []);
    if (links.length) {
      card.appendChild(renderLinksBlock("Explore this programme", links.slice(0, 3)));
    }

    grid.appendChild(card);
  });

  wrap.appendChild(grid);
  return wrap;
}

// -----------------------------
// Section: Explore Similar Majors (Outbound Links)
// -----------------------------
function renderExploreSimilarSection(baseClusterName = "", topMajorIds = []) {
  const wrap = el("section", { className: "results-section explore-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Explore Similar Majors" }));

  const clustersToShow = [baseClusterName, ...(ADJACENT_CLUSTER_MAP[baseClusterName] || [])]
    .filter(Boolean);

  if (!clustersToShow.length) {
    wrap.appendChild(el("p", { className: "muted", text: "No similar clusters found." }));
    return wrap;
  }

  const grid = el("div", { className: "cluster-grid" });

  clustersToShow.forEach(cluster => {
    // list majors in this cluster (excluding already chosen top majors, optional)
    const majors = ALL_MAJORS.filter(m => m.cluster === cluster && !topMajorIds.includes(m.id));
    if (!majors.length) return;

    const clusterBlock = el("div", { className: "cluster-block" });
    clusterBlock.appendChild(el("h3", { className: "cluster-title", text: cluster }));

    const list = el("div", { className: "cluster-list" });
    majors.forEach(m => {
      const item = el("article", { className: "cluster-card" });
      item.appendChild(el("h4", { className: "cluster-major-title", text: m.name }));
      item.appendChild(el("p", { className: "cluster-major-desc", text: m.description || "" }));

      const res = getResourcesForMajor(m.id, m);
      const primary = pickPrimaryUrl(res) || "#";

      const a = el("a", {
        className: "btn btn-moreinfo",
        text: "Visit programme page",
        attrs: { href: primary, target: "_blank", rel: "noopener noreferrer" }
      });
      item.appendChild(a);

      list.appendChild(item);
    });

    clusterBlock.appendChild(list);
    grid.appendChild(clusterBlock);
  });

  wrap.appendChild(grid);
  return wrap;
}

function pickPrimaryUrl(res) {
  if (res?.major?.[0]?.url) return res.major[0].url;
  if (res?.faculty?.[0]?.url) return res.faculty[0].url;
  if (res?.general?.[0]?.url) return res.general[0].url;
  return null;
}

// -----------------------------
// Section: Special Programmes
// -----------------------------
function renderSpecialProgrammesSection(topIds = []) {
  const wrap = el("section", { className: "results-section specialprogs-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Recommended Special Programmes" }));

  const recs = getSpecialProgrammeRecs(topIds);
  if (!recs.length) {
    wrap.appendChild(
      el("p", {
        className: "muted",
        text: "Your selections don’t strongly match any specific Double/Concurrent/Joint programme patterns. Explore faculty resources for more options."
      })
    );
    return wrap;
  }

  const list = el("div", { className: "sp-list" });
  recs.forEach(r => {
    const item = el("article", { className: "sp-item" });
    item.appendChild(el("h4", { className: "sp-title", text: r.title }));
    item.appendChild(el("p", { className: "sp-desc", text: r.description }));
    if (r.url) {
      item.appendChild(
        el("a", {
          className: "btn small",
          text: "Learn more",
          attrs: { href: r.url, target: "_blank", rel: "noopener noreferrer" }
        })
      );
    }
    list.appendChild(item);
  });

  wrap.appendChild(list);
  return wrap;
}

// -----------------------------
// Generic Links Block
// -----------------------------
function renderLinksBlock(title, links = []) {
  const block = el("div", { className: "links-block" });
  block.appendChild(el("h4", { className: "links-title", text: title }));
  if (!links.length) {
    block.appendChild(el("p", { className: "muted", text: "No links available." }));
    return block;
  }
  const ul = el("ul", { className: "links-list" });
  links.forEach(l => {
    const li = el("li");
    const a = el("a", { text: l.label, attrs: { href: l.url, target: "_blank", rel: "noopener noreferrer" } });
    li.appendChild(a);
    if (l.note) li.appendChild(el("span", { className: "link-note-inline", text: ` — ${l.note}` }));
    ul.appendChild(li);
  });
  block.appendChild(ul);
  return block;
}

// -----------------------------
// PDF export anchor
// -----------------------------
export function prepareResultsForPdf() {
  return $("#resultsRoot");
}
