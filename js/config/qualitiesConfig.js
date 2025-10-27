export const QUALITY_FAMILIES = {
  ANALYTICAL: [
    "Analytical Thinking",
    "Problem Solving",
    "Critical Thinking",
    "Attention to Detail"
  ],
  PEOPLE: [
    "Empathy",
    "Communication Skills",
    "Collaboration",
    "Leadership Potential"
  ],
  CREATIVE: [
    "Creativity",
    "Visionary Thinking"
  ],
  STRUCTURE_VALUES: [
    "Discipline",
    "Ethical Thinking",
    "Strategic Planning",
    "Adaptability",
    "Intercultural Competence",
    "Negotiation",
    "Growth Mindset"
  ]
};

export const CLUSTER_QUALITY_PRIORITY = {
  "Business & Management": [
    "Strategic Planning", "Communication Skills", "Analytical Thinking",
    "Leadership Potential", "Problem Solving", "Attention to Detail", "Adaptability"
  ],
  "Computing & AI": [
    "Problem Solving", "Attention to Detail", "Analytical Thinking",
    "Discipline", "Strategic Planning", "Creativity"
  ],
  "Engineering & Technology": [
    "Problem Solving", "Attention to Detail", "Discipline",
    "Analytical Thinking", "Strategic Planning", "Adaptability"
  ],
  "Design & Architecture": [
    "Creativity", "Visionary Thinking", "Attention to Detail",
    "Problem Solving", "Communication Skills", "Strategic Planning"
  ],
  "Social Sciences": [
    "Empathy", "Communication Skills", "Analytical Thinking",
    "Critical Thinking", "Intercultural Competence", "Collaboration"
  ],
  "Humanities & Cultural Studies": [
    "Critical Thinking", "Communication Skills", "Intercultural Competence",
    "Creativity", "Analytical Thinking", "Ethical Thinking"
  ],
  "Sciences & Quantitative": [
    "Analytical Thinking", "Attention to Detail", "Discipline",
    "Problem Solving", "Critical Thinking", "Strategic Planning"
  ],
  "Health & Life Sciences": [
    "Empathy", "Ethical Thinking", "Discipline",
    "Attention to Detail", "Communication Skills", "Problem Solving"
  ],
  "Law & Legal Studies": [
    "Critical Thinking", "Communication Skills", "Ethical Thinking",
    "Leadership Potential", "Strategic Planning", "Attention to Detail"
  ],
  "Music & Performing Arts": [
    "Creativity", "Discipline", "Communication Skills",
    "Collaboration", "Visionary Thinking", "Empathy"
  ]
};

export const ADJACENT_CLUSTER_MAP = {
  "Law & Legal Studies": [
    "Social Sciences",
    "Humanities & Cultural Studies",
    "Business & Management"
  ],
  "Music & Performing Arts": [
    "Design & Architecture",
    "Humanities & Cultural Studies",
    "Social Sciences"
  ],
  "Design & Architecture": [
    "Engineering & Technology",
    "Humanities & Cultural Studies",
    "Music & Performing Arts"
  ],
  "Computing & AI": [
    "Engineering & Technology",
    "Sciences & Quantitative",
    "Business & Management"
  ],
  "Business & Management": [
    "Computing & AI",
    "Social Sciences",
    "Sciences & Quantitative"
  ],
  "Health & Life Sciences": [
    "Sciences & Quantitative",
    "Social Sciences"
  ],
  "Sciences & Quantitative": [
    "Computing & AI",
    "Engineering & Technology",
    "Health & Life Sciences"
  ],
  "Social Sciences": [
    "Humanities & Cultural Studies",
    "Business & Management",
    "Law & Legal Studies"
  ],
  "Humanities & Cultural Studies": [
    "Social Sciences",
    "Music & Performing Arts",
    "Design & Architecture"
  ],
  "Engineering & Technology": [
    "Computing & AI",
    "Design & Architecture",
    "Sciences & Quantitative"
  ]
};

export const WHY_TEMPLATES_CLUSTER = {
  "Business & Management": ({
    A, B, env = "evidence-based, outcome-driven settings"
  }) =>
    `This programme suits you because you combine ${A} with ${B}, and you enjoy ${env}. In Business & Management, these strengths help you translate insights into strategy and lead teams toward measurable results.`,

  "Computing & AI": ({
    A, B, env = "building reliable systems and iterating solutions"
  }) =>
    `You show strong ${A} and ${B}, and you prefer ${env}. In Computing & AI, this balance supports designing robust software, improving performance, and applying algorithms to real-world challenges.`,

  "Engineering & Technology": ({
    A, B, env = "structured problem-solving and hands-on design"
  }) =>
    `Your mix of ${A} and ${B} aligns with Engineering & Technology, where precise implementation and practical optimisation drive innovation in systems and infrastructure.`,

  "Design & Architecture": ({
    A, B, env = "conceptualising and refining user-centred solutions"
  }) =>
    `With ${A} and ${B}, you thrive in ${env}. In Design & Architecture, this combination helps you merge aesthetics with function to shape meaningful, sustainable spaces and products.`,

  "Social Sciences": ({
    A, B, env = "understanding people and interpreting evidence"
  }) =>
    `You combine ${A} with ${B}. In Social Sciences, this balance helps you examine behaviour, institutions, and communities — and communicate insights that lead to better outcomes.`,

  "Humanities & Cultural Studies": ({
    A, B, env = "interpreting ideas, contexts, and perspectives"
  }) =>
    `Your strengths in ${A} and ${B} fit Humanities & Cultural Studies, where analysis and expression connect texts, histories, and cultures to contemporary understanding.`,

  "Sciences & Quantitative": ({
    A, B, env = "methodical inquiry and data-driven reasoning"
  }) =>
    `You demonstrate ${A} and ${B}. In Sciences & Quantitative fields, these qualities support rigorous investigation, precise measurement, and clear communication of findings.`,

  "Health & Life Sciences": ({
    A, B, env = "ethical decision-making and patient-centered practice"
  }) =>
    `The combination of ${A} and ${B} aligns with Health & Life Sciences, where care, safety, and professional standards guide impactful work for individuals and communities.`,

  "Law & Legal Studies": ({
    A, B, env = "structured reasoning and persuasive advocacy"
  }) =>
    `With ${A} and ${B}, you suit Law & Legal Studies. This area values clarity, argumentation, and ethics — enabling you to evaluate complex issues and present compelling cases.`,

  "Music & Performing Arts": ({
    A, B, env = "disciplined practice and collaborative expression"
  }) =>
    `Your strengths in ${A} and ${B} align with Music & Performing Arts. Consistent craft and creative interpretation are central to developing as a performer, composer, or collaborator.`
};

export const WHY_TEMPLATES_MAJOR = {
  SOC_BA: ({ A, B }) =>
    `This programme suits you because you combine ${A} with ${B}, and you enjoy turning data into clear, actionable decisions. Business Analytics prioritises practical models, communication, and measurable impact in organisational contexts.`,

  SOC_CS: ({ A, B }) =>
    `You show strong ${A} with ${B}, and you prefer hands-on building and improvement. Computer Science values algorithmic thinking, performance optimisation, and clean design patterns that scale.`,

  CHS_PSY: ({ A, B }) =>
    `Your mix of ${A} and ${B} is well-suited to Psychology, where curiosity about human behaviour meets scientific methods. This helps you explore cognition, wellbeing, and evidence-based practice.`,

  LAW_LLB: ({ A, B }) =>
    `With ${A} and ${B}, you suit Law. The field requires clear argumentation, ethical judgement, and structured reasoning to address complex issues and advocate effectively.`,

  MUS_MUS: ({ A, B }) =>
    `You combine ${A} and ${B}, which is essential in Music — dedication to craft supports expressive performance, composition, and collaborative projects.`
};

export const DISPLAY_RULES = {
  // If a family’s score is disproportionately high relative to others,
  // dampen it slightly for DISPLAY PURPOSES (not for scoring).
  softCap: {
    enabled: true,
    ratioThreshold: 1.5,   // if top family > 1.5x next family, apply multiplier
    multiplier: 0.85
  },

  // Never display three qualities from the same family
  maxSameFamilyInDisplay: 2,

  // Prefer to diversify families across the top-3 shown
  preferDifferentFamilies: true
};

// Optional: readable default “environment” phrasing per cluster
export const WHY_DEFAULT_ENV_BY_CLUSTER = {
  "Business & Management": "solving real business problems with evidence-based decisions",
  "Computing & AI": "building reliable systems and iterating practical solutions",
  "Engineering & Technology": "structured problem-solving and hands-on implementation",
  "Design & Architecture": "conceptualising and refining user-centred solutions",
  "Social Sciences": "understanding people and interpreting evidence",
  "Humanities & Cultural Studies": "interpreting ideas, contexts, and perspectives",
  "Sciences & Quantitative": "methodical inquiry and data-driven reasoning",
  "Health & Life Sciences": "ethical decision-making and patient-centered practice",
  "Law & Legal Studies": "structured reasoning and persuasive advocacy",
  "Music & Performing Arts": "disciplined practice and collaborative expression"
};

// Universal fallback: string factory (works even if a major/cluster template is missing)
export const WHY_DEFAULT = ({ A = "Analytical Thinking", B = "Problem Solving", cluster = "" } = {}) => {
  const env = WHY_DEFAULT_ENV_BY_CLUSTER[cluster] || "applying your strengths to real-world challenges";
  return `You combine ${A} and ${B}, which fits well with ${cluster || "this programme"} — where ${env} helps you create impact.`;
};


/** Build a reverse lookup: quality -> family */
export function buildQualityToFamilyIndex(families = QUALITY_FAMILIES) {
  const map = {};
  Object.entries(families).forEach(([fam, list]) => {
    list.forEach(q => { map[q] = fam; });
  });
  return map;
}

/**
 * Apply a soft-cap to the top family if it’s much higher than the second.
 * familyScores: { FAMILY_ID: number }
 */
export function applyFamilySoftCap(familyScores, rules = DISPLAY_RULES.softCap) {
  if (!rules?.enabled) return { ...familyScores };
  const arr = Object.entries(familyScores);
  if (!arr.length) return { ...familyScores };

  const sorted = arr.sort((a,b) => b[1] - a[1]);
  if (sorted.length < 2) return { ...familyScores };

  const [topFam, topVal] = sorted[0];
  const [, secondVal] = sorted[1];

  if (secondVal > 0 && (topVal / secondVal) > rules.ratioThreshold) {
    return { ...familyScores, [topFam]: topVal * rules.multiplier };
  }
  return { ...familyScores };
}

/**
 * Pick top 3 qualities for display:
 * - Start from user’s qualityScores (e.g., aggregated from answers)
 * - Nudge using cluster priority
 * - Enforce diversity across families
 */
export function pickTop3DisplayQualities({
  qualityScores = {},             // { "Analytical Thinking": 42, ... }
  clusterName = "",               // e.g., "Computing & AI"
  families = QUALITY_FAMILIES,
  clusterPriority = CLUSTER_QUALITY_PRIORITY,
  rules = DISPLAY_RULES
}) {
  const q2fam = buildQualityToFamilyIndex(families);

  // Step 1: create a weighted ranking using cluster display priorities
  const priorityList = clusterPriority[clusterName] || [];
  const ranked = Object.entries(qualityScores).map(([q, score]) => {
    const pIndex = priorityList.indexOf(q);
    // small boost if the quality is early in the cluster priority
    const boost = pIndex >= 0 ? (1 + (priorityList.length - pIndex) * 0.02) : 1;
    return { q, score: score * boost, fam: q2fam[q] || "OTHER" };
  }).sort((a,b) => b.score - a.score);

  // Step 2: enforce diversity constraints
  const familyCount = {};
  const picked = [];

  for (const item of ranked) {
    const fam = item.fam;
    const count = familyCount[fam] || 0;

    // rule: never allow 3 from the same family
    if (count >= (rules.maxSameFamilyInDisplay || 2)) continue;

    // preferDifferentFamilies: try to diversify at least among first 2 picks
    if (rules.preferDifferentFamilies && picked.length < 2) {
      if (picked.some(p => p.fam === fam)) {
        // If we already have one from this family among first 2,
        // try to skip to diversify — but if no alternative exists, allow later.
        const hasAlternative = ranked.some(r =>
          !picked.includes(r) && (familyCount[r.fam] || 0) < (rules.maxSameFamilyInDisplay || 2) && r.fam !== fam
        );
        if (hasAlternative) continue;
      }
    }

    picked.push(item);
    familyCount[fam] = count + 1;
    if (picked.length === 3) break;
  }

  // Fallback if < 3 found
  while (picked.length < 3 && ranked[picked.length]) picked.push(ranked[picked.length]);

  return picked.map(p => p.q);
}
