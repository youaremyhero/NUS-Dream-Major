// js/results.js
import { loadResults } from "./scoring.js";
import { majors } from "./majors.js";
import { resources } from "./resources.js";

window.addEventListener("DOMContentLoaded", () => {
  const data = loadResults();
  if (!data || !data.topMajors) {
    document.getElementById("resultsPage").innerHTML =
      `<div class="results-section"><h2>No results found.</h2>
       <p>Please start the quiz from <a href="./index.html">here</a>.</p></div>`;
    return;
  }
  const topMajors = data.topMajors.map(tm => ({ ...tm, ...(majors.find(m=>m.id===tm.id) || {}) }));

  renderQualities(topMajors);
  renderRecommendations(topMajors);
  renderTopFive(topMajors);
  renderSpecialProgrammes(topMajors);
  renderResources();

  // Tabs
  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab"+btn.dataset.tab).classList.add("active");
    });
  });
});

function renderQualities(topMajors){
  const grid = document.getElementById("qualitiesGrid");
  // Collect unique qualities from majors metadata
  const set = new Set();
  topMajors.forEach(m => (m.qualities||[]).forEach(q => set.add(q)));
  const qualities = Array.from(set);
  grid.innerHTML = qualities.map(q => `
    <div class="quality-card">
      <h3>${q}</h3>
      <p>${qualityDesc(q)}</p>
    </div>`).join("") || "<p class='note'>Qualities will appear once your top majors are identified.</p>";
}

function qualityDesc(q){
  const map = {
    "Analytical Thinking":"You break down complex problems using logic and evidence.",
    "Problem Solving":"You design practical solutions and iterate based on feedback.",
    "Critical Thinking":"You challenge assumptions and evaluate arguments rigorously.",
    "Attention to Detail":"You spot inconsistencies and value precision.",
    "Creativity":"You generate original ideas and enjoy novel approaches.",
    "Communication Skills":"You explain ideas clearly in speech and writing.",
    "Leadership Potential":"You guide teams, align goals, and take responsibility.",
    "Strategic Planning":"You plan for impact and anticipate trade-offs.",
    "Empathy":"You understand needs and perspectives of others.",
    "Collaboration":"You build on others’ ideas and deliver together.",
    "Ethical Thinking":"You consider fairness and impact in decisions.",
    "Adaptability":"You learn fast and thrive with change.",
    "Intercultural Competence":"You work across cultures and viewpoints.",
    "Visionary Thinking":"You connect dots and imagine long-term possibilities.",
    "Discipline":"You organize work and follow through reliably."
  };
  return map[q] || "A strength that showed up in your answers.";
}

function renderRecommendations(topMajors){
  const panels = [document.getElementById("tab1"), document.getElementById("tab2"), document.getElementById("tab3")];
  topMajors.slice(0,3).forEach((m,i)=>{
    const facultyUrl = Object.values(resources.faculties).find(f => (m.faculty||"").includes(f.name.split(" ")[0]))?.url;
    const progUrl = resources.programmes[m.id] || facultyUrl || "#";
    panels[i].innerHTML = `
      <div class="programme-card">
        <h3>${m.name}</h3>
        <p><strong>Faculty:</strong> ${m.faculty || "—"}</p>
        <p><em>Cluster:</em> ${m.cluster || "—"}</p>
        <p>${m.description || ""}</p>
        <p><a href="${progUrl}" target="_blank" rel="noopener">Learn more about ${m.name}</a></p>
        <p class="note">For more information on application details, visit the faculty page.</p>
      </div>`;
  });
}

function renderTopFive(topMajors){
  const strip = document.querySelector(".top5-strip");
  strip.innerHTML = topMajors.slice(0,5).map(m=>{
    const facultyUrl = Object.values(resources.faculties).find(f => (m.faculty||"").includes(f.name.split(" ")[0]))?.url;
    const progUrl = resources.programmes[m.id] || facultyUrl || "#";
    return `<div class="programme-card" role="listitem">
      <h4>${m.name}</h4><p>${m.faculty || ""}</p>
      <a href="${progUrl}" target="_blank" rel="noopener">View Programme</a>
    </div>`;
  }).join("");
}

function renderSpecialProgrammes(topMajors){
  const container = document.getElementById("specialProgrammesList");
  const names = topMajors.map(m=>m.name);
  const cards = matchSpecials(names);
  container.innerHTML = cards.map(c=>`
    <div class="special-card">
      <h4>${c.title}</h4>
      <p>${c.description}</p>
      <p><a href="${c.url}" target="_blank" rel="noopener">For more details, visit the official page</a>.</p>
    </div>`).join("") || "<p class='note'>No specific special programmes to recommend yet.</p>";
}

function matchSpecials(selected){
  const specials = [
    {
      majors:["Business Administration","Communications and New Media"],
      title:"BBA/BBA(Acc) & BSocSci (Communications and New Media)",
      description:"Blend business fundamentals with media strategy. Offered by NUS Business School & CHS.",
      url: resources.registrar.doubleDegree
    },
    {
      majors:["Business Administration","Computer Science"],
      title:"BBA/BBA(Acc) & B.Comp (Computer Science/Information Systems)",
      description:"Combine business leadership with computing depth. Offered by NUS Business School & SoC.",
      url: resources.registrar.doubleDegree
    },
    {
      majors:["Economics","Engineering"],
      title:"B.Eng & BSocSci (Economics)",
      description:"Technical and analytical foundations for infrastructure and policy challenges. Offered by CDE & CHS.",
      url: resources.registrar.doubleDegree
    }
  ];
  return specials.filter(s => s.majors.some(m => selected.includes(m))).slice(0,3);
}

function renderResources(){
  const list = document.getElementById("generalResources");
  list.innerHTML = resources.general.map(r=>`<li><a href="${r.url}" target="_blank" rel="noopener">${r.label}</a></li>`).join("");
}
