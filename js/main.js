// js/main.js
import { QUESTIONS } from "./questions.js";
import { calculateResults, saveResults } from "./scoring.js";

let current = 0;
const TOTAL_QUESTIONS = QUESTIONS.length;
let answers = new Array(TOTAL_QUESTIONS).fill(null);

window.addEventListener("DOMContentLoaded", () => {
  // Guard required elements
  const continueBtn = document.getElementById("continueBtn");
  const backBtn = document.getElementById("btnBack"); // optional
  const container = document.getElementById("quizContainer");
  const progressFill = document.getElementById("progressFill");

  if (!continueBtn || !container || !progressFill) {
    console.error("[main.js] Missing required DOM elements (#continueBtn, #quizContainer, #progressFill)");
    return;
  }

  // Attach events
  continueBtn.addEventListener("click", onNext);
  if (backBtn) backBtn.addEventListener("click", onBack);

  renderQuestion(); // initial render
});

function renderQuestion() {
  const q = QUESTIONS[current];
  const container = document.getElementById("quizContainer");

  container.innerHTML = `
    <div class="question-header">
      <h2>Question ${current + 1} of ${TOTAL_QUESTIONS}</h2>
      <p class="question-text">${q.text}</p>
    </div>

    <div class="options-list" role="radiogroup" aria-label="Options for current question">
      ${q.options
        .map(
          (opt, i) => `
        <label class="option-card ${answers[current] === i ? "selected" : ""}" tabindex="0">
          <input type="radio" name="q${q.id}" value="${i}" ${answers[current] === i ? "checked" : ""} />
          <span>${opt.text}</span>
        </label>
      `
        )
        .join("")}
    </div>
  `;

  updateProgress();

  // Enable selection via click/keyboard
  const optionCards = container.querySelectorAll(".option-card");
  optionCards.forEach((card, idx) => {
    // Mouse click
    card.addEventListener("click", () => selectOption(idx));
    // Keyboard
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectOption(idx);
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = optionCards[idx + 1] || optionCards[0];
        next.focus();
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = optionCards[idx - 1] || optionCards[optionCards.length - 1];
        prev.focus();
      }
    });
  });

  // Also listen to radio change directly (for screen readers / assistive tech)
  container.querySelectorAll('input[type="radio"]').forEach((inp, idx) => {
    inp.addEventListener("change", () => selectOption(idx));
  });

  // Footer buttons
  const continueBtn = document.getElementById("continueBtn");
  const backBtn = document.getElementById("btnBack");

  continueBtn.disabled = answers[current] == null;
  continueBtn.textContent = current === TOTAL_QUESTIONS - 1 ? "See Results" : "Continue";

  if (backBtn) {
    if (current === 0) {
      backBtn.disabled = true;
      backBtn.classList.add("is-disabled");
    } else {
      backBtn.disabled = false;
      backBtn.classList.remove("is-disabled");
    }
  }
}

function selectOption(idx) {
  answers[current] = idx;

  const container = document.getElementById("quizContainer");
  container.querySelectorAll(".option-card").forEach((c) => c.classList.remove("selected"));
  const selected = container.querySelectorAll(".option-card")[idx];
  if (selected) selected.classList.add("selected");

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
    // Final: score → save → go to results page
    const result = calculateResults(answers);
    saveResults(result);
    window.location.href = "results.html";
  }
}

function onBack() {
  if (current > 0) {
    current--;
    renderQuestion();
  }
}

function updateProgress() {
  const progressFill = document.getElementById("progressFill");
  progressFill.style.width = ((current + 1) / TOTAL_QUESTIONS) * 100 + "%";
}
