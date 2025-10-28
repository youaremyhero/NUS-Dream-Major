// js/main.js
import { QUESTIONS_LIKERT, LIKERT } from "./config/questionsLikert.js";
import { calculateResults, saveResults } from "./scoring.js";
import { renderResultsView } from "./results.js";
import { EXPLORE_PROGRAMMES } from "./content/exploreProgrammes.js";

let current = 0;
const TOTAL_QUESTIONS = QUESTIONS_LIKERT.length;
let answers = new Array(TOTAL_QUESTIONS).fill(null);

// Optional: restore progress (uncomment if you want persistence)
/*
try {
  const saved = JSON.parse(localStorage.getItem("quizProgress"));
  if (saved && Array.isArray(saved.answers) && Number.isInteger(saved.current)) {
    answers = saved.answers.slice(0, TOTAL_QUESTIONS);
    current = Math.min(Math.max(0, saved.current), TOTAL_QUESTIONS - 1);
  }
} catch {}
*/

window.addEventListener("DOMContentLoaded", () => {
  const continueBtn = document.getElementById("continueBtn");
  const backBtn = document.getElementById("btnBack");
  const container = document.getElementById("quizContainer");
  const progressFill = document.getElementById("progressFill");
  const resultsMount = document.getElementById("resultsMount");
  const quizWrapper = document.getElementById("quizWrapper");
  const progressWrap = document.querySelector(".quiz-progress-wrap");
  const restartBtn = document.querySelector("[data-restart]");
  const programmesMount = document.querySelector("[data-programmes-list]");
  const programmesSection = document.querySelector("[data-programmes-section]");

  renderProgrammeHighlights(programmesSection, programmesMount);
  setupNavigationInteractions();
  elevateHeaderOnScroll();

  if (!continueBtn || !container || !progressFill) {
    console.error("[main.js] Missing required DOM elements");
    return;
  }

  continueBtn.addEventListener("click", onNext);
  if (backBtn) backBtn.addEventListener("click", onBack);
  if (restartBtn) {
    restartBtn.addEventListener("click", evt => {
      evt.preventDefault();
      resetQuiz({ container, resultsMount, quizWrapper, progressWrap });
    });
  }

  renderQuestion();

  window.addEventListener("quizResultsSaved", evt => {
    if (evt?.detail) {
      showResultsInline(evt.detail);
    }
  });

  // Restore results if they exist (e.g., after refresh)
  try {
    const cached = JSON.parse(localStorage.getItem("quizResults"));
    if (cached && cached.resultsArray && cached.resultsArray.length) {
      showResultsInline(cached);
    }
  } catch (err) {
    console.warn("[main.js] Unable to restore cached results", err);
  }

  function resetQuiz({ container: quizContainer, resultsMount: mount, quizWrapper: wrapper, progressWrap: bar }) {
    current = 0;
    answers = new Array(TOTAL_QUESTIONS).fill(null);

    if (wrapper) wrapper.classList.remove("quiz-container--results");
    document.body.classList.remove("quiz-showing-results");

    if (quizContainer) {
      quizContainer.removeAttribute("hidden");
      quizContainer.innerHTML = "";
    }
    if (mount) {
      mount.setAttribute("hidden", "true");
      mount.innerHTML = "";
    }

    const footer = document.querySelector(".quiz-footer");
    if (footer) footer.removeAttribute("hidden");
    if (bar) bar.classList.remove("is-hidden");

    try {
      localStorage.removeItem("quizResults");
    } catch (err) {
      console.warn("[main.js] Unable to clear stored results", err);
    }

    renderQuestion();
  }

  function showResultsInline(result) {
    if (!resultsMount || !quizWrapper) return;

    quizWrapper.classList.add("quiz-container--results");
    document.body.classList.add("quiz-showing-results");

    if (container) container.setAttribute("hidden", "true");
    const footer = document.querySelector(".quiz-footer");
    if (footer) footer.setAttribute("hidden", "true");
    if (progressWrap) progressWrap.classList.add("is-hidden");

    resultsMount.removeAttribute("hidden");
    renderResultsView({ mountNode: resultsMount, data: result });

    requestAnimationFrame(() => {
      resultsMount.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});

function renderQuestion() {
  const q = QUESTIONS_LIKERT[current];
  const container = document.getElementById("quizContainer");
  if (!q || !container) return;

  const likertValues = Object.keys(LIKERT.labels)
    .map(Number)
    .sort((a, b) => a - b);

  const likertLabels = likertValues
    .map((val) => {
      const label = LIKERT.labels[val];
      const selected = answers[current] === val;
      return `
        <label 
          class="likert-option ${selected ? "selected" : ""}" 
          tabindex="0"
          role="radio"
          aria-checked="${selected ? "true" : "false"}"
          data-val="${val}"
        >
          <input 
            type="radio" 
            name="q${q.id}" 
            value="${val}" 
            ${selected ? "checked" : ""} 
            aria-label="${label}"
            tabindex="-1"
          />
          <span>${label}</span>
        </label>
      `;
    })
    .join("");

  container.innerHTML = `
    <div class="question-header">
      <h2 id="qTitle">Question ${current + 1} of ${TOTAL_QUESTIONS}</h2>
      <p class="question-text" id="qText">${q.text}</p>
    </div>
    <div class="likert-scale" role="radiogroup" aria-labelledby="qText">
      ${likertLabels}
    </div>
  `;

  updateProgress();
  enableInteraction();
  updateButtons();
  focusInitialOption();
}

function renderProgrammeHighlights(section, mount) {
  if (!mount || !section) return;
  mount.innerHTML = "";

  if (!Array.isArray(EXPLORE_PROGRAMMES) || !EXPLORE_PROGRAMMES.length) {
    section.setAttribute("hidden", "true");
    return;
  }

  section.removeAttribute("hidden");

  EXPLORE_PROGRAMMES.forEach(programme => {
    if (!programme?.title || !programme?.description) return;

    const card = document.createElement("article");
    card.className = "landing-programme-card";
    if (programme.id) {
      card.id = `programme-${programme.id}`;
    }

    const title = document.createElement("h3");
    title.textContent = programme.title;
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = programme.description;
    card.appendChild(desc);

    if (programme.url) {
      const link = document.createElement("a");
      link.className = "btn secondary small";
      link.href = programme.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = programme.ctaLabel || "Learn more";
      card.appendChild(link);
    }

    mount.appendChild(card);
  });
}

function setupNavigationInteractions() {
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (!navLinks.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sectionMap = navLinks
    .map(link => {
      const targetId = link.getAttribute("href");
      if (!targetId) return null;
      const target = document.querySelector(targetId);
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  const setActive = activeLink => {
    navLinks.forEach(link => {
      link.classList.toggle("is-active", link === activeLink);
    });
  };

  navLinks.forEach(link => {
    link.addEventListener("click", evt => {
      const hash = link.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return;
      const target = document.querySelector(hash);
      if (!target) return;
      evt.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
      setActive(link);
    });
  });

  if (sectionMap.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .forEach(entry => {
            const item = sectionMap.find(({ target }) => target === entry.target);
            if (item) {
              setActive(item.link);
            }
          });
      },
      {
        rootMargin: "-55% 0px -40% 0px",
        threshold: [0.25, 0.5, 0.75]
      }
    );

    sectionMap.forEach(({ target }) => observer.observe(target));
  }

  setActive(navLinks[0]);
}

function elevateHeaderOnScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggle = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

function enableInteraction() {
  const optionCards = document.querySelectorAll(".likert-option");
  const inputs = document.querySelectorAll('.likert-option input[type="radio"]');

  optionCards.forEach((card, idx) => {
    // Whole-card click
    card.addEventListener("click", () => {
      const raw = card.dataset.val;
      const val = Number(raw);
      if (!Number.isFinite(val)) return;
      selectOption(val);
    });

    // Keyboard access on the label container
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const raw = card.dataset.val;
        const val = Number(raw);
        if (!Number.isFinite(val)) return;
        selectOption(val);
        return;
      }

      // Arrow navigation across 5 items (roving focus)
      const horizontalNext = () => {
        const next = optionCards[idx + 1] || optionCards[0];
        next.focus();
      };
      const horizontalPrev = () => {
        const prev = optionCards[idx - 1] || optionCards[optionCards.length - 1];
        prev.focus();
      };

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        horizontalNext();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        horizontalPrev();
      }
    });
  });

  // Screen readers / native radio interaction
  inputs.forEach((inp) => {
    inp.addEventListener("change", () => {
      const val = Number(inp.value);
      if (!Number.isFinite(val)) return;
      selectOption(val);
    });
  });
}

function focusInitialOption() {
  // Prefer focusing the selected option, else the first option
  const sel = document.querySelector(".likert-option.selected");
  if (sel) {
    sel.focus();
    return;
  }
  const first = document.querySelector(".likert-option");
  if (first) first.focus();
}

function selectOption(val) {
  answers[current] = val;

  // Update selected classes and aria-checked
  const cards = document.querySelectorAll(".likert-option");
  cards.forEach((card) => {
    const cVal = Number(card.dataset.val);
    const isSelected = cVal === val;
    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-checked", isSelected ? "true" : "false");

    const input = card.querySelector('input[type="radio"]');
    if (input) input.checked = isSelected;
  });

  const continueBtn = document.getElementById("continueBtn");
  if (continueBtn) continueBtn.disabled = false;

  // Optional: persist progress (uncomment if you want)
  /*
  try {
    localStorage.setItem(
      "quizProgress",
      JSON.stringify({ current, answers })
    );
  } catch {}
  */
}

function onNext() {
  if (answers[current] == null) {
    alert("Please select an answer before continuing.");
    return;
  }

  if (current < TOTAL_QUESTIONS - 1) {
    current++;
    renderQuestion();
  } else {
    // Final: compute results and save
    const result = calculateResults(answers);
    saveResults(result);
  }
}

function onBack() {
  if (current > 0) {
    current--;
    renderQuestion();
  }
}

function updateButtons() {
  const continueBtn = document.getElementById("continueBtn");
  const backBtn = document.getElementById("btnBack");
  if (continueBtn) {
    continueBtn.disabled = answers[current] == null;
    continueBtn.textContent = current === TOTAL_QUESTIONS - 1 ? "See Results" : "Continue";
  }
  if (backBtn) {
    const atStart = current === 0;
    backBtn.disabled = atStart;
    backBtn.classList.toggle("is-disabled", atStart);
  }
}

function updateProgress() {
  const fill = document.getElementById("progressFill");
  if (!fill) return;
  fill.style.width = ((current + 1) / TOTAL_QUESTIONS) * 100 + "%";
}
