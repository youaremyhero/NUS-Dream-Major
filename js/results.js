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
import { loadResults, applyDiversityBias } from "./scoring.js"; // read saved results

const ENABLE_CLUSTER_DEBUG = true;     // flip off later if you prefer
const SHOW_CLUSTER_BANNER = false;     // set true if you want a visible banner

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

function legacyClusterCountFor(id, counts) {
  const cluster = byId[id]?.cluster;
  return cluster ? (counts[cluster] || 0) : 0;
}

function legacyDiversityFallback(list = [], pickN = 9999) {
  if (!Array.isArray(list) || !list.length) return [];

  const countsByCluster = {};
  const result = [];
  let group = [];
  let currentScoreKey = null;

  const flushGroup = () => {
    if (!group.length) return;
    const reweighted = group.slice().sort((a, b) => {
      const ca = legacyClusterCountFor(a.id, countsByCluster);
      const cb = legacyClusterCountFor(b.id, countsByCluster);
      if (ca === cb) {
        const idA = a?.id || "";
        const idB = b?.id || "";
        return idA.localeCompare(idB);
      }
      return ca - cb;
    });

    reweighted.forEach((item) => {
      if (result.length >= pickN) return;
      result.push(item);
      const cluster = byId[item.id]?.cluster;
      if (cluster) {
        countsByCluster[cluster] = (countsByCluster[cluster] || 0) + 1;
      }
    });

    group = [];
  };

  list.forEach((item) => {
    if (!item || !item.id) return;
    const key = String(item.score ?? "");
    if (currentScoreKey === null) {
      currentScoreKey = key;
    }

    if (key === currentScoreKey) {
      group.push(item);
    } else {
      flushGroup();
      currentScoreKey = key;
      group = [item];
    }
  });

  flushGroup();

  return result.slice(0, pickN);
}

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

function normalizeResultEntries(list = []) {
  return list
    .map(entry => {
      if (!entry) return null;
      if (typeof entry === "string") {
        return { id: entry, score: 0, percent: 0 };
      }
      if (typeof entry === "object") {
        const id = entry.id || entry.majorId;
        if (!id) return null;
        return {
          id,
          score: entry.score ?? 0,
          percent: entry.percent ?? 0
        };
      }
      return null;
    })
    .filter(Boolean);
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
// Auto-init on page load
// -----------------------------
(function initFromStorage() {
  if (!document.getElementById("resultsPage")) return; // only on results.html

  const container = document.getElementById("resultsRoot");
  if (!container) return;
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
  const baseList = normalizeResultEntries(
    (Array.isArray(data.topMajors3) && data.topMajors3.length && data.topMajors3) ||
      (Array.isArray(data.topMajors) && data.topMajors.length && data.topMajors) ||
      data.resultsArray
  );

  // Ties & cluster diversity
  const diversified = applyDiversityBias(baseList, 3);
  const topMajorsMeta = diversified.slice(0, 3)
    .map(entry => byId[entry.id])
    .filter(Boolean)
    .map((m, i) => ({ ...m, rank: i + 1 }));
  const pickedIds = diversified.slice(0, 3).map(entry => entry.id);

  if (!topMajorsMeta.length) {
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

  // Cluster validation (console + optional banner)
  const baseCluster = topMajorsMeta[0]?.cluster || "";
  clusterValidationReport(baseCluster, topMajorsMeta, data);

  // 1) Global Top 3 Qualities (biased to #1 cluster, safe-pad to 3)
  const qualityScores = data.qualityScores || {};
  const globalTopQualities = getDisplayQualitiesForCluster(qualityScores, baseCluster);
  const specialRecs = getSpecialProgrammeRecs(pickedIds);

  container.appendChild(
    renderResultsHero({
      topMajors: topMajorsMeta,
      topQualities: globalTopQualities,
      qualityScores,
      baseCluster,
      pickedIds,
      specialRecs
    })
  );

  container.appendChild(renderAboutSection(topMajorsMeta, globalTopQualities, baseCluster));
  container.appendChild(renderExploreNewSection(topMajorsMeta));
  container.appendChild(
    renderWhyJoinSection(topMajorsMeta, globalTopQualities, baseCluster, specialRecs.length)
  );
})();

// -----------------------------
// Cluster Validation (non-intrusive)
// -----------------------------


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
    const page = document.getElementById("resultsRoot");
    if (page) {
      page.prepend(
        el("div", {
          className: "cluster-banner",
          html: `<strong>Debug:</strong> Base cluster is <em>${clusterName || "Unknown"}</em>.`
        })
      );
    }
  }
}

// -----------------------------
// Section: Top Qualities (GLOBAL)
// -----------------------------
function renderTopQualities(qualities = []) {
  const wrap = el("section", { className: "results-section results-subsection qualities-section" });
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

// -----------------------------
// Section: Top 3 Majors (Tabs, Rank-aware)
// -----------------------------
function renderTopMajorsTabs(majors = [], qualityScores = {}) {
  const wrap = el("section", { className: "results-section results-subsection tabs-section" });
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
  const wrap = el("section", { className: "results-section results-subsection explore-section" });
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
function renderSpecialProgrammesSection(topIds = [], precomputed) {
  const wrap = el("section", { className: "results-section results-subsection specialprogs-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Recommended Special Programmes" }));

  const recs = Array.isArray(precomputed) ? precomputed : getSpecialProgrammeRecs(topIds);
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

// -----------------------------
// High-level Sections
// -----------------------------

function renderResultsHero({
  topMajors = [],
  topQualities = [],
  qualityScores = {},
  baseCluster = "",
  pickedIds = [],
  specialRecs = []
} = {}) {
  const section = el("section", { id: "results", className: "page-section results-hero" });

  const header = el("div", { className: "results-hero__header" });
  header.appendChild(
    el("h1", {
      className: "results-hero__title",
      text: "Your personalised NUS major matches"
    })
  );

  header.appendChild(
    el("p", {
      className: "results-hero__lead",
      text:
        "Based on your quiz responses, here’s how your strengths align with our programmes."
    })
  );

  if (topMajors[0]) {
    header.appendChild(
      el("div", {
        className: "results-hero__highlight",
        html: `Top match: <strong>${topMajors[0].name}</strong> • ${
          topMajors[0].cluster || ""
        }`
      })
    );
  }

  if (topMajors.length) {
    const list = el("ul", { className: "results-hero__matches" });
    topMajors.forEach(m => {
      const item = el("li");
      item.appendChild(el("span", { className: "results-hero__rank", text: `#${m.rank || ""}` }));
      item.appendChild(el("strong", { text: m.name }));
      if (m.faculty) {
        item.appendChild(
          el("span", { className: "results-hero__meta", text: m.faculty })
        );
      }
      list.appendChild(item);
    });
    header.appendChild(list);
  }

  const content = el("div", { className: "results-hero__content" });
  content.appendChild(renderTopQualities(topQualities));
  content.appendChild(renderTopMajorsTabs(topMajors, qualityScores));
  content.appendChild(renderExploreSimilarSection(baseCluster, pickedIds));
  content.appendChild(renderSpecialProgrammesSection(pickedIds, specialRecs));

  section.append(header, content);
  return section;
}

function renderAboutSection(topMajors = [], qualities = [], baseCluster = "") {
  const section = el("section", { id: "about", className: "page-section about-section" });
  section.appendChild(
    el("h2", { className: "page-section__title", text: "How we matched you" })
  );

  const qualityText = qualities.filter(Boolean).join(", ");
  const leadParts = [];
  if (qualityText) {
    leadParts.push(`Your responses highlighted strengths in ${qualityText}.`);
  }
  if (baseCluster) {
    leadParts.push(`These qualities align strongly with ${baseCluster} pathways.`);
  }

  if (leadParts.length) {
    section.appendChild(
      el("p", {
        className: "page-section__lead",
        text: leadParts.join(" ")
      })
    );
  }

  if (topMajors.length) {
    const list = el("ul", { className: "about-section__list" });
    topMajors.forEach(m => {
      const item = el("li");
      item.appendChild(el("strong", { text: `#${m.rank || ""} ${m.name}` }));
      item.appendChild(
        el("span", {
          text: [m.cluster, m.faculty].filter(Boolean).join(" • ")
        })
      );
      list.appendChild(item);
    });
    section.appendChild(list);
  }

  return section;
}

function renderExploreNewSection(topMajors = []) {
  const section = el("section", {
    id: "exploreNew",
    className: "page-section explore-new-section"
  });
  section.appendChild(
    el("h2", { className: "page-section__title", text: "Explore new possibilities" })
  );

  section.appendChild(
    el("p", {
      className: "page-section__lead",
      text:
        "Follow these links to dig deeper into admissions details, faculties and programmes you can act on today."
    })
  );

  const resourcesByUrl = new Map();
  topMajors.forEach(m => {
    const bundle = getResourcesForMajor(m.id, m);
    if (m.rank === 1 && Array.isArray(bundle.general)) {
      bundle.general.forEach(res => {
        if (res?.url && !resourcesByUrl.has(res.url)) {
          resourcesByUrl.set(res.url, { ...res });
        }
      });
    }

    const facultyLink = bundle.faculty?.[0];
    if (facultyLink?.url && !resourcesByUrl.has(facultyLink.url)) {
      resourcesByUrl.set(facultyLink.url, {
        ...facultyLink,
        meta: m.faculty
      });
    }

    const majorLink = bundle.major?.[0];
    if (majorLink?.url && !resourcesByUrl.has(majorLink.url)) {
      resourcesByUrl.set(majorLink.url, {
        ...majorLink,
        meta: m.name
      });
    }
  });

  if (!resourcesByUrl.size) {
    section.appendChild(
      el("p", {
        className: "muted",
        text: "Resources will appear here once we have programme links to share."
      })
    );
    return section;
  }

  const grid = el("div", { className: "links-grid" });
  resourcesByUrl.forEach(res => {
    const card = el("a", {
      className: "resource-card",
      attrs: {
        href: res.url,
        target: "_blank",
        rel: "noopener noreferrer"
      }
    });

    const body = el("div", { className: "resource-card__body" });
    body.appendChild(el("strong", { text: res.label }));
    if (res.meta) {
      body.appendChild(
        el("span", { className: "resource-card__meta", text: res.meta })
      );
    }

    card.append(body, el("span", { attrs: { "aria-hidden": "true" }, text: "→" }));
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

function renderWhyJoinSection(
  topMajors = [],
  qualities = [],
  baseCluster = "",
  specialProgrammeCount = 0
) {
  const section = el("section", {
    id: "whyJoin",
    className: "page-section why-join-section"
  });

  section.appendChild(
    el("h2", { className: "page-section__title", text: "Why join NUS?" })
  );

  const primaryQuality = qualities[0] || "your strengths";
  const secondaryQuality = qualities[1];
  const clusterText = baseCluster ? `${baseCluster} disciplines` : "our programmes";
  const qualityPhrase = [primaryQuality, secondaryQuality]
    .filter(Boolean)
    .map(text => (typeof text === "string" ? text.toLowerCase() : String(text)))
    .join(" and ");

  const primaryLower =
    typeof primaryQuality === "string" ? primaryQuality.toLowerCase() : String(primaryQuality);
  const secondaryLower =
    typeof secondaryQuality === "string"
      ? secondaryQuality.toLowerCase()
      : secondaryQuality
      ? String(secondaryQuality)
      : "";

  section.appendChild(
    el("p", {
      className: "page-section__lead",
      text: `NUS offers pathways where ${qualityPhrase || "your strengths"} shine across ${clusterText}.`
    })
  );

  const topMatch = topMajors[0];
  const reasons = [
    {
      title: topMatch ? `Thrive in ${topMatch.name}` : "Grow in your top matches",
      desc: topMatch
        ? `Work with mentors from ${topMatch.faculty || "NUS"} and tackle projects that reward ${primaryLower}${
            secondaryQuality ? ` and ${secondaryLower}` : ""
          }.`
        : "Dive deeper into your recommended programmes with mentorship that builds on your strengths."
    },
    {
      title: "Design an interdisciplinary path",
      desc:
        specialProgrammeCount > 0
          ? `You received ${specialProgrammeCount} special programme recommendation${
              specialProgrammeCount === 1 ? "" : "s"
            }. Use them to mix majors, minors or double degrees that fit your goals.`
          : "Explore double majors, minors and experiential programmes to tailor your academic journey."
    },
    {
      title: "Build experience beyond the classroom",
      desc:
        "Tap into global exposure, internships and student life communities to apply your strengths in real-world settings."
    }
  ];

  const grid = el("div", { className: "why-join-grid" });
  reasons.forEach(reason => {
    const card = el("article", { className: "why-card" });
    card.appendChild(el("h3", { text: reason.title }));
    card.appendChild(el("p", { text: reason.desc }));
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}
