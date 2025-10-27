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
  pickTop3DisplayQualities,
  WHY_DEFAULT // NEW: default fallback for "Why this fits"
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

// Iconography (lightweight emojis – replace later with SVGs if you like)
const CLUSTER_ICONS = {
  "Business & Management": "📊",
  "Computing & AI": "💻",
  "Engineering & Technology": "🛠️",
  "Design & Architecture": "🎨",
  "Social Sciences": "🌍",
  "Humanities & Cultural Studies": "📚",
  "Sciences & Quantitative": "🔬",
  "Health & Life Sciences": "🩺",
  "Law & Legal Studies": "⚖️",
  "Music & Performing Arts": "🎵"
};

function clusterIcon(name) {
  return CLUSTER_ICONS[name] || "🎓";
}

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

// -----------------------------------
// resolveWhyTemplate: normalize any shape to a final string
// Accepts string / function(ctx) / array / { text } / { lines:[] }.
// -----------------------------------
function resolveWhyTemplate(tpl, ctx = {}) {
  if (!tpl) return "";
  if (typeof tpl === "string") return tpl;
  if (typeof tpl === "function") {
    try {
      const out = tpl(ctx);
      return typeof out === "string" ? out : (out == null ? "" : String(out));
    } catch {
      return "";
    }
  }
  if (Array.isArray(tpl)) {
    return tpl.filter(Boolean).join(" ");
  }
  if (typeof tpl === "object") {
    if (typeof tpl.text === "string") return tpl.text;
    if (Array.isArray(tpl.lines)) return tpl.lines.filter(Boolean).join(" ");
  }
  return String(tpl);
}

// -----------------------------------
// Misc helpers
// -----------------------------------
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickPrimaryUrl(res) {
  if (res?.major?.[0]?.url) return res.major[0].url;
  if (res?.faculty?.[0]?.url) return res.faculty[0].url;
  if (res?.general?.[0]?.url) return res.general[0].url;
  return null;
}

// Prefer cluster diversity for ties (greedy selection)
function pickTopMajorsWithDiversity(baseList, n = 3) {
  // baseList: array of { id, score, percent } (sorted high→low)
  const selected = [];
  const pickedClusters = new Set();

  baseList.forEach((entry) => {
    if (selected.length >= n) return;
    const m = byId[entry.id];
    if (!m) return;

    if (selected.length === 0) {
      selected.push(entry);
      pickedClusters.add(m.cluster);
      return;
    }

    // If same score as last added OR same score as others near this band, prefer a different cluster
    const last = selected[selected.length - 1];
    const tie = last && entry.score === last.score;
    const cluster = m.cluster;

    if (tie) {
      if (!pickedClusters.has(cluster)) {
        selected.push(entry);
        pickedClusters.add(cluster);
      } else {
        // only add if we still have space and no alternative shows up
        // fallback: add anyway if not yet reached n
        if (selected.length < n) selected.push(entry);
      }
    } else {
      selected.push(entry);
      pickedClusters.add(cluster);
    }
  });

  // Fallback: if still fewer than n, fill from the rest ignoring diversity
  if (selected.length < n) {
    for (const e of baseList) {
      if (selected.find(s => s.id === e.id)) continue;
      selected.push(e);
      if (selected.length >= n) break;
    }
  }

  return selected.slice(0, n).map(e => e.id);
}

// If pickTop3DisplayQualities yields <3 (e.g., sparse qualityScores), pad from cluster priority
function getDisplayQualitiesForCluster(qualityScores, clusterName) {
  const list = pickTop3DisplayQualities({
    qualityScores,
    clusterName,
    displayRules: DISPLAY_RULES,
    families: QUALITY_FAMILIES
  }) || [];

  if (list.length >= 3) return list;

  const priority = CLUSTER_QUALITY_PRIORITY[clusterName] || [];
  for (const q of priority) {
    if (!list.includes(q)) list.push(q);
    if (list.length >= 3) break;
  }
  // final fallback
  while (list.length < 3) list.push("Analytical Thinking");
  return list.slice(0, 3);
}

// -----------------------------
// Public Entry (Legacy Support)
// -----------------------------
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
  container.appendChild(renderTopMajorsTabs(majors.slice(0, 3), {}));
  container.appendChild(renderExploreSimilarSection(majors[0]?.cluster || "", topMajorIds));
  container.appendChild(renderSpecialProgrammesSection(topMajorIds));
}

// -----------------------------
// Auto-init on page load
// -----------------------------
(function initFromStorage() {
  if (!document.getElementById("resultsPage")) return; // only on results.html

  const container = $("#resultsRoot") || mountResultsRoot();
  container.innerHTML = ""; // reset
  fireConfettiOnce();

  const data = loadResults(); // { resultsArray, topMajors, topMajors3, qualityScores, ... }
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

  // Base list of majors sorted by score (prefer explicit picks if present)
  const baseList =
    (Array.isArray(data.topMajors3) && data.topMajors3.length && data.topMajors3) ||
    (Array.isArray(data.topMajors) && data.topMajors.length && data.topMajors) ||
    data.resultsArray;

  // Ties & cluster diversity
  const pickedIds = pickTopMajorsWithDiversity(baseList, 3);
  const topMajorsMeta = pickedIds.map(id => byId[id]).filter(Boolean);
  topMajorsMeta.forEach((m, i) => (m.rank = i + 1));

  // Cluster validation (console + optional banner)
  const baseCluster = topMajorsMeta[0]?.cluster || "";
  clusterValidationReport(baseCluster, topMajorsMeta, data);

  // 1) Global Top 3 Qualities (biased to #1 cluster, safe-pad to 3)
  const globalTopQualities = getDisplayQualitiesForCluster(
    data.qualityScores || {},
    baseCluster
  );
  container.appendChild(renderTopQualities(globalTopQualities));

  // 2) Top 3 Major Tabs (rank-aware)
  container.appendChild(renderTopMajorsTabs(topMajorsMeta, data.qualityScores || {}));

  // 3) Explore Similar Majors (randomized clusters/majors, capped to 2 per cluster)
  container.appendChild(renderExploreSimilarSection(baseCluster, pickedIds));

  // 4) Special Programmes
  container.appendChild(renderSpecialProgrammesSection(pickedIds));
})();

// -----------------------------
// Cluster Validation (non-intrusive)
// -----------------------------
const ENABLE_CLUSTER_DEBUG = true;     // flip off later if you prefer
const SHOW_CLUSTER_BANNER = false;     // set true if you want a visible banner

function clusterValidationReport(clusterName, topMajors, data) {
  if (!ENABLE_CLUSTER_DEBUG) return;

  // You can enrich this if you add clusterScores in scoring.js
  // For now, we report what we do know: topMajors and their clusters
  /* eslint-disable no-console */
  console.group("[Results] Cluster Validation");
  console.info("Base cluster (from #1 major):", clusterName);
  console.info("Top majors picked (id → cluster):",
    topMajors.map(m => `${m.id} → ${m.cluster}`));
  console.info("Available qualityScores keys:", Object.keys(data.qualityScores || {}));
  console.groupEnd();
  /* eslint-enable no-console */

  if (SHOW_CLUSTER_BANNER) {
    const page = $("#resultsRoot") || mountResultsRoot();
    page.prepend(
      el("div", {
        className: "cluster-banner",
        html: `<strong>Debug:</strong> Base cluster is <em>${clusterName || "Unknown"}</em>.`
      })
    );
  }
}

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
// Section: Top 3 Majors (Tabs, Rank-aware)
// -----------------------------
function renderTopMajorsTabs(majors = [], qualityScores = {}) {
  const wrap = el("section", { className: "results-section tabs-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Your Top Matches" }));

  const tablist = el("div", { className: "tabs-header", attrs: { role: "tablist", "aria-label": "Top majors" } });
  const panels = el("div", { className: "tabs-panels" });

  majors.forEach((m, i) => {
    const id = m.id;
    const label = `#${i + 1}`; // rank-aware; accessible name below

    const btn = el("button", {
      className: "tab-btn",
      text: label,
      attrs: {
        role: "tab",
        id: `tab_${id}`,
        "data-tab-id": id,
        "aria-selected": i === 0 ? "true" : "false",
        "aria-controls": `panel_${id}`,
        "aria-label": `Recommendation #${i + 1}: ${m.name}`
      }
    });
    btn.addEventListener("click", () => selectTab(id, tablist, panels));
    tablist.appendChild(btn);

    const panel = renderMajorPanel(m, qualityScores);
    panel.id = `panel_${id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `tab_${id}`);
    if (i !== 0) panel.classList.add("is-hidden");
    panels.appendChild(panel);
  });

  wrap.append(tablist, panels);
  return wrap;
}

function selectTab(tabId, tablist, panels) {
  $all(".tab-btn", tablist).forEach(btn => {
    const on = btn.getAttribute("data-tab-id") === tabId;
    btn.setAttribute("aria-selected", on ? "true" : "false");
    btn.classList.toggle("active", !!on);
  });
  $all(".tab-panel", panels).forEach(p => {
    p.classList.toggle("is-hidden", p.id !== `panel_${tabId}`);
  });
}

function renderMajorPanel(m, qualityScores) {
  const panel = el("div", { className: "tab-panel" });

  // Header with wide rank badge and cluster icon
  const head = el("div", { className: "panel-head" });
  const badge = el("div", { className: "rank-badge wide", text: String(m.rank || "") });
  const title = el("h3", { className: "panel-title", text: m.name });
  const sub = el("div", {
    className: "panel-sub",
    html: `${clusterIcon(m.cluster)} <span class="cluster-name">${m.cluster || ""}</span> • <span class="faculty-name">${m.faculty || ""}</span>`
  });
  head.append(badge, title, sub);
  panel.appendChild(head);

  // Description
  if (m.description) {
    panel.appendChild(el("p", { className: "panel-desc", text: m.description }));
  }

  // Top 3 display qualities (with safe padding)
  const displayQuals = getDisplayQualitiesForCluster(qualityScores, m.cluster);
  if (displayQuals && displayQuals.length) {
    const qRow = el("div", { className: "topmajor-qualities" });
    displayQuals.forEach(q => {
      const chip = el("span", { className: "quality-chip", text: q });
      qRow.appendChild(chip);
    });
    panel.appendChild(qRow);
  }

  // Why this fits — major → cluster → default
  const tpl = WHY_TEMPLATES_MAJOR[m.id] ?? WHY_TEMPLATES_CLUSTER[m.cluster] ?? WHY_DEFAULT;
  const ctx = {
    displayQuals,
    major: m,
    cluster: m.cluster || "",
    A: displayQuals[0] || "",
    B: displayQuals[1] || ""
  };
  const base = resolveWhyTemplate(tpl, ctx);
  const whyText = String(base || "").replace("{qualities}", displayQuals.join(", ")).trim();

  if (whyText) {
    const whyBox = el("div", { className: "why-fits" });
    whyBox.appendChild(el("h4", { className: "why-title", text: "Why this fits" }));
    whyBox.appendChild(el("p", { className: "why-body", text: whyText }));
    panel.appendChild(whyBox);
  }

  // Resources (outbound links)
  const res = getResourcesForMajor(m.id, m);
  const links = [].concat(res.major || [], res.faculty || [], res.general || []);
  if (links.length) {
    panel.appendChild(renderLinksBlock("Explore this programme", links.slice(0, 3)));
  }

  return panel;
}

// -----------------------------
// Section: Explore Similar Majors (Randomized & capped)
// -----------------------------
function renderExploreSimilarSection(baseClusterName = "", topMajorIds = []) {
  const wrap = el("section", { className: "results-section explore-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Explore Similar Majors" }));

  const initial = [baseClusterName, ...(ADJACENT_CLUSTER_MAP[baseClusterName] || [])].filter(Boolean);
  const clustersToShow = shuffleArray(initial); // randomize cluster order

  if (!clustersToShow.length) {
    wrap.appendChild(el("p", { className: "muted", text: "No similar clusters found." }));
    return wrap;
  }

  const grid = el("div", { className: "cluster-grid" });

  clustersToShow.forEach(cluster => {
    // majors in this cluster, exclude already selected top majors
    let majors = ALL_MAJORS.filter(m => m.cluster === cluster && !topMajorIds.includes(m.id));
    if (!majors.length) return;
    majors = shuffleArray(majors).slice(0, 2); // randomize & cap to 2 results

    const clusterBlock = el("div", { className: "cluster-block" });
    clusterBlock.appendChild(el("h3", {
      className: "cluster-title",
      html: `${clusterIcon(cluster)} ${cluster}`
    }));

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
