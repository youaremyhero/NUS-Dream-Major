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
import { EXPLORE_PROGRAMMES } from "./content/exploreProgrammes.js";

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
// Public renderer (used on results.html + inline quiz rendering)
// -----------------------------
export function renderResultsView({ mountNode, data, includeSupplementary } = {}) {
  const container = mountNode || document.getElementById("resultsRoot");
  if (!container) return null;

  container.innerHTML = "";

  const shouldIncludeSupplementary =
    typeof includeSupplementary === "boolean"
      ? includeSupplementary
      : container.dataset?.supplementary === "true";

  const source = data || loadResults();
  if (!source || !source.resultsArray || !source.resultsArray.length) {
    container.appendChild(
      el("section", {
        className: "results-section",
        html: `
          <h2 class="section-title">Your Results</h2>
          <p class="muted">We couldn’t calculate matches this time. Please return to the quiz and try again.</p>
        `
      })
    );
    return container;
  }

  // Base list of majors sorted by score (prefer explicit picks if present)
  const baseList = normalizeResultEntries(
    (Array.isArray(source.topMajors3) && source.topMajors3.length && source.topMajors3) ||
      (Array.isArray(source.topMajors) && source.topMajors.length && source.topMajors) ||
      source.resultsArray
  );

  // Ties & cluster diversity
  const diversified = applyDiversityBias(baseList, 3);
  const topMajorsMeta = diversified
    .slice(0, 3)
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
    return container;
  }

  // Cluster validation (console + optional banner)
  const baseCluster = topMajorsMeta[0]?.cluster || "";
  clusterValidationReport(baseCluster, topMajorsMeta, source);

  // 1) Global Top 3 Qualities (biased to #1 cluster, safe-pad to 3)
  const qualityScores = source.qualityScores || {};
  const globalTopQualities = getDisplayQualitiesForCluster(qualityScores, baseCluster);
  const specialRecs = getSpecialProgrammeRecs(pickedIds);

  fireConfettiOnce();

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

  if (shouldIncludeSupplementary) {
    container.appendChild(renderWhyJoinSection());
    container.appendChild(renderExploreProgrammesSection());
    container.appendChild(renderExplorePossibilitiesSection(topMajorsMeta));
  }

  return container;
}

// -----------------------------
// Auto-init on dedicated results page
// -----------------------------
(function initFromStorage() {
  const host = document.querySelector("[data-results-autoload='true']");
  if (!host) return;
  renderResultsView({ mountNode: host });
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
// Section: Top 3 Majors (Vertical tabs + responsive accordion)
// -----------------------------
function renderTopMajorsTabs(majors = [], qualityScores = {}) {
  const wrap = el("section", { className: "results-section results-subsection topmajors-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Your Top Matches" }));

  if (!Array.isArray(majors) || !majors.length) {
    wrap.appendChild(el("p", { className: "muted", text: "No major recommendations available." }));
    return wrap;
  }

  const layout = el("div", { className: "topmajors-grid" });
  const rankList = el("div", {
    className: "topmajors-ranks",
    attrs: { role: "tablist", "aria-label": "Top major recommendations", "aria-orientation": "vertical" }
  });
  const contentCol = el("div", { className: "topmajors-content" });
  const ctaCol = el("aside", { className: "topmajors-cta" });

  const accordion = el("div", { className: "topmajors-accordion" });

  const detailPanels = [];
  const ctaPanels = [];
  const accordionItems = [];

  let activeId = null;

  majors.forEach((major, index) => {
    const rankNumber = major.rank || index + 1;
    const displayQuals = getDisplayQualitiesForCluster(qualityScores, major.cluster) || [];
    const tpl = WHY_TEMPLATES_MAJOR[major.id] ?? WHY_TEMPLATES_CLUSTER[major.cluster] ?? WHY_DEFAULT;
    const ctx = {
      displayQuals,
      major,
      cluster: major.cluster || "",
      A: displayQuals[0] || "",
      B: displayQuals[1] || ""
    };
    const base = resolveWhyTemplate(tpl, ctx);
    const whyText = String(base || "").replace("{qualities}", displayQuals.join(", ")).trim();

    const resources = getResourcesForMajor(major.id, major);
    const quickLinks = []
      .concat(resources.major || [], resources.faculty || [], resources.general || [])
      .slice(0, 3);

    // Rank tab button (desktop/tablet)
    const tab = el("button", {
      className: "rank-tab",
      attrs: {
        role: "tab",
        id: `tab_${major.id}`,
        "data-major-id": major.id,
        "aria-controls": `panel_${major.id}`,
        "aria-selected": index === 0 ? "true" : "false",
        tabindex: index === 0 ? "0" : "-1"
      }
    });
    tab.innerHTML = `
      <span class="rank-tab__stripe" aria-hidden="true"></span>
      <span class="rank-tab__number">#${rankNumber}</span>
      <span class="rank-tab__content">
        <span class="rank-tab__title">${major.name}</span>
        <span class="rank-tab__faculty">${major.faculty || ""}</span>
      </span>
    `;
    tab.addEventListener("click", () => activateMajor(major.id));
    rankList.appendChild(tab);

    // Desktop detail + CTA panels
    const detail = buildMajorDetail(major, {
      rankNumber,
      displayQuals,
      whyText,
      variant: "desktop"
    });
    detailPanels.push(detail);
    contentCol.appendChild(detail);

    const ctaCard = buildProgrammeCard(major, {
      quickLinks,
      variant: "desktop"
    });
    ctaPanels.push(ctaCard);
    ctaCol.appendChild(ctaCard);

    // Mobile accordion item
    const accordionItem = el("article", {
      className: "topmajors-accordion__item",
      attrs: { "data-major-id": major.id }
    });
    const accordionTrigger = el("button", {
      className: "accordion-trigger",
      attrs: {
        id: `accordion_${major.id}`,
        "data-major-id": major.id,
        "aria-expanded": index === 0 ? "true" : "false",
        "aria-controls": `accordion_panel_${major.id}`
      }
    });
    accordionTrigger.innerHTML = `
      <span class="accordion-trigger__number">#${rankNumber}</span>
      <span class="accordion-trigger__content">
        <span class="accordion-trigger__title">${major.name}</span>
        <span class="accordion-trigger__faculty">${major.faculty || ""}</span>
      </span>
      <span class="accordion-trigger__icon" aria-hidden="true"></span>
    `;
    accordionItem.appendChild(accordionTrigger);

    const accordionPanel = el("div", {
      className: "accordion-panel",
      attrs: {
        id: `accordion_panel_${major.id}`,
        role: "region",
        "aria-labelledby": `accordion_${major.id}`,
        "aria-hidden": index === 0 ? "false" : "true"
      }
    });
    const mobileDetail = buildMajorDetail(major, {
      rankNumber,
      displayQuals,
      whyText,
      variant: "mobile"
    });
    const mobileCta = buildProgrammeCard(major, {
      quickLinks,
      variant: "mobile"
    });
    accordionPanel.append(mobileDetail, mobileCta);
    if (index === 0) {
      accordionPanel.classList.add("is-open");
    }
    accordionItem.appendChild(accordionPanel);
    accordion.appendChild(accordionItem);
    accordionItems.push({ trigger: accordionTrigger, panel: accordionPanel });
  });

  layout.append(rankList, contentCol, ctaCol);
  wrap.append(layout, accordion);

  const allTabs = Array.from(rankList.querySelectorAll(".rank-tab"));

  function activateMajor(majorId) {
    if (!majorId) return;
    activeId = majorId;

    allTabs.forEach(btn => {
      const isActive = btn.getAttribute("data-major-id") === majorId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      btn.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    detailPanels.forEach(panel => {
      const isActive = panel.getAttribute("data-major-id") === majorId;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    ctaPanels.forEach(panel => {
      const isActive = panel.getAttribute("data-major-id") === majorId;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    accordionItems.forEach(({ trigger, panel }) => {
      const isActive = trigger.getAttribute("data-major-id") === majorId;
      trigger.setAttribute("aria-expanded", isActive ? "true" : "false");
      trigger.classList.toggle("is-active", isActive);
      panel.classList.toggle("is-open", isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
      panel.style.maxHeight = isActive ? `${panel.scrollHeight}px` : "0px";
    });
  }

  // Keyboard navigation for rank tabs
  rankList.addEventListener("keydown", evt => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(evt.key)) return;
    evt.preventDefault();
    const currentIndex = allTabs.findIndex(btn => btn.classList.contains("is-active"));
    if (evt.key === "Home") {
      allTabs[0]?.focus();
      activateMajor(allTabs[0]?.getAttribute("data-major-id"));
      return;
    }
    if (evt.key === "End") {
      const last = allTabs[allTabs.length - 1];
      last?.focus();
      activateMajor(last?.getAttribute("data-major-id"));
      return;
    }
    const delta = evt.key === "ArrowUp" ? -1 : 1;
    let nextIndex = currentIndex + delta;
    if (nextIndex < 0) nextIndex = allTabs.length - 1;
    if (nextIndex >= allTabs.length) nextIndex = 0;
    const nextTab = allTabs[nextIndex];
    if (nextTab) {
      nextTab.focus();
      activateMajor(nextTab.getAttribute("data-major-id"));
    }
  });

  accordionItems.forEach(({ trigger }) => {
    trigger.addEventListener("click", () => {
      const majorId = trigger.getAttribute("data-major-id");
      activateMajor(majorId);
      trigger.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  window.addEventListener("resize", () => {
    const activeAccordion = accordionItems.find(item => item.trigger.classList.contains("is-active"));
    if (activeAccordion) {
      activeAccordion.panel.style.maxHeight = `${activeAccordion.panel.scrollHeight}px`;
    }
  });

  // Prime initial state
  activateMajor(majors[0].id);

  return wrap;
}

function buildMajorDetail(major, { rankNumber, displayQuals = [], whyText = "", variant = "desktop" } = {}) {
  const panel = el("article", {
    className: variant === "mobile" ? "topmajor-panel topmajor-panel--mobile" : "topmajor-panel",
    attrs: { "data-major-id": major.id }
  });

  if (variant === "desktop") {
    panel.id = `panel_${major.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `tab_${major.id}`);
    panel.setAttribute("aria-hidden", "true");
  }

  const header = el("header", { className: "topmajor-panel__header" });
  header.innerHTML = `
    <span class="topmajor-panel__badge">#${rankNumber}</span>
    <div class="topmajor-panel__heading">
      <h3 class="topmajor-panel__title">${major.name}</h3>
      <div class="topmajor-panel__meta">
        <span class="topmajor-panel__cluster">${clusterIcon(major.cluster)} ${major.cluster || ""}</span>
        <span class="topmajor-panel__faculty">${major.faculty || ""}</span>
      </div>
    </div>
  `;
  panel.appendChild(header);

  if (major.description) {
    panel.appendChild(el("p", { className: "topmajor-panel__description", text: major.description }));
  }

  if (displayQuals && displayQuals.length) {
    const qualRow = el("div", { className: "topmajor-panel__qualities" });
    displayQuals.forEach(q => {
      qualRow.appendChild(el("span", { className: "quality-chip", text: q }));
    });
    panel.appendChild(qualRow);
  }

  if (whyText) {
    const whyCard = el("div", { className: "major-why-card" });
    const label = el("div", { className: "major-why-card__label" });
    label.innerHTML = `<span class="major-why-card__icon" aria-hidden="true">💡</span><span>Why this fits</span>`;
    whyCard.appendChild(label);
    whyCard.appendChild(el("p", { className: "major-why-card__body", text: whyText }));
    panel.appendChild(whyCard);
  }

  return panel;
}

function buildProgrammeCard(major, { quickLinks = [], variant = "desktop" } = {}) {
  const attrs = { "data-major-id": major.id };
  if (variant === "desktop") {
    attrs["aria-hidden"] = "true";
  }

  const card = el("div", {
    className: variant === "mobile" ? "programme-card programme-card--mobile" : "programme-card",
    attrs
  });

  card.appendChild(el("h4", { className: "programme-card__title", text: "Explore this Programme" }));

  if (quickLinks.length) {
    const list = el("ul", { className: "programme-card__links" });
    quickLinks.forEach(link => {
      const item = el("li", { className: "programme-card__item" });
      const anchor = el("a", {
        className: "programme-card__tab",
        html: `
          <span class="programme-card__tab-label">${link.label}</span>
          <span class="programme-card__tab-icon" aria-hidden="true">→</span>
        `,
        attrs: { href: link.url, target: "_blank", rel: "noopener noreferrer" }
      });
      item.appendChild(anchor);
      if (link.note) {
        item.appendChild(el("span", { className: "programme-card__note", text: link.note }));
      }
      list.appendChild(item);
    });
    card.appendChild(list);
  } else {
    card.appendChild(el("p", { className: "programme-card__empty", text: "No quick links available." }));
  }

  return card;
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

  const card = el("div", { className: "results-hero__card" });
  card.append(header, content);

  section.append(card);
  return section;
}

function renderExplorePossibilitiesSection(topMajors = []) {
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
        "Use these quick guides to explore admissions information, campus experiences and next steps you can take right now."
    })
  );

  const resourcesByUrl = new Map();
  topMajors.forEach(m => {
    const bundle = getResourcesForMajor(m.id, m);
    (bundle.general || []).forEach(res => {
      if (res?.url && !resourcesByUrl.has(res.url)) {
        resourcesByUrl.set(res.url, { ...res });
      }
    });
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

function renderExploreProgrammesSection(programmes = EXPLORE_PROGRAMMES) {
  const section = el("section", {
    id: "exploreProgrammes",
    className: "page-section explore-programmes-section"
  });

  section.appendChild(
    el("h2", { className: "page-section__title", text: "Explore new programmes" })
  );

  section.appendChild(
    el("p", {
      className: "page-section__lead",
      text:
        "These curated tracks and experiential pathways let you weave entrepreneurship, global perspectives and community living into your studies."
    })
  );

  if (!Array.isArray(programmes) || !programmes.length) {
    section.appendChild(
      el("p", {
        className: "muted",
        text: "Programme highlights will be added soon. Check back for new opportunities."
      })
    );
    return section;
  }

  const grid = el("div", { className: "programme-grid" });

  programmes.forEach(item => {
    if (!item?.title || !item?.description) return;

    const card = el("article", { className: "programme-card" });
    if (item.id) {
      card.id = `results-programme-${item.id}`;
    }

    card.appendChild(el("h3", { text: item.title }));
    card.appendChild(el("p", { text: item.description }));

    if (item.url) {
      card.appendChild(
        el("a", {
          className: "btn secondary small",
          text: item.ctaLabel || "Learn more",
          attrs: { href: item.url, target: "_blank", rel: "noopener noreferrer" }
        })
      );
    }

    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

function renderWhyJoinSection() {
  const section = el("section", {
    id: "whyJoin",
    className: "page-section why-join-section"
  });

  section.appendChild(
    el("h2", { className: "page-section__title", text: "Why join NUS?" })
  );

  section.appendChild(
    el("p", {
      className: "page-section__lead",
      text:
        "NUS offers a vibrant community, industry-aligned curriculum, and support systems that help every student flourish."
    })
  );

  const reasons = [
    {
      title: "World-class academics",
      desc:
        "Learn from leading faculty, cutting-edge labs and global classrooms that keep pace with the future of work."
    },
    {
      title: "Create your own path",
      desc:
        "Combine majors, minors and special programmes to design an academic journey tailored to your aspirations."
    },
    {
      title: "Grow through real-world experience",
      desc:
        "Tap into internships, global experiences and innovation hubs that build confidence beyond the classroom."
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
