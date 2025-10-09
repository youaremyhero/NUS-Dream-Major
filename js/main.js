// js/main.js
import { QUESTIONS } from "./questions.js";
import { calculateResults, saveResults } from "./scoring.js";

let current = 0;
let answers = new Array(TOTAL_QUESTIONS).fill(null);

window.addEventListener("DOMContentLoaded", () => {
  render();
  document.getElementById("questionForm").addEventListener("submit", onNext);
  document.getElementById("btnBack").addEventListener("click", onBack);
});

function render(){
  const q = questions[current];
  document.getElementById("qNum").textContent = `Question ${current+1} of ${TOTAL_QUESTIONS}`;
  document.getElementById("question").textContent = q.text;
  const opts = q.options.map((opt,i)=>`
    <label class="option-card" tabindex="0">
      <input type="radio" name="q${q.id}" value="${i}" ${answers[current]===i ? "checked":""}>
      ${opt.text}
    </label>`).join("");
  document.getElementById("options").innerHTML = opts;
  document.getElementById("progress").style.width = (((current+1)/TOTAL_QUESTIONS)*100)+"%";
  document.getElementById("question").focus();

  document.querySelectorAll(".option-card").forEach((card, idx) => {
    card.addEventListener("click", () => {
      answers[current] = idx;
      document.querySelectorAll(".option-card").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
    });
  });
}

function onNext(e){
  e.preventDefault();
  if (answers[current] == null) { alert("Please select an answer before continuing."); return; }
  if (current < TOTAL_QUESTIONS-1){ current++; render(); }
  else {
    const result = calculateResults(answers);
    saveResults(result);
  }
}

function onBack(){
  if (current > 0){ current--; render(); }
}
