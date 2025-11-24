// js/main.js
import { QUESTIONS_LIKERT, LIKERT } from "./config/questionsLikert.js";
import { calculateResults, saveResults, loadResults } from "./scoring.js";
import { renderResultsView } from "./results.js";
import { WHY_NUS } from "./content/whyNUS.js";
import { EXPLORE_PROGRAMMES } from "./content/exploreProgrammes.js";
import { NEXT_STEPS } from "./content/nextSteps.js";
import { setupNavigationInteractions, elevateHeaderOnScroll, syncHeaderOffsetVariable } from "./navigation.js";

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
  const questionContent = document.getElementById("quizContent");
  const progressFill = document.getElementById("progressFill");
  const resultsMount = document.getElementById("resultsMount");
  const quizWrapper = document.getElementById("quizWrapper");
  const progressWrap = document.querySelector(".quiz-progress-wrap");
  const restartBtn = document.querySelector("[data-restart]");
  const reasonsMount = document.querySelector("[data-reasons-list]");
  const reasonsSection = document.querySelector("[data-reasons-section]");
  const programmesMount = document.querySelector("[data-programmes-list]");
  const programmesSection = document.querySelector("[data-programmes-section]");
  const nextStepsMount = document.querySelector("[data-next-steps-list]");
  const nextStepsSection = document.querySelector("[data-next-steps-section]");
  const themeToggle = document.querySelector("[data-theme-toggle]");

  renderWhyNusHighlights(reasonsSection, reasonsMount);
  renderProgrammeHighlights(programmesSection, programmesMount);
  renderNextSteps(nextStepsSection, nextStepsMount);
  syncHeaderOffsetVariable();
  setupNavigationInteractions();
  elevateHeaderOnScroll();
  setupThemeToggle(themeToggle);

  if (!continueBtn || !container || !progressFill || !questionContent) {
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
    const cached = loadResults();
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
      // Keep the quiz DOM intact so question rendering continues to work
      // (resetting innerHTML removes #quizContent and breaks rendering)
      quizContainer.removeAttribute("hidden");
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

function setupThemeToggle(toggleButton) {
  const root = document.documentElement;
  const storageKey = "quiz-theme";
  const prefersDark = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem(storageKey);
  } catch {}

  const validStored = storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
  let useSystemPreference = !validStored;
  let currentTheme = validStored || (prefersDark?.matches ? "dark" : "light");

  applyTheme(currentTheme);

  if (prefersDark?.addEventListener) {
    prefersDark.addEventListener("change", (event) => {
      if (!useSystemPreference) return;
      currentTheme = event.matches ? "dark" : "light";
      applyTheme(currentTheme);
    });
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      currentTheme = nextTheme;
      useSystemPreference = false;
      applyTheme(nextTheme);
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch {}
    });
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (toggleButton) {
        toggleButton.setAttribute("aria-label", "Switch to light mode");
        toggleButton.innerHTML = "<span aria-hidden=\"true\">☀️</span>";
      }
    } else {
      root.removeAttribute("data-theme");
      if (toggleButton) {
        toggleButton.setAttribute("aria-label", "Switch to dark mode");
        toggleButton.innerHTML = "<span aria-hidden=\"true\">🌙</span>";
      }
    }
  }
}

function renderQuestion() {
  const q = QUESTIONS_LIKERT[current];
  const questionContent = document.getElementById("quizContent");
  if (!q || !questionContent) return;

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

  questionContent.innerHTML = `
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

function renderWhyNusHighlights(section, mount) {
  if (!section || !mount) return;
  mount.innerHTML = "";

  if (!Array.isArray(WHY_NUS) || !WHY_NUS.length) {
    section.setAttribute("hidden", "true");
    return;
  }

  section.removeAttribute("hidden");

  WHY_NUS.forEach(reason => {
    if (!reason?.title || !reason?.description) return;

    const card = document.createElement("article");
    card.className = "landing-card";
    if (reason.id) {
      card.id = `why-nus-${reason.id}`;
    }

    if (reason.badge) {
      const badge = document.createElement("span");
      badge.className = "landing-card__badge";
      badge.textContent = reason.badge;
      card.appendChild(badge);
    }

    const title = document.createElement("h3");
    title.textContent = reason.title;
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = reason.description;
    card.appendChild(desc);

    if (reason.url) {
      const link = document.createElement("a");
      link.className = "btn secondary small";
      link.href = reason.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = reason.ctaLabel || "Learn more";
      card.appendChild(link);
    }

    mount.appendChild(card);
  });
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

    if (programme.badge) {
      const badge = document.createElement("span");
      badge.className = "landing-programme-card__badge";
      badge.textContent = programme.badge;
      card.appendChild(badge);
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

function renderNextSteps(section, mount) {
  if (!section || !mount) return;
  mount.innerHTML = "";

  if (!Array.isArray(NEXT_STEPS) || !NEXT_STEPS.length) {
    section.setAttribute("hidden", "true");
    return;
  }

  section.removeAttribute("hidden");

  NEXT_STEPS.forEach(step => {
    if (!step?.title || !step?.description) return;

    const card = document.createElement("article");
    card.className = "landing-card";
    if (step.id) {
      card.id = `next-step-${step.id}`;
    }

    const title = document.createElement("h3");
    title.textContent = step.title;
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = step.description;
    card.appendChild(desc);

    if (step.url) {
      const link = document.createElement("a");
      link.className = "btn secondary small";
      link.href = step.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = step.ctaLabel || "Learn more";
      card.appendChild(link);
    }

    mount.appendChild(card);
  });
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

  updateProgress();

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
    saveResults(result, { redirect: false });
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
  const answered = answers.filter(answer => answer != null).length;
  const progress = (answered / TOTAL_QUESTIONS) * 100;
  fill.style.width = `${progress}%`;
  fill.setAttribute("aria-valuenow", String(Math.round(progress)));
  fill.setAttribute("data-answered", String(answered));
}
