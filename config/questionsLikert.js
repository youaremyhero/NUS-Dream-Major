// js/config/questionsLikert.js
// Likert-based question set for NUS Major Quiz (18 items)
// Scale: 1 (Strongly disagree) … 5 (Strongly agree)

export const LIKERT = {
  min: 1,
  max: 5,
  labels: {
    1: "Strongly disagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree",
    5: "Strongly agree"
  }
};

/**
 * Cluster IDs used here (must align with your majors.js cluster strings logically):
 * - BIZ_MGMT              → Business & Management
 * - COMP_AI               → Computing & AI
 * - ENG_TECH              → Engineering & Technology
 * - DESIGN_ARCH           → Design & Architecture
 * - SOC_SCI               → Social Sciences
 * - HUMANITIES_CULT       → Humanities & Cultural Studies
 * - SCI_QUANT             → Sciences & Quantitative
 * - HEALTH_LIFE           → Health & Life Sciences
 * - LAW_LEGAL             → Law & Legal Studies
 * - MUSIC_PERF            → Music & Performing Arts
 *
 * Each question:
 * - clusters: [{ id, w }]       // cluster weights (normalized in scoring)
 * - majorsHints?: [{ id, w }]   // optional nudge towards specific majors
 * - qualitiesHints?: [{ quality, w }]  // optional quality contributions
 */

export const QUESTIONS_LIKERT = [
  {
    id: 1,
    text: "I enjoy solving abstract, logical problems and figuring out how systems work.",
    clusters: [
      { id: "COMP_AI", w: 1.0 },
      { id: "SCI_QUANT", w: 0.6 }
    ],
    majorsHints: [
      { id: "SOC_CS", w: 0.6 },
      { id: "SOC_AI", w: 0.6 }
    ],
    qualitiesHints: [
      { quality: "Analytical Thinking", w: 0.7 },
      { quality: "Problem Solving", w: 0.6 }
    ]
  },
  {
    id: 2,
    text: "I like building or improving physical structures, devices, or mechanical systems.",
    clusters: [
      { id: "ENG_TECH", w: 1.0 },
      { id: "DESIGN_ARCH", w: 0.5 }
    ],
    majorsHints: [
      { id: "ENG_MECH", w: 0.6 },
      { id: "ENG_CIVIL", w: 0.5 },
      { id: "DES_ID", w: 0.4 }
    ],
    qualitiesHints: [
      { quality: "Problem Solving", w: 0.6 },
      { quality: "Attention to Detail", w: 0.5 },
      { quality: "Creativity", w: 0.4 }
    ]
  },
  {
    id: 3,
    text: "I’m interested in markets, investments, or how businesses make strategic decisions.",
    clusters: [
      { id: "BIZ_MGMT", w: 1.0 },
      { id: "SCI_QUANT", w: 0.6 }
    ],
    majorsHints: [
      { id: "BIZ_FIN", w: 0.8 },
      { id: "CHS_QFIN", w: 0.6 },
      { id: "BIZ_BIZEC", w: 0.6 }
    ],
    qualitiesHints: [
      { quality: "Strategic Planning", w: 0.6 },
      { quality: "Analytical Thinking", w: 0.6 }
    ]
  },
  {
    id: 4,
    text: "I’m drawn to understanding people and their behaviour, and how society functions.",
    clusters: [
      { id: "SOC_SCI", w: 1.0 },
      { id: "HEALTH_LIFE", w: 0.4 },
      { id: "HUMANITIES_CULT", w: 0.4 }
    ],
    majorsHints: [
      { id: "CHS_PSY", w: 0.7 },
      { id: "CHS_SOC", w: 0.5 },
      { id: "CHS_SOCWORK", w: 0.5 }
    ],
    qualitiesHints: [
      { quality: "Empathy", w: 0.7 },
      { quality: "Communication Skills", w: 0.5 }
    ]
  },
  {
    id: 5,
    text: "I enjoy expressing ideas through writing, storytelling, or critical analysis of texts.",
    clusters: [
      { id: "HUMANITIES_CULT", w: 1.0 },
      { id: "SOC_SCI", w: 0.5 }
    ],
    majorsHints: [
      { id: "CHS_LIT", w: 0.7 },
      { id: "CHS_CNM", w: 0.5 },
      { id: "CHS_PHIL", w: 0.5 }
    ],
    qualitiesHints: [
      { quality: "Communication Skills", w: 0.6 },
      { quality: "Critical Thinking", w: 0.6 },
      { quality: "Creativity", w: 0.4 }
    ]
  },
  {
    id: 6,
    text: "I’m comfortable with coding or I’m keen to learn programming and software design.",
    clusters: [
      { id: "COMP_AI", w: 1.0 },
      { id: "ENG_TECH", w: 0.4 }
    ],
    majorsHints: [
      { id: "SOC_CS", w: 0.7 },
      { id: "SOC_AI", w: 0.7 }
    ],
    qualitiesHints: [
      { quality: "Analytical Thinking", w: 0.6 },
      { quality: "Problem Solving", w: 0.6 }
    ]
  },
  {
    id: 7,
    text: "I’m drawn to healthcare, biomedical sciences, or improving patients’ well-being.",
    clusters: [
      { id: "HEALTH_LIFE", w: 1.0 },
      { id: "SCI_QUANT", w: 0.5 }
    ],
    majorsHints: [
      { id: "MED_MBBS", w: 0.5 },
      { id: "NUR_NURS", w: 0.5 },
      { id: "PHA_PHARM", w: 0.5 },
      { id: "PHA_PSCI", w: 0.4 },
      { id: "ENG_BIOMED", w: 0.4 }
    ],
    qualitiesHints: [
      { quality: "Empathy", w: 0.6 },
      { quality: "Attention to Detail", w: 0.6 },
      { quality: "Discipline", w: 0.5 }
    ]
  },
  {
    id: 8,
    text: "I enjoy design and aesthetics, and thinking about user experience and form.",
    clusters: [
      { id: "DESIGN_ARCH", w: 1.0 },
      { id: "HUMANITIES_CULT", w: 0.4 }
    ],
    majorsHints: [
      { id: "DES_ID", w: 0.7 },
      { id: "DES_ARCH", w: 0.6 }
    ],
    qualitiesHints: [
      { quality: "Creativity", w: 0.7 },
      { quality: "Attention to Detail", w: 0.4 }
    ]
  },
  {
    id: 9,
    text: "I’m passionate about public policy, governance, and how laws shape society.",
    clusters: [
      { id: "LAW_LEGAL", w: 1.0 },
      { id: "SOC_SCI", w: 0.6 }
    ],
    majorsHints: [
      { id: "LAW_LLB", w: 0.8 },
      { id: "CHS_POLSCI", w: 0.6 }
    ],
    qualitiesHints: [
      { quality: "Critical Thinking", w: 0.6 },
      { quality: "Ethical Thinking", w: 0.5 },
      { quality: "Communication Skills", w: 0.5 }
    ]
  },
  {
    id: 10,
    text: "I enjoy expressing ideas through performance, art, or music.",
    clusters: [
      { id: "MUSIC_PERF", w: 1.0 },
      { id: "HUMANITIES_CULT", w: 0.6 },   // switched to be > Design
      { id: "DESIGN_ARCH", w: 0.4 }        // lower than Humanities per your request
    ],
    majorsHints: [
      { id: "MUS_MUS", w: 0.9 },
      { id: "CHS_TPS", w: 0.4 }
    ],
    qualitiesHints: [
      { quality: "Creativity", w: 0.6 },
      { quality: "Communication Skills", w: 0.4 }
    ]
  },
  {
    id: 11,
    text: "I care about sustainability and want to solve environmental challenges.",
    clusters: [
      { id: "SCI_QUANT", w: 0.8 },
      { id: "ENG_TECH", w: 0.8 },
      { id: "SOC_SCI", w: 0.4 }
    ],
    majorsHints: [
      { id: "ENG_ENV", w: 0.6 },
      { id: "CHS_ENVSTUD", w: 0.6 },
      { id: "CHS_GEOG", w: 0.4 }
    ],
    qualitiesHints: [
      { quality: "Ethical Thinking", w: 0.5 },
      { quality: "Analytical Thinking", w: 0.5 },
      { quality: "Problem Solving", w: 0.5 }
    ]
  },
  {
    id: 12,
    text: "I enjoy working with data, statistics, and turning numbers into insights.",
    clusters: [
      { id: "SCI_QUANT", w: 1.0 },
      { id: "COMP_AI", w: 0.6 },
      { id: "BIZ_MGMT", w: 0.5 }
    ],
    majorsHints: [
      { id: "CHS_DSA", w: 0.7 },
      { id: "SOC_BA", w: 0.6 },
      { id: "CHS_STAT", w: 0.5 }
    ],
    qualitiesHints: [
      { quality: "Analytical Thinking", w: 0.7 },
      { quality: "Attention to Detail", w: 0.5 }
    ]
  },
  {
    id: 13,
    text: "I like leading teams, organising efforts, and influencing outcomes.",
    clusters: [
      { id: "BIZ_MGMT", w: 0.9 },
      { id: "SOC_SCI", w: 0.6 },
      { id: "LAW_LEGAL", w: 0.4 }
    ],
    majorsHints: [
      { id: "BIZ_LHCM", w: 0.6 },
      { id: "BIZ_ENT", w: 0.5 }
    ],
    qualitiesHints: [
      { quality: "Leadership Potential", w: 0.7 },
      { quality: "Strategic Planning", w: 0.5 },
      { quality: "Communication Skills", w: 0.5 }
    ]
  },
  {
    id: 14,
    text: "I’m detail-oriented and comfortable with compliance, ethics, or accuracy-heavy tasks.",
    clusters: [
      { id: "HEALTH_LIFE", w: 0.7 },
      { id: "LAW_LEGAL", w: 0.7 },
      { id: "BIZ_MGMT", w: 0.6 }
    ],
    majorsHints: [
      { id: "BIZ_ACC", w: 0.6 },
      { id: "PHA_PHARM", w: 0.5 },
      { id: "LAW_LLB", w: 0.4 }
    ],
    qualitiesHints: [
      { quality: "Attention to Detail", w: 0.7 },
      { quality: "Ethical Thinking", w: 0.6 },
      { quality: "Discipline", w: 0.5 }
    ]
  },
  {
    id: 15,
    text: "I’m curious about different cultures and enjoy cross-cultural collaboration.",
    clusters: [
      { id: "HUMANITIES_CULT", w: 0.8 },
      { id: "SOC_SCI", w: 0.8 }
    ],
    majorsHints: [
      { id: "CHS_GLOBL", w: 0.6 },
      { id: "CHS_SEAS", w: 0.5 },
      { id: "CHS_ANTH", w: 0.5 }
    ],
    qualitiesHints: [
      { quality: "Intercultural Competence", w: 0.8 },
      { quality: "Communication Skills", w: 0.5 }
    ]
  },
  {
    id: 16,
    text: "I’m interested in digital security, privacy, and protecting information systems.",
    clusters: [
      { id: "COMP_AI", w: 0.9 },
      { id: "LAW_LEGAL", w: 0.5 }
    ],
    majorsHints: [
      { id: "SOC_INFSEC", w: 0.8 }
    ],
    qualitiesHints: [
      { quality: "Attention to Detail", w: 0.6 },
      { quality: "Ethical Thinking", w: 0.5 },
      { quality: "Problem Solving", w: 0.5 }
    ]
  },
  {
    id: 17,
    text: "I prefer hands-on prototyping, testing, or iterating toward practical solutions.",
    clusters: [
      { id: "ENG_TECH", w: 0.9 },
      { id: "DESIGN_ARCH", w: 0.6 }
    ],
    majorsHints: [
      { id: "ENG_MECH", w: 0.6 },
      { id: "ENG_CE", w: 0.5 },
      { id: "DES_ID", w: 0.5 }
    ],
    qualitiesHints: [
      { quality: "Problem Solving", w: 0.6 },
      { quality: "Creativity", w: 0.5 },
      { quality: "Attention to Detail", w: 0.4 }
    ]
  },
  {
    id: 18,
    text: "I want to make real-world impact through community or society-focused work.",
    clusters: [
      { id: "SOC_SCI", w: 0.9 },
      { id: "HEALTH_LIFE", w: 0.6 }
    ],
    majorsHints: [
      { id: "CHS_SOCWORK", w: 0.6 },
      { id: "CHS_PSY", w: 0.5 },
      { id: "CHS_POLSCI", w: 0.4 }
    ],
    qualitiesHints: [
      { quality: "Empathy", w: 0.7 },
      { quality: "Ethical Thinking", w: 0.5 },
      { quality: "Collaboration", w: 0.4 }
    ]
  }
];
