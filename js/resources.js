// -------------------------------
// resources.js
// -------------------------------

// 🌍 General NUS Admissions Resources
export const generalResources = [
  { label: "Undergraduate Admissions — Apply", url: "https://nus.edu.sg/oam" },
  { label: "Admissions Guide", url: "https://nus.edu.sg/oam/undergraduate-programmes" },
  { label: "Scholarships and Financial Aid", url: "https://nus.edu.sg/oam/financial-matters/scholarships" },
  { label: "Open House and Events", url: "https://nus.edu.sg/oam/events" },
  { label: "Residential Colleges and Student Life", url: "https://nus.edu.sg/studentlife" }
];

// 🏫 Faculty / School Resources
export const facultyResources = {
  "NUS Business School": [
    { label: "Faculty Homepage", url: "https://bschool.nus.edu.sg/" }
  ],
  "School of Computing": [
    { label: "Faculty Homepage", url: "https://www.comp.nus.edu.sg/" }
  ],
  "College of Design and Engineering": [
    { label: "Faculty Homepage", url: "https://cde.nus.edu.sg/" }
  ],
  "College of Humanities and Sciences": [
    { label: "Faculty Homepage", url: "https://chs.nus.edu.sg/" }
  ],
  "Yong Loo Lin School of Medicine": [
    { label: "Faculty Homepage", url: "https://medicine.nus.edu.sg/" }
  ],
  "Faculty of Dentistry": [
    { label: "Faculty Homepage", url: "https://dentistry.nus.edu.sg/" }
  ],
  "Alice Lee Centre for Nursing Studies": [
    { label: "Faculty Homepage", url: "https://medicine.nus.edu.sg/nursing/" }
  ],
  "Faculty of Pharmacy": [
    { label: "Faculty Homepage", url: "https://pharmacy.nus.edu.sg/" }
  ],
  "Faculty of Law": [
    { label: "Faculty Homepage", url: "https://law.nus.edu.sg/" }
  ],
  "Yong Siew Toh Conservatory of Music": [
    { label: "Faculty Homepage", url: "https://music.nus.edu.sg/" }
  ]
};

// 🎓 Major-specific programme pages (from CSV links)
export const majorResources = {
  // Business
  BIZ_ACC: [{ label: "Programme Page", url: "https://bba.nus.edu.sg/academic-programmes/bba-accountancy-programme/introduction/" }],
  BIZ_ABA: [{ label: "Programme Page", url: "https://bba.nus.edu.sg/academic-programmes/specialisations/applied-business-analytics/" }],
  BIZ_BIZEC: [{ label: "Programme Page", url: "https://bba.nus.edu.sg/academic-programmes/specialisations/business-economics/" }],
  BIZ_FIN: [{ label: "Programme Page", url: "https://bba.nus.edu.sg/academic-programmes/specialisations/finance/" }],
  BIZ_ENT: [{ label: "Programme Page", url: "https://bba.nus.edu.sg/academic-programmes/specialisations/entrepreneurship/" }],
  BIZ_LHCM: [{ label: "Programme Page", url: "https://bba.nus.edu.sg/academic-programmes/specialisations/leadership-human-capital-management/" }],
  BIZ_MKT: [{ label: "Programme Page", url: "https://bba.nus.edu.sg/academic-programmes/specialisations/marketing/" }],
  BIZ_OSCM: [{ label: "Programme Page", url: "https://bba.nus.edu.sg/academic-programmes/specialisations/operations-supply-chain-management/" }],
  BIZ_RE: [{ label: "Programme Page", url: "https://bba.nus.edu.sg/academic-programmes/specialisations/real-estate/" }],

  // Computing
  SOC_BA: [{ label: "Programme Page", url: "https://www.comp.nus.edu.sg/programmes/ug/ba/" }],
  SOC_CS: [{ label: "Programme Page", url: "https://www.comp.nus.edu.sg/programmes/ug/cs/" }],
  SOC_AI: [{ label: "Programme Page", url: "https://www.comp.nus.edu.sg/programmes/ug/ai/" }],
  SOC_INFSEC: [{ label: "Programme Page", url: "https://www.comp.nus.edu.sg/programmes/ug/is/" }],
  SOC_BAIS: [{ label: "Programme Page", url: "https://www.comp.nus.edu.sg/programmes/ug/bais/" }],

  // Engineering (CDE)
  ENG_BIOMED: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/bme/undergraduate-programmes/bachelor-of-engineering-biomedical-engineering/" }],
  ENG_CHEM: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/chbe/undergraduate/" }],
  ENG_CIVIL: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/cee/undergraduate/" }],
  ENG_CE: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/ece/undergraduate/computer-engineering/" }],
  ENG_EE: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/ece/undergraduate/electrical-engineering/" }],
  ENG_ENGSCI: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/engineering-science/undergraduate/" }],
  ENG_ENV: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/ese/undergraduate/" }],
  ENG_ISE: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/isem/undergraduate/" }],
  ENG_IPM: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/ipe/undergraduate/" }],
  ENG_MSE: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/mse/undergraduate/" }],
  ENG_MECH: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/me/undergraduate/" }],
  ENG_RMI: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/robo/undergraduate/" }],

  // Design
  DES_ARCH: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/arch/programmes/undergraduate/architecture/" }],
  DES_ID: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/did/undergraduate/" }],
  DES_LARCH: [{ label: "Programme Page", url: "https://cde.nus.edu.sg/landscape/undergraduate/" }],

  // CHS examples (fill in remaining using your CSV)
  CHS_ECON: [{ label: "Programme Page", url: "https://fass.nus.edu.sg/ecs/undergraduate/" }],
  CHS_PSY: [{ label: "Programme Page", url: "https://fass.nus.edu.sg/psy/undergraduate/" }],
  CHS_DSA: [{ label: "Programme Page", url: "https://www.stat.nus.edu.sg/undergraduate-programmes/bachelor-of-science-data-science-and-analytics/" }],
  CHS_FST: [{ label: "Programme Page", url: "https://www.fst.nus.edu.sg/undergraduate/" }],
  CHS_DSE: [{ label: "Programme Page", url: "https://chs.nus.edu.sg/programmes/data-science-and-economics/" }],
  CHS_ENVSTUD: [{ label: "Programme Page", url: "https://envstudies.nus.edu.sg/undergraduate/" }],
  CHS_PPE: [{ label: "Programme Page", url: "https://chs.nus.edu.sg/programmes/philosophy-politics-economics/" }],

  // Medicine / Dentistry / Nursing / Pharmacy / Law / Music
  MED_MBBS: [{ label: "Programme Page", url: "https://medicine.nus.edu.sg/admissions/undergraduate/" }],
  DEN_BDS: [{ label: "Programme Page", url: "https://dentistry.nus.edu.sg/education/undergraduate/" }],
  NUR_NURS: [{ label: "Programme Page", url: "https://medicine.nus.edu.sg/nursing/undergraduate-programmes/" }],
  PHA_PSCI: [{ label: "Programme Page", url: "https://pharmacy.nus.edu.sg/programmes/ug/psc/" }],
  PHA_PHARM: [{ label: "Programme Page", url: "https://pharmacy.nus.edu.sg/programmes/ug/pharmacy/" }],
  LAW_LLB: [{ label: "Programme Page", url: "https://law.nus.edu.sg/admissions/undergraduate/" }],
  MUS_MUS: [{ label: "Programme Page", url: "https://music.nus.edu.sg/programmes/bmus/" }]
};

// 🔗 Special Programme Recommendations (Double, Concurrent, Joint)
export const specialProgrammeRules = [
  // -------------------------
  // 🟢 Double Degree Programmes (DDPs)
  // -------------------------
  {
    ifTop1: ["BIZ_*"],
    ifTop2: ["SOC_BA"],
    recommend: [
      {
        title: "BBA/BBA(Acc) & BSc (Business Analytics)",
        note: "Offered by NUS Business School & School of Computing.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["BIZ_*"],
    ifTop2: ["CHS_CNM"],
    recommend: [
      {
        title: "BBA/BBA(Acc) & BSocSci in Communications and New Media",
        note: "Offered by NUS Business School & College of Humanities and Sciences.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["BIZ_*"],
    ifTop2: ["SOC_CS", "SOC_INFSEC", "SOC_BAIS"],
    recommend: [
      {
        title: "BBA/BBA(Acc) & BComp (Computer Science / Information Systems)",
        note: "Offered by NUS Business School & School of Computing.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["BIZ_*"],
    ifTop2: ["ENG_*"],
    recommend: [
      {
        title: "BBA/BBA(Acc) & BEng",
        note: "Offered by NUS Business School & College of Design and Engineering.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["BIZ_*"],
    ifTop2: ["LAW_LLB"],
    recommend: [
      {
        title: "BBA/BBA(Acc) & LLB",
        note: "Offered by NUS Business School & Faculty of Law.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["SOC_CS"],
    ifTop2: ["CHS_MATH"],
    recommend: [
      {
        title: "BComp (Computer Science) & BSc (Mathematics)",
        note: "Offered by School of Computing & College of Humanities and Sciences.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["CHS_ECON"],
    ifTop2: ["BIZ_*"],
    recommend: [
      {
        title: "BSocSci (Economics) & BBA/BBA(Acc)",
        note: "Offered by College of Humanities and Sciences & NUS Business School.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["CHS_ECON"],
    ifTop2: ["SOC_BA"],
    recommend: [
      {
        title: "BSocSci (Economics) & BSc (Business Analytics)",
        note: "Offered by College of Humanities and Sciences & School of Computing.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["CHS_ECON"],
    ifTop2: ["LAW_LLB"],
    recommend: [
      {
        title: "BSocSci (Economics) & Bachelor of Laws",
        note: "Offered by College of Humanities and Sciences & Faculty of Law.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["ENG_*"],
    ifTop2: ["CHS_ECON"],
    recommend: [
      {
        title: "BEng & BSocSci (Economics)",
        note: "Offered by College of Design and Engineering & College of Humanities and Sciences.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-degree-programmes"
      }
    ],
    cap: 1
  },

  // -------------------------
  // 🟡 Concurrent Degree Programmes (CDPs)
  // -------------------------
  {
    ifTop1: ["BIZ_*"],
    recommend: [
      {
        title: "BBA/BBA(Acc) (Hons) & Master in Public Policy or MSc (Management)",
        note: "Offered by NUS Business School.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/concurrent-degree-programmes-(cdp)"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["SOC_BA", "SOC_CS"],
    recommend: [
      {
        title: "BComp (Hons) & MSc (Management)",
        note: "Offered by School of Computing & NUS Business School.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/concurrent-degree-programmes-(cdp)"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["ENG_*"],
    recommend: [
      {
        title: "BEng (any discipline except Engineering Science) & MSc (Management)",
        note: "Offered by College of Design and Engineering & NUS Business School.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/concurrent-degree-programmes-(cdp)"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["LAW_LLB"],
    recommend: [
      {
        title: "LLB & Master in Public Policy",
        note: "Offered by Faculty of Law & Lee Kuan Yew School of Public Policy.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/concurrent-degree-programmes-(cdp)"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["DES_ARCH"],
    recommend: [
      {
        title: "BA (Architecture) & Master of Architecture / Master of Urban Planning",
        note: "Offered by College of Design and Engineering.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/concurrent-degree-programmes-(cdp)"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["PHA_PHARM"],
    recommend: [
      {
        title: "BSc (Real Estate) & Master of Urban Planning or MSc (Smart Industries and Digital Transformation)",
        note: "Offered by Faculty of Pharmacy & College of Design and Engineering.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/concurrent-degree-programmes-(cdp)"
      }
    ],
    cap: 1
  },

  // -------------------------
  // 🔵 Joint / Double / Concurrent Degree Programmes with Overseas Universities
  // -------------------------
  {
    ifTop1: ["ENG_*", "SOC_*", "CHS_*"],
    recommend: [
      {
        title: "DDP with French Grandes Écoles",
        note: "Bachelor/Master of Engineering, Science, or Computing (NUS) + Diplôme d’Ingénieur (France).",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-concurrent-joint-degree-programmes-with-overseas-universities"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["CHS_*"],
    recommend: [
      {
        title: "DDP with Sciences Po or Waseda University",
        note: "Bachelor (Hons) from NUS + BA from partner university (for NUS College students).",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-concurrent-joint-degree-programmes-with-overseas-universities"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["SOC_INFSEC"],
    recommend: [
      {
        title: "CDP with Carnegie Mellon University",
        note: "BComp (Information Systems) (NUS) + MSc (Engineering & Technology Innovation Management) (CMU).",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-concurrent-joint-degree-programmes-with-overseas-universities"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["CHS_LIFESCI"],
    recommend: [
      {
        title: "CDP with University of Melbourne",
        note: "BSc (Life Sciences) (NUS) + Doctor of Veterinary Medicine (University of Melbourne).",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-concurrent-joint-degree-programmes-with-overseas-universities"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["CHS_ECON"],
    recommend: [
      {
        title: "JDP with Australian National University or University of North Carolina-Chapel Hill",
        note: "Joint BSocSci (Actuarial Studies & Economics) or Joint BA (Hons).",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-concurrent-joint-degree-programmes-with-overseas-universities"
      }
    ],
    cap: 1
  },
  {
    ifTop1: ["CHS_LIFESCI"],
    recommend: [
      {
        title: "JDP with University of Dundee",
        note: "Joint BSc (Hons) in Life Sciences.",
        url: "https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes/double-concurrent-joint-degree-programmes-with-overseas-universities"
      }
    ],
    cap: 1
  }
];
