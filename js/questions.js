// js/questions.js
// Export the full list of quiz questions used by scoring.js
export const QUESTIONS = [
// ---------- Academic Interests & Strengths ----------
{
  id: 1,
  category: "Academic Interests & Strengths",
  text: "Which type of problems do you enjoy solving the most?",
  options: [
    { text: "Designing physical structures or systems", scores: { ENG_CIVIL: 3, DES_ARCH: 2, ENG_MECH: 2 } }, // Civil Engineering, Architecture, Mechanical Engineering
    { text: "Analyzing financial trends or markets", scores: { BIZ_FIN: 3, CHS_QFIN: 2, SOC_BA: 2 } }, // Finance, Quantitative Finance, Business Analytics
    { text: "Understanding human behavior", scores: { CHS_PSY: 3, CHS_SOC: 2, CHS_POLSCI: 1 } }, // Psychology, Sociology, Political Science
    { text: "Developing new technologies", scores: { SOC_CS: 3, SOC_AI: 3, ENG_BIOMED: 2 } }, // Computer Science, Artificial Intelligence, Biomedical Engineering
    { text: "Crafting persuasive arguments or stories", scores: { CHS_CNM: 3, CHS_LIT: 2, LAW_LLB: 2 } } // Communications & New Media, English Literature, Law
  ]
},
{
  id: 2,
  category: "Academic Interests & Strengths",
  text: "What type of research excites you?",
  options: [
    { text: "Scientific experiments or medical studies", scores: { MED_MBBS: 3, CHS_LIFESCI: 3, PHA_PSCI: 2 } }, // Medicine, Life Sciences, Pharmaceutical Science
    { text: "Market analysis and consumer trends", scores: { BIZ_MKT: 3, SOC_BA: 2, BIZ_ABA: 2 } }, // Marketing, Business Analytics, Applied Business Analytics
    { text: "Political or social research", scores: { CHS_POLSCI: 3, CHS_GLOBL: 2, CHS_SOC: 2 } }, // Political Science, Global Studies, Sociology
    { text: "Innovation in sustainable design", scores: { DES_ARCH: 3, ENG_ENV: 2, DES_ID: 2 } }, // Architecture, Environmental Engineering, Industrial Design
    { text: "Data modeling and analytics", scores: { CHS_DSA: 3, SOC_BA: 2, CHS_STAT: 2 } } // Data Science & Analytics, Information Systems, Statistics
  ]
},
{
  id: 3,
  category: "Academic Interests & Strengths",
  text: "Which subject do you naturally gravitate towards?",
  options: [
    { text: "Mathematics and logic", scores: { CHS_MATH: 3, CHS_PHYS: 2, SOC_CS: 2 } }, // Mathematics, Physics, Computer Science
    { text: "Literature and language", scores: { CHS_LIT: 3, CHS_CHS: 2, CHS_LANG: 2 } }, // English Literature, Chinese Studies, English Language
    { text: "Business and economics", scores: { BIZ_BIZEC: 3, CHS_ECON: 3, BIZ_FIN: 2 } }, // Business Economics, Economics, Finance
    { text: "Art and design", scores: { DES_ID: 3, CHS_TPS: 2, DES_LARCH: 2 } }, // Industrial Design, Theatre & Performance Studies, Landscape Architecture
    { text: "Biology and health sciences", scores: { CHS_LIFESCI: 3, MED_MBBS: 3, DEN_BDS: 2 } } // Life Sciences, Medicine, Dentistry
  ]
},
{
  id: 4,
  category: "Academic Interests & Strengths",
  text: "Which environment do you thrive in the most?",
  options: [
    { text: "Corporate office or business setting", scores: { BIZ_ACC: 3, BIZ_BIZEC: 3, BIZ_FIN: 2 } }, // Accountancy, Business Economics, Finance
    { text: "Technology-driven workplaces", scores: { SOC_CS: 3, SOC_AI: 2, SOC_BA: 2 } }, // Computer Science, Artificial Intelligence, Information Systems
    { text: "Healthcare and laboratories", scores: { MED_MBBS: 3, PHA_PHARM: 2, ENG_BIOMED: 2 } }, // Medicine, Pharmacy, Biomedical Engineering
    { text: "Creative studios and design spaces", scores: { DES_ID: 3, DES_ARCH: 2, CHS_TPS: 2 } }, // Industrial Design, Architecture, Theatre & Performance Studies
    { text: "Academic or research institutions", scores: { CHS_PHIL: 3, CHS_POLSCI: 2, CHS_GLOBL: 2 } } // Philosophy, Political Science, Global Studies
  ]
},
{
  id: 5,
  category: "Academic Interests & Strengths",
  text: "How do you prefer to work on problems?",
  options: [
    { text: "By using logic, formulas, and data", scores: { CHS_DSA: 3, CHS_STAT: 2, SOC_CS: 2 } }, // Data Science & Analytics, Statistics, Computer Science
    { text: "By designing innovative solutions", scores: { DES_ID: 3, ENG_MECH: 2, DES_ARCH: 2 } }, // Industrial Design, Mechanical Engineering, Architecture
    { text: "By understanding and interacting with people", scores: { CHS_PSY: 3, CHS_SOCWORK: 2, CHS_CNM: 2 } }, // Psychology, Social Work, Communications & New Media
    { text: "By writing and expressing ideas creatively", scores: { CHS_LIT: 3, CHS_TPS: 2, CHS_PHIL: 2 } }, // English Literature, Theatre & Performance Studies, Philosophy
    { text: "By managing teams and leading projects", scores: { BIZ_LHCM: 3, SOC_BA: 2, BIZ_OSCM: 2 } } // Leadership & Human Capital Management, Business Analytics, Operations & Supply Chain Management
  ]
},

// ---------- Career Aspirations ----------
{
  id: 6,
  category: "Career Aspirations",
  text: "What is your ideal career focus?",
  options: [
    { text: "Developing technology and software", scores: { SOC_CS: 3, SOC_AI: 3, SOC_BA: 2 } }, // Computer Science, Artificial Intelligence, Information Systems
    { text: "Working in finance or business strategy", scores: { BIZ_FIN: 3, BIZ_BIZEC: 3, BIZ_ACC: 2 } }, // Finance, Business Economics, Accountancy
    { text: "Helping people through medicine or social work", scores: { MED_MBBS: 3, CHS_SOCWORK: 3, NUR_NURS: 2 } }, // Medicine, Social Work, Nursing
    { text: "Creating art, music, or literature", scores: { MUS_MUS: 3, CHS_LIT: 3, CHS_TPS: 2 } }, // Music, English Literature, Theatre & Performance Studies
    { text: "Researching political, cultural, or historical issues", scores: { CHS_POLSCI: 3, CHS_HIST: 2, CHS_GLOBL: 2 } } // Political Science, History, Global Studies
  ]
},
{
  id: 7,
  category: "Career Aspirations",
  text: "Which of these statements best describes you?",
  options: [
    { text: "I enjoy working with numbers and analyzing patterns.", scores: { CHS_STAT: 3, CHS_DSA: 2, CHS_QFIN: 2 } }, // Statistics, Data Science & Analytics, Quantitative Finance
    { text: "I like creating and innovating new products.", scores: { DES_ID: 3, ENG_ENGSCI: 2, BIZ_ENT: 2 } }, // Industrial Design, Engineering Science, Innovation & Entrepreneurship
    { text: "I want to improve human health and wellbeing.", scores: { MED_MBBS: 3, PHA_PHARM: 2, NUR_NURS: 2 } }, // Medicine, Pharmacy, Nursing
    { text: "I like debating and discussing ideas.", scores: { LAW_LLB: 3, CHS_PHIL: 2, CHS_POLSCI: 2 } }, // Law, Philosophy, Political Science
    { text: "I enjoy studying different cultures and societies.", scores: { CHS_GLOBL: 3, CHS_SEAS: 2, CHS_ANTH: 2 } } // Global Studies, Southeast Asian Studies, Anthropology
  ]
},
{
  id: 8,
  category: "Career Aspirations",
  text: "What motivates you in your work?",
  options: [
    { text: "Improving the economy and financial systems", scores: { CHS_ECON: 3, BIZ_BIZEC: 2, BIZ_FIN: 2 } }, // Economics, Business Economics, Finance
    { text: "Advancing technology and innovation", scores: { SOC_AI: 3, SOC_CS: 2, ENG_ENGSCI: 2 } }, // Artificial Intelligence, Computer Science, Engineering Science
    { text: "Helping individuals and communities", scores: { CHS_SOCWORK: 3, CHS_PSY: 2, CHS_POLSCI: 2 } }, // Social Work, Psychology, Political Science
    { text: "Revolutionizing arts and media", scores: { CHS_CNM: 3, CHS_TPS: 2, MUS_MUS: 2 } }, // Communications & New Media, Theatre & Performance Studies, Music
    { text: "Conserving the environment", scores: { CHS_ENVSTUD: 3, ENG_ENV: 2, CHS_GEOG: 2 } } // Environmental Studies, Environmental & Sustainability Engineering, Geography
  ]
},
{
  id: 9,
  category: "Career Aspirations",
  text: "What kind of tasks do you enjoy the most?",
  options: [
    { text: "Analyzing data and making decisions", scores: { SOC_BA: 3, CHS_DSA: 2, CHS_STAT: 2 } }, // Business Analytics (SoC), Data Science & Analytics, Statistics
    { text: "Designing and building things", scores: { DES_ARCH: 3, DES_ID: 2, ENG_MECH: 2 } }, // Architecture, Industrial Design, Mechanical Engineering
    { text: "Helping people through counseling or healthcare", scores: { CHS_PSY: 3, CHS_SOCWORK: 2, MED_MBBS: 2 } }, // Psychology, Social Work, Medicine
    { text: "Writing and expressing ideas creatively", scores: { CHS_LIT: 3, CHS_CNM: 2, CHS_TPS: 2 } }, // English Literature, Communications & New Media, Theatre & Performance Studies
    { text: "Studying different cultures and societies", scores: { CHS_ANTH: 3, CHS_GLOBL: 2, CHS_SEAS: 2 } } // Anthropology, Global Studies, Southeast Asian Studies
  ]
},
{
  id: 10,
  category: "Career Aspirations",
  text: "Which industries are you most interested in?",
  options: [
    { text: "Technology and software development", scores: { SOC_CS: 3, SOC_AI: 3, SOC_INFSEC: 2 } }, // Computer Science, Artificial Intelligence, Information Security
    { text: "Finance and investment", scores: { BIZ_FIN: 3, CHS_QFIN: 2, BIZ_BIZEC: 2 } }, // Finance, Quantitative Finance, Business Economics
    { text: "Healthcare and medicine", scores: { MED_MBBS: 3, PHA_PHARM: 2, ENG_BIOMED: 2 } }, // Medicine, Pharmacy, Biomedical Engineering
    { text: "Media, arts, and entertainment", scores: { CHS_CNM: 3, CHS_TPS: 2, MUS_MUS: 2 } }, // Communications & New Media, Theatre & Performance Studies, Music
    { text: "Urban planning and architecture", scores: { DES_ARCH: 3, DES_LARCH: 2, ENG_CIVIL: 2 } } // Architecture, Landscape Architecture, Civil Engineering
  ]
},

// ---------- Learning Style & Preferences ----------
{
  id: 11,
  category: "Learning Style & Preferences",
  text: "Which of these sounds like an exciting project?",
  options: [
    { text: "Developing an AI chatbot", scores: { SOC_AI: 3, SOC_CS: 2, SOC_BA: 2 } }, // Artificial Intelligence, Computer Science, Information Systems
    { text: "Managing a company's marketing strategy", scores: { BIZ_MKT: 3, SOC_BA: 2, BIZ_BIZEC: 2 } }, // Marketing, Business Analytics, Business Economics
    { text: "Researching mental health solutions", scores: { CHS_PSY: 3, CHS_SOCWORK: 2, CHS_LIFESCI: 2 } }, // Psychology, Social Work, Life Sciences
    { text: "Designing a cityscape or infrastructure", scores: { DES_ARCH: 3, ENG_CIVIL: 2, DES_LARCH: 2 } }, // Architecture, Civil Engineering, Landscape Architecture
    { text: "Writing a novel or screenplay", scores: { CHS_LIT: 3, CHS_TPS: 2, CHS_CNM: 2 } } // English Literature, Theatre & Performance Studies, Communications & New Media
  ]
},
{
  id: 12,
  category: "Learning Style & Preferences",
  text: "What motivates you most when choosing a field of study?",
  options: [
    { text: "Solving practical problems and organizing information", scores: { SOC_BA: 3, BIZ_ACC: 2, BIZ_OSCM: 2 } }, // Business Analytics, Accountancy, Operations & Supply Chain Management
    { text: "Creating and innovating new ideas or designs", scores: { DES_ID: 3, BIZ_ENT: 2, CHS_TPS: 2 } }, // Industrial Design, Innovation & Entrepreneurship, Theatre & Performance Studies
    { text: "Understanding and helping people", scores: { CHS_PSY: 3, CHS_SOCWORK: 2, MED_MBBS: 2 } }, // Psychology, Social Work, Medicine
    { text: "Exploring big ideas and critical thinking", scores: { CHS_PHIL: 3, CHS_POLSCI: 2, CHS_HIST: 2 } }, // Philosophy, Political Science, History
    { text: "Designing and building tangible structures or technologies", scores: { ENG_CIVIL: 3, DES_ARCH: 2, ENG_MECH: 2 } } // Civil Engineering, Architecture, Mechanical Engineering
  ]
},
{
  id: 13,
  category: "Learning Style & Preferences",
  text: "What kind of workplace do you see yourself in?",
  options: [
    { text: "A corporate office", scores: { BIZ_FIN: 3, BIZ_ACC: 2, SOC_BA: 2 } }, // Finance, Accountancy, Business Analytics
    { text: "A research lab or tech firm", scores: { SOC_CS: 3, SOC_AI: 2, ENG_ENGSCI: 2 } }, // Computer Science, Artificial Intelligence, Engineering Science
    { text: "A hospital or healthcare setting", scores: { MED_MBBS: 3, NUR_NURS: 2, PHA_PHARM: 2 } }, // Medicine, Nursing, Pharmacy
    { text: "A studio or creative agency", scores: { DES_ID: 3, CHS_CNM: 2, CHS_TPS: 2 } }, // Industrial Design, Communications & New Media, Theatre & Performance Studies
    { text: "A government or NGO setting", scores: { CHS_POLSCI: 3, CHS_SOC: 2, CHS_GLOBL: 2 } } // Political Science, Sociology, Global Studies
  ]
},
{
  id: 14,
  category: "Learning Style & Preferences",
  text: "If you had to give a TED Talk, what would it be about?",
  options: [
    { text: "The future of artificial intelligence", scores: { SOC_AI: 3, SOC_CS: 2, SOC_BA: 2 } }, // Artificial Intelligence, Computer Science, Information Systems
    { text: "How to invest wisely", scores: { BIZ_FIN: 3, BIZ_BIZEC: 2, CHS_QFIN: 2 } }, // Finance, Business Economics, Quantitative Finance
    { text: "Mental health awareness", scores: { CHS_PSY: 3, CHS_SOCWORK: 2, CHS_LIFESCI: 2 } }, // Psychology, Social Work, Life Sciences
    { text: "The impact of literature on society", scores: { CHS_LIT: 3, CHS_TPS: 2, CHS_CNM: 2 } }, // English Literature, Theatre & Performance Studies, Communications & New Media
    { text: "Climate change and sustainability", scores: { CHS_ENVSTUD: 3, CHS_GEOG: 2, ENG_ENV: 2 } } // Environmental Studies, Geography, Environmental & Sustainability Engineering
  ]
},
{
  id: 15,
  category: "Learning Style & Preferences",
  text: "What type of skills do you enjoy using?",
  options: [
    { text: "Analytical thinking and problem-solving", scores: { CHS_DSA: 3, CHS_MATH: 2, SOC_BA: 2 } }, // Data Science & Analytics, Mathematics, Business Analytics
    { text: "Creative thinking and design", scores: { DES_ID: 3, DES_ARCH: 2, CHS_TPS: 2 } }, // Industrial Design, Architecture, Theatre & Performance Studies
    { text: "Empathy and communication", scores: { CHS_PSY: 3, CHS_SOCWORK: 2, NUR_NURS: 2 } }, // Psychology, Social Work, Nursing
    { text: "Strategic thinking and planning", scores: { BIZ_BIZEC: 3, BIZ_MKT: 2, BIZ_LHCM: 2 } }, // Business Economics, Marketing, Leadership & Human Capital Management
    { text: "Hands-on technical skills", scores: { ENG_MECH: 3, ENG_BIOMED: 2, ENG_CIVIL: 2 } } // Mechanical Engineering, Biomedical Engineering, Civil Engineering
  ]
},

// ---------- Personal Values & Goals ----------
{
  id: 16,
  category: "Personal Values & Goals",
  text: "What role do you naturally take in group projects?",
  options: [
    { text: "Data analyst or strategist", scores: { CHS_DSA: 3, SOC_BA: 2, CHS_STAT: 2 } }, // Data Science & Analytics, Business Analytics, Statistics
    { text: "Creative lead or designer", scores: { DES_ID: 3, DES_ARCH: 2, CHS_CNM: 2 } }, // Industrial Design, Architecture, Communications & New Media
    { text: "Mediator or communicator", scores: { CHS_PSY: 3, BIZ_LHCM: 2, CHS_SOCWORK: 2 } }, // Psychology, Leadership & Human Capital Management, Social Work
    { text: "Researcher or writer", scores: { CHS_PHIL: 3, CHS_HIST: 2, CHS_POLSCI: 2 } }, // Philosophy, History, Political Science
    { text: "Logistics and operations manager", scores: { BIZ_OSCM: 3, ENG_IPM: 2, ENG_ISE: 2 } } // Operations & Supply Chain Management, Infrastructure & Project Management, Industrial & Systems Engineering
  ]
},
{
  id: 17,
  category: "Personal Values & Goals",
  text: "How do you prefer to learn?",
  options: [
    { text: "Through numbers, data, and calculations", scores: { CHS_MATH: 3, CHS_STAT: 2, CHS_QFIN: 2 } }, // Mathematics, Statistics, Quantitative Finance
    { text: "By doing hands-on work or creating things", scores: { DES_ID: 3, ENG_MECH: 2, DES_ARCH: 2 } }, // Industrial Design, Mechanical Engineering, Architecture
    { text: "By discussing ideas and engaging in debates", scores: { LAW_LLB: 3, CHS_PHIL: 2, CHS_POLSCI: 2 } }, // Law, Philosophy, Political Science
    { text: "Through observation and research", scores: { CHS_PSY: 3, CHS_SOC: 2, CHS_ANTH: 2 } }, // Psychology, Sociology, Anthropology
    { text: "Through writing and storytelling", scores: { CHS_LIT: 3, CHS_CNM: 2, CHS_TPS: 2 } } // English Literature, Communications & New Media, Theatre & Performance Studies
  ]
},
{
  id: 18,
  category: "Personal Values & Goals",
  text: "What kind of impact do you want to have in the future?",
  options: [
    { text: "Innovating in technology and AI", scores: { SOC_AI: 3, SOC_CS: 2, ENG_ENGSCI: 2 } }, // Artificial Intelligence, Computer Science, Engineering Science
    { text: "Shaping business and economic policies", scores: { BIZ_BIZEC: 3, BIZ_FIN: 2, CHS_ECON: 2 } }, // Business Economics, Finance, Economics
    { text: "Improving healthcare and medicine", scores: { MED_MBBS: 3, NUR_NURS: 2, ENG_BIOMED: 2 } }, // Medicine, Nursing, Biomedical Engineering
    { text: "Advocating for social change", scores: { CHS_POLSCI: 3, CHS_SOC: 2, CHS_SOCWORK: 2 } }, // Political Science, Sociology, Social Work
    { text: "Creating art, literature, or media", scores: { CHS_TPS: 3, MUS_MUS: 2, CHS_LIT: 2 } } // Theatre & Performance Studies, Music, English Literature
  ]
},
{
  id: 19,
  category: "Personal Values & Goals",
  text: "If you had unlimited resources, what would you do?",
  options: [
    { text: "Launch a tech startup", scores: { BIZ_ENT: 3, SOC_CS: 2, SOC_BA: 2 } }, // Innovation & Entrepreneurship, Computer Science, Information Systems
    { text: "Write a book or produce a film", scores: { CHS_LIT: 3, CHS_CNM: 2, CHS_TPS: 2 } }, // English Literature, Communications & New Media, Theatre & Performance Studies
    { text: "Build infrastructure for underprivileged communities", scores: { ENG_CIVIL: 3, ENG_IPM: 2, CHS_SOCWORK: 2 } }, // Civil Engineering, Infrastructure & Project Management, Social Work
    { text: "Revolutionize the financial industry", scores: { BIZ_FIN: 3, CHS_QFIN: 2, SOC_BA: 2 } }, // Finance, Quantitative Finance, Business Analytics
    { text: "Lead environmental sustainability efforts", scores: { CHS_ENVSTUD: 3, CHS_GEOG: 2, ENG_ENV: 2 } } // Environmental Studies, Geography, Environmental Engineering
  ]
},
{
  id: 20,
  category: "Personal Values & Goals",
  text: "What excites you about the future?",
  options: [
    { text: "Artificial intelligence and automation", scores: { SOC_AI: 3, SOC_CS: 2, CHS_DSA: 2 } }, // Artificial Intelligence, Computer Science, Data Science & Analytics
    { text: "Advances in medicine and biotechnology", scores: { MED_MBBS: 3, CHS_LIFESCI: 2, PHA_PSCI: 2 } }, // Medicine, Life Sciences, Pharmaceutical Science
    { text: "New trends in business and global trade", scores: { BIZ_BIZEC: 3, BIZ_MKT: 2, BIZ_FIN: 2 } }, // Business Economics, Marketing, Finance
    { text: "Cultural and artistic movements", scores: { CHS_TPS: 3, CHS_CNM: 2, CHS_LIT: 2 } }, // Theatre & Performance Studies, Communications & New Media, English Literature
    { text: "Sustainable living and climate action", scores: { ENG_ENV: 3, DES_LARCH: 2, CHS_ENVSTUD: 2 } } // Environmental Engineering, Landscape Architecture, Environmental Studies
  ]
},

// ---------- Miscellaneous Interests & Hobbies ----------
{
  id: 21,
  category: "Miscellaneous Interests & Hobbies",
  text: "What kind of problems do you like solving?",
  options: [
    { text: "Technical problems", scores: { SOC_CS: 3, ENG_ENGSCI: 2, ENG_MECH: 2 } }, // Computer Science, Engineering Science, Mechanical Engineering
    { text: "Social issues", scores: { CHS_SOCWORK: 3, CHS_SOC: 2, CHS_PSY: 2 } }, // Social Work, Sociology, Psychology
    { text: "Strategic business challenges", scores: { SOC_BA: 3, BIZ_OSCM: 2, BIZ_BIZEC: 2 } }, // Business Analytics, Operations & Supply Chain Management, Business Economics
    { text: "Creative expression", scores: { CHS_LIT: 3, CHS_CNM: 2, MUS_MUS: 2 } }, // English Literature, Communications & New Media, Music
    { text: "Environmental challenges", scores: { ENG_ENV: 3, CHS_GEOG: 2, CHS_ENVSTUD: 2 } } // Environmental Engineering, Geography, Environmental Studies
  ]
},
{
  id: 22,
  category: "Miscellaneous Interests & Hobbies",
  text: "How do you approach challenges?",
  options: [
    { text: "Logical and systematic thinking", scores: { CHS_MATH: 3, CHS_STAT: 2, CHS_DSA: 2 } }, // Mathematics, Statistics, Data Science & Analytics
    { text: "Empathy and social understanding", scores: { CHS_PSY: 3, CHS_SOCWORK: 2, CHS_POLSCI: 2 } }, // Psychology, Social Work, Political Science
    { text: "Hands-on innovation and design", scores: { DES_ID: 3, DES_ARCH: 2, ENG_CIVIL: 2 } }, // Industrial Design, Architecture, Civil Engineering
    { text: "Analyzing data and trends", scores: { BIZ_FIN: 3, SOC_BA: 2, CHS_ECON: 2 } }, // Finance, Business Analytics, Economics
    { text: "Through artistic or literary expression", scores: { CHS_TPS: 3, CHS_LIT: 2, CHS_CNM: 2 } } // Theatre & Performance Studies, English Literature, Communications & New Media
  ]
},
{
  id: 23,
  category: "Miscellaneous Interests & Hobbies",
  text: "What excites you most about university life?",
  options: [
    { text: "Researching new discoveries", scores: { ENG_ENGSCI: 3, SOC_CS: 2, ENG_BIOMED: 2 } }, // Engineering Science, Computer Science, Biomedical Engineering
    { text: "Debating ideas and challenging perspectives", scores: { CHS_PHIL: 3, CHS_POLSCI: 2, LAW_LLB: 2 } }, // Philosophy, Political Science, Law
    { text: "Creating performances or media projects", scores: { CHS_TPS: 3, CHS_CNM: 2, CHS_LIT: 2 } }, // Theatre & Performance Studies, Communications & New Media, English Literature
    { text: "Leading student initiatives or startups", scores: { BIZ_ENT: 3, BIZ_BIZEC: 2, BIZ_MKT: 2 } }, // Innovation & Entrepreneurship, Business Economics, Marketing
    { text: "Exploring cultural and historical contexts", scores: { CHS_GLOBL: 3, CHS_HIST: 2, CHS_SEAS: 2 } } // Global Studies, History, Southeast Asian Studies
  ]
},
{
  id: 24,
  category: "Miscellaneous Interests & Hobbies",
  text: "How do you prefer to express yourself?",
  options: [
    { text: "Through data and analysis", scores: { SOC_BA: 3, CHS_STAT: 2, CHS_DSA: 2 } }, // Business Analytics, Statistics, Data Science & Analytics
    { text: "Through persuasive writing or speeches", scores: { LAW_LLB: 3, CHS_LIT: 2, CHS_CNM: 2 } }, // Law, English Literature, Communications & New Media
    { text: "Through creative designs and visuals", scores: { DES_ID: 3, DES_ARCH: 2, CHS_TPS: 2 } }, // Industrial Design, Architecture, Theatre & Performance Studies
    { text: "Through scientific research and experiments", scores: { CHS_CHEM: 3, CHS_LIFESCI: 2, PHA_PSCI: 2 } }, // Chemistry, Life Sciences, Pharmaceutical Science
    { text: "Through community service and advocacy", scores: { CHS_SOCWORK: 3, CHS_SOC: 2, CHS_POLSCI: 2 } } // Social Work, Sociology, Political Science
  ]
},
{
  id: 25,
  category: "Miscellaneous Interests & Hobbies",
  text: "What kind of academic environment do you thrive in?",
  options: [
    { text: "Structured and analytical", scores: { BIZ_ACC: 3, BIZ_FIN: 2, CHS_QFIN: 2 } }, // Accountancy, Finance, Quantitative Finance
    { text: "Creative and exploratory", scores: { CHS_CNM: 3, CHS_TPS: 2, CHS_LIT: 2 } }, // Communications & New Media, Theatre & Performance Studies, English Literature
    { text: "Hands-on and practical", scores: { ENG_MECH: 3, ENG_CIVIL: 2, DES_ARCH: 2 } }, // Mechanical Engineering, Civil Engineering, Architecture
    { text: "Research-driven and theoretical", scores: { CHS_DSA: 3, CHS_PHIL: 2, CHS_PHYS: 2 } }, // Data Science & Analytics, Philosophy, Physics
    { text: "Community-oriented and collaborative", scores: { NUR_NURS: 3, CHS_SOCWORK: 2, CHS_GLOBL: 2 } } // Nursing, Social Work, Global Studies
  ]
},
{
  id: 26,
  category: "Miscellaneous Interests & Hobbies",
  text: "Do you prefer teamwork or independent work?",
  options: [
    { text: "Working in large dynamic teams", scores: { SOC_BA: 3, BIZ_LHCM: 2, BIZ_OSCM: 2 } }, // Business Analytics, Leadership & Human Capital Management, Operations & Supply Chain Management
    { text: "Small teams or research groups", scores: { ENG_BIOMED: 3, ENG_CE: 2, ENG_ENV: 2 } }, // Biomedical Engineering, Computer Engineering, Environmental Engineering
    { text: "Independent creative projects", scores: { CHS_LIT: 3, DES_ID: 2, CHS_CNM: 2 } }, // English Literature, Industrial Design, Communications & New Media
    { text: "Independent research and writing", scores: { CHS_PHIL: 3, CHS_HIST: 2, CHS_POLSCI: 2 } } // Philosophy, History, Political Science
  ]
},
{
  id: 27,
  category: "Miscellaneous Interests & Hobbies",
  text: "What kind of contribution would you like to make?",
  options: [
    { text: "Innovating new technologies", scores: { SOC_CS: 3, SOC_AI: 2, CHS_DSA: 2 } }, // Computer Science, Artificial Intelligence, Data Science & Analytics
    { text: "Shaping businesses and organizations", scores: { BIZ_BIZEC: 3, BIZ_MKT: 2, BIZ_FIN: 2 } }, // Business Economics, Marketing, Finance
    { text: "Advancing healthcare and well-being", scores: { MED_MBBS: 3, NUR_NURS: 2, PHA_PSCI: 2 } }, // Medicine, Nursing, Pharmaceutical Science
    { text: "Driving cultural or artistic movements", scores: { CHS_TPS: 3, CHS_CNM: 2, MUS_MUS: 2 } }, // Theatre & Performance Studies, Communications & New Media, Music
    { text: "Leading social and policy change", scores: { CHS_POLSCI: 3, CHS_SOCWORK: 2, CHS_GLOBL: 2 } } // Political Science, Social Work, Global Studies
  ]
},
{
  id: 28,
  category: "Miscellaneous Interests & Hobbies",
  text: "What types of projects excite you the most?",
  options: [
    { text: "Big data analysis and forecasting", scores: { CHS_DSA: 3, SOC_BA: 2, CHS_QFIN: 2 } }, // Data Science & Analytics, Business Analytics, Quantitative Finance
    { text: "Product or system design", scores: { DES_ID: 3, ENG_CE: 2, ENG_MECH: 2 } }, // Industrial Design, Computer Engineering, Mechanical Engineering
    { text: "Campaigns for social causes", scores: { CHS_POLSCI: 3, CHS_SOC: 2, CHS_SOCWORK: 2 } }, // Political Science, Sociology, Social Work
    { text: "Theatrical productions or media creation", scores: { CHS_TPS: 3, CHS_CNM: 2, CHS_LIT: 2 } }, // Theatre & Performance Studies, Communications & New Media, English Literature
    { text: "Scientific research experiments", scores: { CHS_CHEM: 3, CHS_LIFESCI: 2, CHS_PHYS: 2 } } // Chemistry, Life Sciences, Physics
  ]
},
{
  id: 29,
  category: "Miscellaneous Interests & Hobbies",
  text: "What’s your ideal study method?",
  options: [
    { text: "Solving complex problems step-by-step", scores: { CHS_MATH: 3, ENG_ENGSCI: 2, CHS_PHYS: 2 } }, // Mathematics, Engineering Science, Physics
    { text: "Debating ideas and perspectives", scores: { LAW_LLB: 3, CHS_PHIL: 2, CHS_POLSCI: 2 } }, // Law, Philosophy, Political Science
    { text: "Writing and creating narratives", scores: { CHS_LIT: 3, CHS_CNM: 2, CHS_TPS: 2 } }, // English Literature, Communications & New Media, Theatre & Performance Studies
    { text: "Hands-on experiments and design", scores: { ENG_CHEM: 3, ENG_CIVIL: 2, DES_ID: 2 } }, // Chemical Engineering, Civil Engineering, Industrial Design
    { text: "Fieldwork and real-world applications", scores: { CHS_ENVSTUD: 3, CHS_GEOG: 2, CHS_ANTH: 2 } } // Environmental Studies, Geography, Anthropology
  ]
},
{
  id: 30,
  category: "Miscellaneous Interests & Hobbies",
  text: "What is your long-term academic goal?",
  options: [
    { text: "Building expertise in business and finance", scores: { BIZ_FIN: 3, BIZ_ACC: 2, BIZ_BIZEC: 2 } }, // Finance, Accountancy, Business Economics
    { text: "Driving innovations in tech", scores: { SOC_CS: 3, SOC_AI: 2, SOC_BA: 2 } }, // Computer Science, Artificial Intelligence, Information Systems
    { text: "Making an impact in healthcare", scores: { MED_MBBS: 3, NUR_NURS: 2, DEN_BDS: 2 } }, // Medicine, Nursing, Dentistry
    { text: "Advancing arts, culture, or communication", scores: { CHS_CNM: 3, CHS_TPS: 2, MUS_MUS: 2 } }, // Communications & New Media, Theatre & Performance Studies, Music
    { text: "Contributing to social change and policy", scores: { CHS_POLSCI: 3, CHS_SOC: 2, CHS_GLOBL: 2 } } // Political Science, Sociology, Global Studies
  ]
},
