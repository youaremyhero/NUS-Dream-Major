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


// Renders the Results view: top qualities, top majors strip, tabs with majors/clusters, resources, and special programmes
import { majorsBatch1, majorsBatch2, majorsBatch3, majorsBatch4, majorsBatch5 } from "./majors.js";
import { getResourcesForMajor, getSpecialProgrammeRecs } from "./results-helpers.js";

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

// Confetti (fire once on results load)
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
// Public API
// -----------------------------
/**
 * Call this AFTER scoring is done.
 * @param {Object} opts
 * @param {string[]} opts.topMajorIds - ranked (best → fifth)
 * @param {string[]} opts.identifiedQualities - top qualities extracted from answers
 */
export function renderResultsPage({ topMajorIds = [], identifiedQualities = [] }) {
  const container = $("#resultsRoot") || mountResultsRoot();
  container.innerHTML = ""; // reset

  // Keep a stable URL for the results page without breaking subdirectory hosting
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

  // Empty-state guard
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

  // Build sections
  container.appendChild(renderQualities(identifiedQualities));
  container.appendChild(renderTopMajorsStrip(topMajorIds));
  container.appendChild(renderTabs(topMajorIds));

  // Optional: scroll to top of container (page itself remains scrollable only inside results)
  container.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Returns the DOM node you want to pass to your html2pdf (or similar).
 * Keeps the PDF export stable and self-contained.
 */
export function prepareResultsForPdf() {
  // Export the whole results container
  return $("#resultsRoot");
}

// -----------------------------
// Mounting root
// -----------------------------
function mountResultsRoot() {
  // Expected DOM scaffold:
  // <main id="resultsPage">
  //   <div id="resultsRoot" class="results-root"></div>
  // </main>
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
// Section: Identified Qualities
// -----------------------------
function renderQualities(qualities = []) {
  const wrap = el("section", { className: "results-section qualities-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Your Top Qualities" }));

  // Student-friendly descriptions
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
// Section: Top 5 majors strip (horizontal)
// -----------------------------
function renderTopMajorsStrip(topIds = []) {
  const wrap = el("section", { className: "results-section topmajors-section" });
  wrap.appendChild(el("h2", { className: "section-title", text: "Your Top 5 Matches" }));

  const rail = el("div", { className: "topmajors-rail", attrs: { role: "list" } });

  topIds.slice(0, 5).forEach((id, i) => {
    const m = byId[id];
    if (!m) return;
    const item = el("article", { className: "topmajor-card", attrs: { role: "listitem" } });
    const rank = el("div", { className: "rank-badge", text: String(i + 1) });
    const title = el("h3", { className: "topmajor-title", text: m.name });
    const fac = el("div", { className: "topmajor-faculty", text: m.faculty });
    const cluster = el("div", { className: "topmajor-cluster", text: m.cluster });
    const blurb = el("p", { className: "topmajor-blurb", text: m.description });

    // “More info” CTA: scroll user to tabs below, selecting the same major
    const btn = el("button", {
      className: "btn btn-moreinfo",
      text: "More info",
      attrs: { "data-major-id": m.id }
    });
    btn.addEventListener("click", () => selectTabForMajor(m.id));

    item.append(rank, title, fac, cluster, blurb, btn);
    rail.appendChild(item);
  });

  wrap.appendChild(rail);

  // Note
  wrap.appendChild(
    el("p", {
      className: "link-note",
      text: "Tap a major to view its description and resources. For detailed admissions info, see the links in each tab."
    })
  );

  return wrap;
}

// -----------------------------
// Section: Tabs (Majors + Cluster + Special Programmes)
// -----------------------------
function renderTabs(topIds = []) {
  const wrap = el("section", { className: "results-section tabs-section" });

  // Tabs header
  const tablist = el("div", { className: "tabs-header", attrs: { role: "tablist", "aria-label": "Results tabs" } });

  // Tab panels container
  const panels = el("div", { className: "tabs-panels" });

  // 1) Major tabs (Recommendation #1..#5)
  const majors = topIds.slice(0, 5).map((id, idx) => ({
    id,
    label: `Recommendation #${idx + 1}`,
    type: "major"
  }));

  // 2) Cluster tab (groups similar majors at the faculty/cluster level)
  const clusterName = inferClusterName(topIds[0]); // base cluster from top match
  const clusterTab = { id: `CLUSTER_${sanitizeId(clusterName)}`, label: "Explore Similar Majors", type: "cluster" };

  // 3) Special Programmes tab
  const spTab = { id: "TAB_SPECIAL_PROGRAMMES", label: "Special Programmes", type: "special" };

  const allTabs = [...majors, clusterTab, spTab];

  allTabs.forEach((t, i) => {
    const tabBtn = el("button", {
      className: "tab-btn",
      text: t.label,
      attrs: {
        role: "tab",
        "data-tab-id": t.id,
        "aria-selected": i === 0 ? "true" : "false",
        id: `tab_${t.id}`,
        tabindex: i === 0 ? "0" : "-1"
      }
    });
    tabBtn.addEventListener("click", () => selectTab(t.id, tablist, panels));
    tablist.appendChild(tabBtn);

    // Panel
    let panel;
    if (t.type === "major") {
      panel = renderMajorPanel(t.id, topIds);
    } else if (t.type === "cluster") {
      panel = renderClusterPanel(clusterName);
    } else {
      panel = renderSpecialProgrammesPanel(topIds);
    }

    // Accessibility wiring for panel
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `tab_${t.id}`);
    panel.id = `panel_${t.id}`;

    if (i !== 0) panel.classList.add("is-hidden");
    panels.appendChild(panel);
  });

  wrap.append(tablist, panels);
  return wrap;
}

function selectTab(tabId, tablist, panels) {
  // header
  $all(".tab-btn", tablist).forEach(btn => {
    const on = btn.getAttribute("data-tab-id") === tabId;
    btn.setAttribute("aria-selected", on ? "true" : "false");
    btn.setAttribute("tabindex", on ? "0" : "-1");
  });
  // panels
  $all(".tab-panel", panels).forEach(p => {
    if (p.id === `panel_${tabId}`) p.classList.remove("is-hidden");
    else p.classList.add("is-hidden");
  });
}

function selectTabForMajor(majorId) {
  const panels = $(".tabs-panels");
  const tablist = $(".tabs-header");
  if (!panels || !tablist) return;
  const btn = $(`.tab-btn[role="tab"][data-tab-id="${majorId}"]`, tablist);
  if (btn) btn.click();
}

function renderMajorPanel(majorId, topIds) {
  const m = byId[majorId];
  const panel = el("div", { className: "tab-panel" });

  if (!m) {
    panel.appendChild(el("p", { className: "muted", text: "This major is not available." }));
    return panel;
  }

  const head = el("div", { className: "panel-head" });
  head.appendChild(el("h3", { className: "panel-title", text: m.name }));
  head.appendChild(el("div", { className: "panel-sub", text: `${m.faculty} • ${m.cluster}` }));

  const body = el("div", { className: "panel-body" });
  body.appendChild(el("p", { className: "major-desc", text: m.description }));

  // Resources
  const res = getResourcesForMajor(m.id, m);
  body.appendChild(renderLinksBlock("Application Resources (General)", res.general));
  if (res.faculty?.length) body.appendChild(renderLinksBlock(`${m.faculty} Resources`, res.faculty));
  if (res.major?.length) body.appendChild(renderLinksBlock(`${m.name} Resources`, res.major));

  // Direct users for more info
  body.appendChild(
    el("p", {
      className: "fineprint",
      text: "For full details on this programme (structure, admission, and FAQs), visit the official page linked above."
    })
  );

  panel.append(head, body);
  return panel;
}

function renderClusterPanel(baseClusterName = "") {
  const panel = el("div", { className: "tab-panel" });

  // simple cluster expansion: show other majors within the same cluster label (deduped)
  const seen = new Set();
  const peers = ALL_MAJORS.filter(m => m.cluster === baseClusterName)
    .filter(m => (seen.has(m.id) ? false : (seen.add(m.id), true)));

  panel.appendChild(el("h3", { className: "panel-title", text: `Explore Similar Majors (${baseClusterName})` }));
  if (!peers.length) {
    panel.appendChild(el("p", { className: "muted", text: "No closely related majors found." }));
    return panel;
  }

  const grid = el("div", { className: "cluster-grid" });
  peers.forEach(m => {
    const card = el("article", { className: "cluster-card" });
    card.appendChild(el("h4", { className: "cluster-major-title", text: m.name }));
    card.appendChild(el("p", { className: "cluster-major-desc", text: m.description }));
    const btn = el("button", { className: "btn btn-moreinfo", text: "View tab", attrs: { "data-major-id": m.id } });
    btn.addEventListener("click", () => selectTabForMajor(m.id));
    card.appendChild(btn);
    grid.appendChild(card);
  });

  panel.appendChild(grid);
  panel.appendChild(
    el("p", {
      className: "fineprint",
      text: "Tip: Use the tabs above to jump into each major’s description and resources."
    })
  );

  return panel;
}

function renderSpecialProgrammesPanel(topIds = []) {
  const panel = el("div", { className: "tab-panel" });

  panel.appendChild(el("h3", { className: "panel-title", text: "Special Programmes Recommendation" }));

  const recs = getSpecialProgrammeRecs(topIds);
  if (!recs.length) {
    panel.appendChild(
      el("p", {
        className: "muted",
        text: "Your selections don’t strongly match any specific Double/Concurrent/Joint programme patterns. Explore faculty resources for more options."
      })
    );
    return panel;
  }

  const list = el("div", { className: "sp-list" });
  recs.forEach(r => {
    const item = el("article", { className: "sp-item" });
    item.appendChild(el("h4", { className: "sp-title", text: r.title }));
    item.appendChild(el("p", { className: "sp-desc", text: r.description }));
    // Final line to direct users to official page
    item.appendChild(
      el("p", {
        className: "fineprint",
        text: "For programme structure, eligibility, and application details, visit the official Special Programmes page."
      })
    );
    list.appendChild(item);
  });

  panel.appendChild(list);
  return panel;
}

// -----------------------------
// Helpers
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

function sanitizeId(str = "") {
  return String(str).toUpperCase().replace(/\s+/g, "_").replace(/[^\w_-]/g, "");
}

function inferClusterName(top1Id) {
  const m = byId[top1Id];
  return m?.cluster || "Explore Programmes";
}
