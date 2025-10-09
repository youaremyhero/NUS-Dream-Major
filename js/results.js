// results.js
// Renders: Top Qualities, Top-5 strip, Recommendation tabs, Resources, Special Programmes
// Route: keeps URL stable as /results
// Confetti: fires once per sessionStorage key
// PDF: exposes prepareResultsForPdf()

import {
  // If you have a combined exported array, import it:
  // majorsAll
} from "./majors.js";

import {
  getResourcesForMajor,
  getSpecialProgrammeRecs
} from "./resources.js";

/* ===============================
   0) Utilities & Config
================================= */

// Qualities dictionary (student-friendly blurbs)
const QUALITY_DESCRIPTIONS = {
  "Analytical Thinking": "You enjoy breaking complex problems into clear, logical steps and drawing sound conclusions.",
  "Creativity": "You like exploring fresh, original ideas and finding new angles to solve problems.",
  "Leadership Potential": "You’re comfortable coordinating people, setting direction, and motivating a team.",
  "Empathy": "You notice how others feel and care about making a positive impact on people.",
  "Communication Skills": "You express ideas clearly and adapt your style for different audiences.",
  "Intercultural Competence": "You’re curious about cultures and can work comfortably with diverse perspectives.",
  "Attention to Detail": "You spot small errors and care about accuracy and consistency.",
  "Problem Solving": "You like tackling challenges head-on and iterating solutions that actually work.",
  "Ethical Thinking": "You weigh consequences, fairness, and responsibility when deciding what to do.",
  "Discipline": "You can focus, follow through, and manage longer tasks with consistency.",
  "Negotiation": "You can balance different interests and move people towards win-win outcomes.",
  "Adaptability": "You respond well to changes and adjust plans quickly when needed.",
  "Collaboration": "You work well in groups, share credit, and help others succeed.",
  "Critical Thinking": "You question assumptions, evaluate evidence, and build strong arguments.",
  "Visionary Thinking": "You can imagine what’s next and connect dots to future opportunities.",
  "Strategic Planning": "You think long-term, prioritise resources, and plan for impact.",
  "Growth Mindset": "You see challenges as chances to learn and keep improving."
};

// Optional: if you don’t already have a fast ID → major map,
// we’ll accept either a passed-in map or build one from majorsAll.
function buildMajorsIndex(majorsArray) {
  const map = new Map();
  majorsArray.forEach(m => map.set(m.id, m));
  return map;
}

function ensureAtResultsRoute() {
  if (window.location.pathname !== "/results") {
    history.pushState({}, "", "/results");
  }
}

// Fire confetti once per session (respect user’s requirement)
function fireConfettiOnce() {
  try {
    const key = "quiz_confetti_fired";
    if (!sessionStorage.getItem(key)) {
      // If you use a confetti lib like canvas-confetti:
      // confetti({ particleCount: 180, spread: 70, origin: { y: 0.3 } });
      // Minimal fallback: a tiny burst using the Web Animations API to avoid blocking.
      const burst = document.createElement("div");
      burst.className = "confetti-burst";
      document.body.appendChild(burst);
      burst.animate(
        [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-40px)", opacity: 0 }],
        { duration: 800, easing: "ease-out" }
      );
      setTimeout(() => burst.remove(), 900);
      sessionStorage.setItem(key, "1");
    }
  } catch {
    // ignore storage errors
  }
}

// Small helper to make safe anchor tags
function linkify({ label, url }) {
  if (!url) return "";
  const safeLabel = label || "Open link";
  return `<a class="res-link" href="${url}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`;
}

// Create element helper
function el(tag, className, html) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (html != null) n.innerHTML = html;
  return n;
}

/* ===============================
   1) Public Entry
================================= */
/**
 * Renders the results page.
 * @param {Object} params
 * @param {string[]} params.topMajorIds - ordered list (best → next) of major IDs; expects at least 1–5.
 * @param {string[]} params.identifiedQualities - selected user qualities (IDs exactly as in QUALITY_DESCRIPTIONS)
 * @param {Map<string,object>} [params.majorsIndex] - optional prebuilt index of majors
 * @param {HTMLElement} [params.mount] - optional mount node; defaults to #appRoot or document.body
 */
export function renderResultsPage(params) {
  const {
    topMajorIds = [],
    identifiedQualities = [],
    majorsIndex = null,
    mount = document.getElementById("appRoot") || document.body
  } = params || {};

  if (!topMajorIds.length) {
    console.warn("renderResultsPage: no topMajorIds provided.");
  }

  ensureAtResultsRoute();
  fireConfettiOnce();

  // Build or accept majors index
  let idx = majorsIndex;
  if (!idx) {
    // If you have majorsAll imported, use it; otherwise expect caller to pass majorsIndex
    if (typeof majorsAll !== "undefined" && Array.isArray(majorsAll)) {
      idx = buildMajorsIndex(majorsAll);
    } else {
      console.warn("No majorsIndex and majorsAll is undefined. Tabs will render IDs only.");
      idx = new Map();
    }
  }

  // Root (wipe and render)
  const page = el("section", "results-page", "");
  page.id = "resultsPage";
  mount.innerHTML = "";
  mount.appendChild(page);

  // ---- Header: Identified Qualities ----
  page.appendChild(buildQualitiesSection(identifiedQualities));

  // ---- Top 5 horizontal strip ----
  const top5 = topMajorIds.slice(0, 5);
  page.appendChild(buildTop5Strip(top5, idx));

  // ---- Recommendation Tabs (1–5) ----
  page.appendChild(buildRecommendationTabs(top5, idx));

  // ---- Special Programmes (based on Top 1 & Top 2) ----
  const specialsWrap = el("section", "results-specials", "");
  specialsWrap.id = "specialProgrammes";
  const specials = getSpecialProgrammeRecs([top5[0], top5[1]].filter(Boolean));
  if (Array.isArray(specials) && specials.length) {
    specialsWrap.appendChild(el("h2", "sp-title", "Special Programmes You May Like"));
    specials.forEach((rec) => {
      const card = el("div", "sp-card", "");
      card.innerHTML = `
        <div class="sp-card-title">${rec.title}</div>
        <div class="sp-card-note">${rec.note || ""}</div>
        <div class="sp-card-link">${linkify({ label: "Learn more", url: rec.url })}</div>
        <div class="sp-footnote">For full details, visit the official NUS page.</div>
      `;
      specialsWrap.appendChild(card);
    });
  } else {
    specialsWrap.appendChild(el("div", "sp-empty", "No special programme recommendations based on your current top choices."));
  }
  page.appendChild(specialsWrap);

  // Make results page scrollable (your CSS should set questions view to fixed height, no scroll)
  page.style.overflowY = "auto";
}

/* ===============================
   2) Sections
================================= */

function buildQualitiesSection(qualities) {
  const wrap = el("section", "results-qualities", "");
  wrap.id = "identifiedQualities";

  const title = el("h2", "rq-title", "Your Identified Qualities");
  const list = el("div", "rq-list", "");

  (qualities || []).forEach((q) => {
    const card = el("div", "rq-chip", "");
    const desc = QUALITY_DESCRIPTIONS[q] || "This quality appeared in your answers.";
    card.innerHTML = `
      <div class="rq-chip-name">${q}</div>
      <div class="rq-chip-desc">${desc}</div>
    `;
    list.appendChild(card);
  });

  if (!qualities || !qualities.length) {
    list.appendChild(el("div", "rq-empty", "Your responses didn’t surface any standout qualities. Try retaking the quiz."));
  }

  wrap.appendChild(title);
  wrap.appendChild(list);
  return wrap;
}

function buildTop5Strip(ids, idx) {
  const wrap = el("section", "top5-section", "");
  wrap.id = "top5Majors";

  const title = el("h2", "top5-title", "Top 5 Recommended Majors");
  const strip = el("div", "top5-strip", "");

  ids.forEach((id, i) => {
    const m = idx.get(id);
    const name = m?.name || id || `Major ${i + 1}`;
    const faculty = m?.faculty || "";
    const cluster = m?.cluster || "";
    const tagline = [faculty, cluster].filter(Boolean).join(" • ");

    const card = el("button", "top5-card", "");
    card.type = "button";
    card.setAttribute("data-major-id", id);
    card.innerHTML = `
      <div class="top5-rank">#${i + 1}</div>
      <div class="top5-name">${name}</div>
      <div class="top5-meta">${tagline}</div>
    `;
    // Clicking a card switches to that tab
    card.addEventListener("click", () => selectRecommendationTab(i));
    strip.appendChild(card);
  });

  if (!ids.length) {
    strip.appendChild(el("div", "top5-empty", "We couldn’t determine your top matches. Try adjusting your answers."));
  }

  wrap.appendChild(title);
  wrap.appendChild(strip);
  return wrap;
}

function buildRecommendationTabs(ids, idx) {
  const wrap = el("section", "rec-tabs-section", "");
  wrap.id = "recommendations";

  // ---- Tabs header
  const tabsBar = el("div", "rec-tabs-bar", "");
  const panels = el("div", "rec-panels", "");

  ids.forEach((id, i) => {
    const m = idx.get(id);
    const tab = el("button", "rec-tab", `Recommendation #${i + 1}`);
    tab.type = "button";
    tab.id = `recTab_${i}`;
    tab.setAttribute("data-panel", `recPanel_${i}`);
    tab.addEventListener("click", () => selectRecommendationTab(i));
    tabsBar.appendChild(tab);

    const panel = el("div", "rec-panel", "");
    panel.id = `recPanel_${i}`;
    panel.setAttribute("role", "tabpanel");
    panel.innerHTML = buildMajorPanelHTML(m, id);
    panels.appendChild(panel);
  });

  // If fewer than 5, fill tabs up to #5 (optional)
  for (let j = ids.length; j < 5; j++) {
    const tab = el("button", "rec-tab rec-tab--disabled", `Recommendation #${j + 1}`);
    tab.type = "button";
    tab.disabled = true;
    tabsBar.appendChild(tab);

    const panel = el("div", "rec-panel rec-panel--empty", "");
    panel.id = `recPanel_${j}`;
    panel.innerHTML = `<div class="rec-empty">No recommendation here yet.</div>`;
    panels.appendChild(panel);
  }

  wrap.appendChild(tabsBar);
  wrap.appendChild(panels);

  // Activate first tab by default
  setTimeout(() => selectRecommendationTab(0), 0);

  return wrap;
}

function buildMajorPanelHTML(maybeMajor, idFallback) {
  // If we don’t have the full major object, show a minimal panel using the ID
  const m = maybeMajor || { id: idFallback, name: idFallback };
  const desc = m.description || "Learn more about this programme via the links below.";
  const qualities = Array.isArray(m.qualities) ? m.qualities : [];
  const res = getResourcesForMajor(m.id) || {};

  // Resources blocks
  const prog = res.programme ? linkify(res.programme) : "";
  const facultyList = (res.faculty || []).map(linkify).join("");
  const generalList = (res.general || []).map(linkify).join("");

  const qualChips = qualities.map(q => `<span class="mp-qual">${q}</span>`).join("");

  return `
    <div class="mp-head">
      <div class="mp-title">${m.name || idFallback}</div>
      <div class="mp-meta">${[m.faculty, m.cluster].filter(Boolean).join(" • ")}</div>
    </div>

    <div class="mp-body">
      <p class="mp-desc">${desc}</p>

      <div class="mp-qualities">
        <div class="mp-qual-title">Key Qualities</div>
        <div class="mp-qual-list">${qualChips || "<span class='mp-qual mp-qual--empty'>—</span>"}</div>
      </div>

      <div class="mp-resources">
        <div class="mp-res-col">
          <div class="mp-res-title">Programme Page</div>
          <div class="mp-res-list">${prog || "<span class='res-empty'>No link available</span>"}</div>
          <div class="mp-footnote">For full details, visit the official programme webpage.</div>
        </div>
        <div class="mp-res-col">
          <div class="mp-res-title">Faculty Resources</div>
          <div class="mp-res-list">${facultyList || "<span class='res-empty'>No links available</span>"}</div>
          <div class="mp-footnote">For more information, see the faculty homepage and resources.</div>
        </div>
        <div class="mp-res-col">
          <div class="mp-res-title">General Application Resources</div>
          <div class="mp-res-list">${generalList || "<span class='res-empty'>No links available</span>"}</div>
          <div class="mp-footnote">Visit NUS Admissions for timelines, requirements, and tips.</div>
        </div>
      </div>
    </div>
  `;
}

/* ===============================
   3) Tabs controller
================================= */

function selectRecommendationTab(index) {
  const tabs = Array.from(document.querySelectorAll(".rec-tab"));
  const panels = Array.from(document.querySelectorAll(".rec-panel"));

  tabs.forEach((t, i) => {
    if (i === index) {
      t.classList.add("active");
      t.setAttribute("aria-selected", "true");
      t.setAttribute("tabindex", "0");
    } else {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
    }
  });

  panels.forEach((p, i) => {
    if (i === index) {
      p.classList.add("active");
      p.removeAttribute("hidden");
    } else {
      p.classList.remove("active");
      p.setAttribute("hidden", "hidden");
    }
  });

  // Ensure first active panel is fully visible if container has internal scroll
  const active = panels[index];
  if (active && active.scrollIntoView) {
    active.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

/* ===============================
   4) PDF Export Hook
================================= */

/**
 * Returns the element that should be printed/saved to PDF.
 * Your existing PDF code can call this to grab the right node.
 * Ensures “Application Resources” blocks don’t split across pages
 * by leaving CSS hooks (.mp-resources { break-inside: avoid; }).
 */
export function prepareResultsForPdf() {
  const node = document.getElementById("resultsPage");
  if (!node) return document.body;

  // Add a class so print styles can reduce shadows/margins, etc.
  node.classList.add("print-ready");
  return node;
}

/* ===============================
   5) Minimal CSS hooks (optional note)
================================= */
/**
 * Ensure your CSS (not included here) has, for example:
 *
 * .results-page { height: 100%; padding: 16px; overflow-y: auto; }
 * .rq-list { display: grid; gap: 12px; }
 * .rq-chip { background: var(--card, #fff); border-radius: 12px; padding: 12px; }
 * .top5-strip { display: grid; grid-auto-flow: column; gap: 12px; overflow-x: auto; }
 * .top5-card { min-width: clamp(180px, 24vw, 260px); }
 * .rec-tabs-bar { display: flex; flex-wrap: wrap; gap: 8px; }
 * .rec-tab.active { background: var(--brand, #1456d9); color: #fff; }
 * .rec-panel { display: none; }
 * .rec-panel.active { display: block; }
 * .mp-resources { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
 * .mp-res-list .res-link { display: block; margin: 6px 0; }
 * .mp-resources, .sp-card { break-inside: avoid; }  // for clean PDF pages
 */
