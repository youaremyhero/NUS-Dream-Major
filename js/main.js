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

  const likertLabels = Object.entries(LIKERT.labels)
    .map(([val, label]) => {
      const selected = answers[current] === Number(val);
      return `
        <label class="likert-option ${selected ? "selected" : ""}" tabindex="0">
          <input type="radio" name="q${q.id}" value="${val}" ${selected ? "checked" : ""}/>
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
  optionCards.forEach((card, idx) => {
    card.addEventListener("click", () => selectOption(idx + 1));
    card.addEventListener("keydown", (e) => {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        selectOption(idx + 1);
      }
    });
  });
}

function selectOption(val) {
  answers[current] = val;
  document.querySelectorAll(".likert-option").forEach((c) => c.classList.remove("selected"));
  const selected = document.querySelectorAll(".likert-option")[val - 1];
  if (selected) selected.classList.add("selected");
  document.getElementById("continueBtn").disabled = false;
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
  continueBtn.disabled = answers[current] == null;
  continueBtn.textContent = current === TOTAL_QUESTIONS - 1 ? "See Results" : "Continue";
  if (backBtn) backBtn.disabled = current === 0;
}

function updateProgress() {
  document.getElementById("progressFill").style.width =
    ((current + 1) / TOTAL_QUESTIONS) * 100 + "%";
}
