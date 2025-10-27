/**
 * matchConfig.js
 * Central config for cluster taxonomy, adjacency, “Why this fits” copy templates,
 * qualities blurbs, and small helper utilities to make wiring in results.js easier.
 *
 * You can edit this file without touching scoring or UI logic.
 */

/* ---------------------------------------------
 * 1) Cluster taxonomy (canonical names)
 * --------------------------------------------- */
export const CLUSTERS = [
  "Business & Management",
  "Computing & AI",
  "Engineering & Technology",
  "Design & Architecture",
  "Social Sciences",
  "Humanities & Cultural Studies",
  "Sciences & Quantitative",
  "Health & Life Sciences",
  "Law & Legal Studies",
  "Music & Performing Arts"
];

/* ---------------------------------------------
 * 2) Adjacent cluster map (weighted)
 * Use this when a user’s top cluster has few majors.
 * Values ~0.1–0.6; higher = more relevant/adjacent.
 * --------------------------------------------- */
export const ADJACENT_MAP = {
  "Business & Management": [
    { cluster: "Computing & AI", weight: 0.40 },
    { cluster: "Social Sciences", weight: 0.30 },
    { cluster: "Sciences & Quantitative", weight: 0.20 },
    { cluster: "Engineering & Technology", weight: 0.20 }
  ],
  "Computing & AI": [
    { cluster: "Engineering & Technology", weight: 0.50 },
    { cluster: "Sciences & Quantitative", weight: 0.40 },
    { cluster: "Business & Management", weight: 0.30 },
    { cluster: "Design & Architecture", weight: 0.20 }
  ],
  "Engineering & Technology": [
    { cluster: "Computing & AI", weight: 0.50 },
    { cluster: "Design & Architecture", weight: 0.30 },
    { cluster: "Sciences & Quantitative", weight: 0.30 },
    { cluster: "Business & Management", weight: 0.20 }
  ],
  "Design & Architecture": [
    { cluster: "Engineering & Technology", weight: 0.40 },
    { cluster: "Humanities & Cultural Studies", weight: 0.30 },
    { cluster: "Social Sciences", weight: 0.20 },
    { cluster: "Music & Performing Arts", weight: 0.20 }
  ],
  "Social Sciences": [
    { cluster: "Humanities & Cultural Studies", weight: 0.50 },
    { cluster: "Business & Management", weight: 0.30 },
    { cluster: "Law & Legal Studies", weight: 0.20 },
    { cluster: "Music & Performing Arts", weight: 0.10 }
  ],
  "Humanities & Cultural Studies": [
    { cluster: "Social Sciences", weight: 0.50 },
    { cluster: "Music & Performing Arts", weight: 0.30 },
    { cluster: "Design & Architecture", weight: 0.20 },
    { cluster: "Law & Legal Studies", weight: 0.10 }
  ],
  "Sciences & Quantitative": [
    { cluster: "Computing & AI", weight: 0.40 },
    { cluster: "Engineering & Technology", weight: 0.30 },
    { cluster: "Business & Management", weight: 0.20 },
    { cluster: "Health & Life Sciences", weight: 0.20 }
  ],
  "Health & Life Sciences": [
    { cluster: "Sciences & Quantitative", weight: 0.40 },
    { cluster: "Social Sciences", weight: 0.20 }
  ],
  "Law & Legal Studies": [
    { cluster: "Social Sciences", weight: 0.40 },
    { cluster: "Business & Management", weight: 0.20 },
    { cluster: "Humanities & Cultural Studies", weight: 0.20 }
  ],
  "Music & Performing Arts": [
    { cluster: "Humanities & Cultural Studies", weight: 0.50 },
    { cluster: "Social Sciences", weight: 0.20 },
    { cluster: "Design & Architecture", weight: 0.20 }
  ]
};

/* ---------------------------------------------
 * 3) “Why this fits” templates
 * Priority: major-specific > cluster-specific > generic
 * Use {{tokens}} for replacement with fillTemplate()
 * --------------------------------------------- */
export const WHY_TEMPLATES = {
  generic:
    "Your strengths in {{qualitiesList}} align well with {{majorName}} within the {{clusterName}} cluster. " +
    "You’re likely to enjoy modules that emphasise {{themes}} and thrive in roles such as {{careers}}.",

  cluster: {
    "Business & Management":
      "Your blend of {{qualitiesList}} suggests a strong fit for business contexts where you’ll interpret data, influence people, and make decisions under constraints. " +
      "In {{majorName}}, you’ll practise applying strategy and communication to real-world cases and internships.",
    "Computing & AI":
      "Your strengths in {{qualitiesList}} match the iterative, problem-solving nature of computing. " +
      "{{majorName}} values structured thinking, experimentation, and building scalable solutions.",
    "Engineering & Technology":
      "With {{qualitiesList}}, you’re primed for engineering: translating theory into practical systems. " +
      "Expect hands-on labs, design projects, and multi-disciplinary teamwork in {{majorName}}.",
    "Design & Architecture":
      "Your {{qualitiesList}} align with design disciplines that balance creativity with constraints. " +
      "{{majorName}} will develop your eye for detail, user-centred thinking, and iterative prototyping.",
    "Social Sciences":
      "Your {{qualitiesList}} suggest you’ll do well in evidence-based analysis of people and institutions. " +
      "{{majorName}} emphasises research methods, critical reflection, and policy-relevant thinking.",
    "Humanities & Cultural Studies":
      "Your {{qualitiesList}} fit inquiry into texts, culture, and ideas. " +
      "{{majorName}} sharpens close reading, argumentation, and persuasive communication.",
    "Sciences & Quantitative":
      "Your {{qualitiesList}} map to scientific and quantitative reasoning. " +
      "{{majorName}} develops experimental design, mathematical rigour, and data interpretation.",
    "Health & Life Sciences":
      "Your {{qualitiesList}} align with patient-centred and lab-based disciplines. " +
      "{{majorName}} blends scientific knowledge with ethical responsibility and teamwork.",
    "Law & Legal Studies":
      "Your {{qualitiesList}} support precise reasoning, argumentation, and advocacy. " +
      "{{majorName}} builds legal analysis, writing, and judgement under complexity.",
    "Music & Performing Arts":
      "Your {{qualitiesList}} align with artistic training that demands discipline and expression. " +
      "{{majorName}} focuses on performance craft, collaboration, and creative interpretation."
  },

  // Selected major overrides (add more as you wish)
  major: {
    "LAW_LLB":
      "Your strengths in {{qualitiesList}} align with {{majorName}}. You value structured reasoning and ethical judgement, " +
      "which are crucial in legal analysis and advocacy. Expect intensive writing, case discussion, moot preparation, and internships.",
    "MED_MBBS":
      "Your {{qualitiesList}} are essential for {{majorName}} — compassion for patients, attention to detail, and disciplined study. " +
      "You’ll develop clinical decision-making, communication, and teamwork under real clinical supervision.",
    "DEN_BDS":
      "Your {{qualitiesList}} align with the hands-on precision and patient care central to {{majorName}}. " +
      "You’ll gain early clinical exposure, manual skills, and a strong foundation in biomedical sciences.",
    "NUR_NURS":
      "Your {{qualitiesList}} match the collaborative, patient-centred nature of {{majorName}}. " +
      "You’ll build clinical practice, communication, and leadership for multidisciplinary teams.",
    "MUS_MUS":
      "Your {{qualitiesList}} support artistic growth in {{majorName}}. " +
      "You’ll train in performance, theory, and ensemble work while developing a unique musical voice.",
    "SOC_CS":
      "Your {{qualitiesList}} indicate strong fit for {{majorName}}. " +
      "You’ll deepen algorithmic thinking and systems design through projects, labs, and internships.",
    "SOC_AI":
      "Your {{qualitiesList}} align with learning systems and automation in {{majorName}}. " +
      "Expect courses in ML, optimization, and applied AI ethics alongside implementation projects.",
    "SOC_BA":
      "Your {{qualitiesList}} are ideal for {{majorName}} — connecting data to decisions. " +
      "You’ll practise analytics, visualisation, and stakeholder communication with real datasets.",
    "BIZ_ACC":
      "Your {{qualitiesList}} fit {{majorName}} where precision, integrity, and business understanding matter. " +
      "You’ll develop financial reporting, audit, and analytics skills valued across industries.",
    "DES_ARCH":
      "Your {{qualitiesList}} match the synthesis of aesthetics, function, and context in {{majorName}}. " +
      "Studios will sharpen spatial thinking, critique, and iterative problem-solving.",
    "DES_ID":
      "Your {{qualitiesList}} align with user-centred innovation in {{majorName}}. " +
      "You’ll explore research, prototyping, and systems thinking to deliver impactful designs.",
    "CHS_PSY":
      "Your {{qualitiesList}} align with {{majorName}}’s emphasis on research, empathy, and applied interventions. " +
      "You’ll learn experimental design, statistics, and evidence-based practice.",
    "CHS_ECON":
      "Your {{qualitiesList}} support abstract modelling and policy thinking in {{majorName}}. " +
      "You’ll practise micro/macro theory, econometrics, and applications to markets and public policy."
  }
};

/* ---------------------------------------------
 * 4) Qualities blurbs (student-friendly)
 * --------------------------------------------- */
export const QUALITIES_TEXT = {
  "Analytical Thinking": "You break down complex problems and make sense of data and patterns.",
  "Creativity": "You generate fresh ideas and enjoy imaginative problem-solving.",
  "Leadership Potential": "You take initiative and bring people together to deliver results.",
  "Empathy": "You understand others’ experiences and value people-centric outcomes.",
  "Communication Skills": "You explain ideas clearly — through writing, visuals or speaking.",
  "Intercultural Competence": "You’re curious about cultures and collaborate across differences.",
  "Attention to Detail": "You notice the small things that improve quality and safety.",
  "Problem Solving": "You enjoy figuring out solutions and testing what works.",
  "Ethical Thinking": "You care about doing the right thing — even when it’s hard.",
  "Discipline": "You can focus, follow through and keep high standards.",
  "Negotiation": "You work towards win-win outcomes across different needs.",
  "Adaptability": "You learn fast and stay calm when things change.",
  "Collaboration": "You enjoy teamwork and shared goals.",
  "Critical Thinking": "You evaluate evidence and challenge assumptions.",
  "Visionary Thinking": "You imagine what’s next and connect today’s work to future impact.",
  "Strategic Planning": "You align resources and steps to reach bigger goals.",
  "Growth Mindset": "You believe skills grow with effort and feedback."
};

/* ---------------------------------------------
 * 5) Small helper utilities for later wiring
 * --------------------------------------------- */

/**
 * Return adjacent clusters by descending weight.
 * If base cluster is missing or has no mapping, return [].
 */
export function getAdjacentClusters(clusterName, { limit = 3 } = {}) {
  const arr = ADJACENT_MAP[clusterName] || [];
  const sorted = [...arr].sort((a, b) => b.weight - a.weight);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

/**
 * Replace {{tokens}} in a template string with data[key].
 * Missing keys are replaced with empty strings.
 */
export function fillTemplate(template, data = {}) {
  return String(template).replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, key) => {
    const val = key.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), data);
    return val != null ? String(val) : "";
  });
}

/**
 * Given your majors index or metadata, derive the cluster for a major id.
 * Pass a map like: { [id]: { cluster: "..." , name: "..."} }
 */
export function getClusterForMajor(majorId, majorsIndex) {
  return majorsIndex?.[majorId]?.cluster || null;
}

/**
 * Build default content for themes/careers if you don’t have major-level copy yet.
 * You can customise these per cluster below.
 */
function defaultThemesForCluster(cluster) {
  const map = {
    "Business & Management": "strategy, markets, analytics, and organisational behaviour",
    "Computing & AI": "algorithms, software engineering, data structures, and machine learning",
    "Engineering & Technology": "design, systems, modelling, and applied physics",
    "Design & Architecture": "studio work, prototyping, aesthetics, and user-centred methods",
    "Social Sciences": "research methods, policy analysis, and evidence-based reasoning",
    "Humanities & Cultural Studies": "close reading, critical theory, and persuasive writing",
    "Sciences & Quantitative": "lab work, mathematical modelling, and data interpretation",
    "Health & Life Sciences": "clinical knowledge, ethics, and team-based care",
    "Law & Legal Studies": "case analysis, legal writing, and advocacy",
    "Music & Performing Arts": "performance practice, theory, and ensemble collaboration"
  };
  return map[cluster] || "core methods and applied practice";
}

function defaultCareersForCluster(cluster) {
  const map = {
    "Business & Management": "analyst, consultant, product or operations roles",
    "Computing & AI": "software engineer, data/ML engineer, product technologist",
    "Engineering & Technology": "design engineer, systems engineer, project engineer",
    "Design & Architecture": "designer, architect, UX roles, creative technologist",
    "Social Sciences": "policy, research, community development, public service",
    "Humanities & Cultural Studies": "communications, education, creative industries",
    "Sciences & Quantitative": "research, analytics, scientific computing",
    "Health & Life Sciences": "clinical practice, public health, biomedical industries",
    "Law & Legal Studies": "legal practice, compliance, policy",
    "Music & Performing Arts": "performer, educator, composer, creative industries"
  };
  return map[cluster] || "professional roles across related industries";
}

/**
 * Main selector for “Why this fits” explanation.
 * Priority:
 *  1) Major-level template (WHY_TEMPLATES.major[majorId])
 *  2) Cluster-level template (WHY_TEMPLATES.cluster[clusterName])
 *  3) Generic template (WHY_TEMPLATES.generic)
 *
 * Returns final text with tokens resolved.
 */
export function pickWhyFit({
  majorId,
  majorName,
  clusterName,
  userQualities = [],            // array of quality strings (ranked)
  qualitiesTextMap = QUALITIES_TEXT,
  override = {}                  // { themes, careers, template }
} = {}) {
  const qualitiesTop3 = userQualities.slice(0, 3);
  const qualitiesListReadable =
    qualitiesTop3.length
      ? qualitiesTop3.join(", ")
      : (userQualities[0] || "your core strengths");

  // Choose template
  const template =
    override.template ||
    WHY_TEMPLATES.major[majorId] ||
    WHY_TEMPLATES.cluster[clusterName] ||
    WHY_TEMPLATES.generic;

  // Fallbacks for themes/careers
  const themes = override.themes || defaultThemesForCluster(clusterName);
  const careers = override.careers || defaultCareersForCluster(clusterName);

  // Build data object for replacement
  const data = {
    majorId,
    majorName,
    clusterName,
    qualitiesList: qualitiesListReadable,
    quality1: qualitiesTop3[0] || "",
    quality2: qualitiesTop3[1] || "",
    quality3: qualitiesTop3[2] || "",
    themes,
    careers
  };

  return fillTemplate(template, data);
}
