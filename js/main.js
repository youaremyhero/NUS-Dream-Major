// js/main.js
import { QUESTIONS_LIKERT, LIKERT } from "./config/questionsLikert.js";
import { calculateResults, saveResults } from "./scoring.js";

let current = 0;
const TOTAL_QUESTIONS = QUESTIONS_LIKERT.length;
let answers = new Array(TOTAL_QUESTIONS).fill(null);

window.addEventListener("DOMContentLoaded", () => {
  const continueBtn = document.getElementById("continueBtn");
  const backBtn = document.getElementById("btnBack");
  const container = document.getElementById("quizContainer");
  const progressFill = document.getElementById("progressFill");

  if (!continueBtn || !container || !progressFill) {
    console.error("[main.js] Missing required DOM elements");
    return;
  }

  continueBtn.addEventListener("click", onNext);
  if (backBtn) backBtn.addEventListener("click", onBack);

  renderQuestion();
});

function renderQuestion() {
  const q = QUESTIONS_LIKERT[current];
  const container = document.getElementById("quizContainer");
  if (!q || !container) return;

  // Sort labels by numeric Likert value to be safe
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
          data-value="${val}"
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
      <h2>Question ${current + 1} of ${TOTAL_QUESTIONS}</h2>
      <p class="question-text">${q.text}</p>
    </div>
    <div class="likert-scale" role="radiogroup" aria-label="Likert scale">
      ${likertLabels}
    </div>
  `;

  updateProgress();
  enableInteraction();
  updateButtons();
}

function enableInteraction() {
  const optionCards = document.querySelectorAll(".likert-option");
  const inputs = document.querySelectorAll('.likert-option input[type="radio"]');

  optionCards.forEach((card, idx) => {
    // Whole-card click
    card.addEventListener("click", () => {
      const val = Number(card.getAttribute("data-value"));
      selectOption(val);
    });

    // Keyboard access on the label container
    card.addEventListener("keydown", (e) => {
      const keys = ["Enter", " "];
      if (keys.includes(e.key)) {
        e.preventDefault();
        const val = Number(card.getAttribute("data-value"));
        selectOption(val);
        return;
      }
      // Arrow navigation across 5 items
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
      selectOption(val);
    });
  });
}

function selectOption(val) {
  answers[current] = val;

  // Update selected classes and aria-checked
  const cards = document.querySelectorAll(".likert-option");
  cards.forEach((card) => {
    const cVal = Number(card.getAttribute("data-value"));
    const isSelected = cVal === val;
    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-checked", isSelected ? "true" : "false");

    // sync the hidden radio too
    const input = card.querySelector('input[type="radio"]');
    if (input) input.checked = isSelected;
  });

  const continueBtn = document.getElementById("continueBtn");
  if (continueBtn) continueBtn.disabled = false;
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
    // Final: send Likert array (1..5) to scoring
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
    backBtn.disabled = current === 0;
    backBtn.classList.toggle("is-disabled", current === 0);
  }
}

function updateProgress() {
  const fill = document.getElementById("progressFill");
  if (!fill) return;
  fill.style.width = ((current + 1) / TOTAL_QUESTIONS) * 100 + "%";
}
