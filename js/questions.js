// js/questions.js
// TODO: Replace with full 30-question dataset mapped to Programme IDs as agreed.

export const questions = [
  {
    id: 1,
    text: "Which type of problems do you enjoy solving the most?",
    options: [
      { text: "Designing physical structures or systems", scores: { ENG_CIVIL: 3, DES_ARCH: 2, ENG_MECH: 2 } },
      { text: "Analyzing financial trends or markets", scores: { BIZ_FIN: 3, CHS_QFIN: 2, SOC_BA: 2 } },
      { text: "Understanding human behavior", scores: { CHS_PSY: 3, CHS_SOC: 2, CHS_POLSCI: 1 } },
      { text: "Developing new technologies", scores: { SOC_CS: 3, SOC_AI: 3, ENG_BIOMED: 2 } },
      { text: "Crafting persuasive arguments or stories", scores: { CHS_CNM: 3, CHS_LIT: 2, LAW_LLB: 2 } }
    ]
  },
  {
    id: 2,
    text: "What type of research excites you?",
    options: [
      { text: "Scientific experiments or medical studies", scores: { MED_MBBS: 3, CHS_LIFESCI: 3, PHA_PSCI: 2 } },
      { text: "Market analysis and consumer trends", scores: { BIZ_MKT: 3, SOC_BA: 2, BIZ_ABA: 2 } },
      { text: "Political or social research", scores: { CHS_POLSCI: 3, CHS_GS: 2, CHS_SOC: 2 } },
      { text: "Innovation in sustainable design", scores: { DES_ARCH: 3, ENG_ENV: 2, DES_ID: 2 } },
      { text: "Data modeling and analytics", scores: { CHS_DSA: 3, SOC_IS: 2, CHS_STATS: 2 } }
    ]
  }
];

export const TOTAL_QUESTIONS = questions.length;
