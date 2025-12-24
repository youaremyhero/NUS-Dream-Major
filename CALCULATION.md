# How matching, qualities, and top majors are calculated

This quiz combines your Likert-scale responses (1–5) with programme metadata to surface major recommendations and the qualities that best describe you. The steps below summarise how the logic in `js/scoring.js` works in plain language.

## Inputs that drive the scores

- **Answer scaling:** Each answer is converted from 1–5 into a centred scale of **-1, -0.5, 0, +0.5, +1**. Strong agreement boosts related areas, while disagreement subtracts weight.
- **Per-question signals:** Questions can reference three kinds of targets:
  - **Clusters** (broad fields such as Computing & AI),
  - **Specific majors** (nudges toward a named programme), and
  - **Qualities** (traits like Analytical Thinking). Qualities only receive positive reinforcement; disagreement does not penalise them.
- **Weights:** The code uses tuning constants to balance signals: clusters → majors (`W_CLUSTER = 1.0`), direct major hints (`W_HINT = 1.0`), and direct quality hints (`W_QUAL_HINT = 1.25`).

## Question prompts and what they target

Each prompt can point to clusters (broad fields), specific majors, and/or qualities. The weights in brackets show the relative push strength.

| # | Question prompt (paraphrased) | Cluster weights | Major nudges | Quality nudges |
| --- | --- | --- | --- | --- |
| 1 | Abstract / logical problem-solving | Computing & AI (1.0); Sciences & Quantitative (0.6) | Computer Science (0.6); Artificial Intelligence (0.6) | Analytical Thinking (0.7); Problem Solving (0.6) |
| 2 | Build or improve physical structures/systems | Engineering & Technology (1.0); Design & Architecture (0.5) | Mechanical Engineering (0.6); Civil Engineering (0.5); Industrial Design (0.4) | Problem Solving (0.6); Attention to Detail (0.5); Creativity (0.4) |
| 3 | Markets, investments, business strategy | Business & Management (1.0); Sciences & Quantitative (0.6) | Finance (0.8); Quantitative Finance (0.6); Business Economics (0.6) | Strategic Planning (0.6); Analytical Thinking (0.6) |
| 4 | Understanding people, behaviour, society | Social Sciences (1.0); Health & Life Sciences (0.4); Humanities & Cultural Studies (0.4) | Psychology (0.7); Sociology (0.5); Social Work (0.5) | Empathy (0.7); Communication Skills (0.5) |
| 5 | Writing, storytelling, analysing texts | Humanities & Cultural Studies (1.0); Social Sciences (0.5) | Literature (0.7); Communications & New Media (0.5); Philosophy (0.5) | Communication Skills (0.6); Critical Thinking (0.6); Creativity (0.4) |
| 6 | Coding or learning programming | Computing & AI (1.0); Engineering & Technology (0.4) | Computer Science (0.7); Artificial Intelligence (0.7) | Analytical Thinking (0.6); Problem Solving (0.6) |
| 7 | Healthcare, biomedical sciences, patient well-being | Health & Life Sciences (1.0); Sciences & Quantitative (0.5) | Medicine (0.5); Nursing (0.5); Pharmacy (0.5); Pharmaceutical Science (0.4); Biomedical Engineering (0.4) | Empathy (0.6); Attention to Detail (0.6); Discipline (0.5) |
| 8 | Design, aesthetics, user experience | Design & Architecture (1.0); Humanities & Cultural Studies (0.4) | Industrial Design (0.7); Architecture (0.6) | Creativity (0.7); Attention to Detail (0.4) |
| 9 | Public policy, governance, laws | Law & Legal Studies (1.0); Social Sciences (0.6) | Law (0.8); Political Science (0.6) | Critical Thinking (0.6); Ethical Thinking (0.5); Communication Skills (0.5) |
| 10 | Performance, art, music | Music & Performing Arts (1.0); Humanities & Cultural Studies (0.6); Design & Architecture (0.4) | Music (0.9); Theatre & Performance Studies (0.4) | Creativity (0.6); Communication Skills (0.4) |
| 11 | Sustainability and environmental challenges | Sciences & Quantitative (0.8); Engineering & Technology (0.8); Social Sciences (0.4) | Environmental Engineering (0.6); Environmental Studies (0.6); Geography (0.4); Geospatial Intelligence (0.5) | Ethical Thinking (0.5); Analytical Thinking (0.5); Problem Solving (0.5) |
| 12 | Working with data and statistics | Sciences & Quantitative (1.0); Computing & AI (0.6); Business & Management (0.5) | Data Science & Analytics (0.7); Business Analytics (0.6); Statistics (0.5); Geospatial Intelligence (0.5) | Analytical Thinking (0.7); Attention to Detail (0.5) |
| 13 | Leading teams and influencing outcomes | Business & Management (0.9); Social Sciences (0.6); Law & Legal Studies (0.4) | Leadership & Human Capital Management (0.6); Innovation & Entrepreneurship (0.5) | Leadership Potential (0.7); Strategic Planning (0.5); Communication Skills (0.5) |
| 14 | Compliance, ethics, accuracy-heavy tasks | Health & Life Sciences (0.7); Law & Legal Studies (0.7); Business & Management (0.6) | Accountancy (0.6); Pharmacy (0.5); Law (0.4) | Attention to Detail (0.7); Ethical Thinking (0.6); Discipline (0.5) |
| 15 | Cross-cultural curiosity and collaboration | Humanities & Cultural Studies (0.8); Social Sciences (0.8) | Global Studies (0.6); Southeast Asian Studies (0.5); Anthropology (0.5) | Intercultural Competence (0.8); Communication Skills (0.5) |
| 16 | Digital security and privacy | Computing & AI (0.9); Law & Legal Studies (0.5) | Information Security (0.8) | Attention to Detail (0.6); Ethical Thinking (0.5); Problem Solving (0.5) |
| 17 | Hands-on prototyping, testing, iterating | Engineering & Technology (0.9); Design & Architecture (0.6) | Mechanical Engineering (0.6); Computer Engineering (0.5); Industrial Design (0.5) | Problem Solving (0.6); Creativity (0.5); Attention to Detail (0.4) |
| 18 | Community or society-focused impact | Social Sciences (0.9); Health & Life Sciences (0.6) | Social Work (0.6); Psychology (0.5); Political Science (0.4) | Empathy (0.7); Ethical Thinking (0.5); Collaboration (0.4) |

## How cluster and major scores are built

1. **Cluster totals:** For every question, the signed answer is multiplied by the cluster weight(s) attached to that question. Scores accumulate per cluster.
2. **Direct major nudges:** Some questions also add or subtract from specific majors using the same signed answer and the major hint weight.
3. **Cluster spillover to majors:** After the first pass, each major inherits the score of its parent cluster (scaled by `W_CLUSTER`). This ensures majors benefit when you consistently favour their field, even without direct nudges.
4. **Score shaping for display:** If any majors end up with negative totals, the lowest value is used as a baseline shift so everything displayed is non-negative. Percent values are then calculated against the highest shifted score.
5. **Tie-handling for diversity:** When scores tie, `applyDiversityBias` prefers majors from clusters that are under-represented in the list so your top picks are more varied.
6. **Top picks:** The sorted list produces **topMajors** (top 5) and **topMajors3** (top 3) for the UI.

## How qualities are calculated

1. **Direct quality hints:** Questions can directly boost qualities using only the positive side of the Likert scale; disagreement does not reduce a quality score.
2. **Qualities inferred from majors:** Each major lists its representative qualities. A major’s positive score is split equally across its qualities, then adjusted by an IDF-like factor. The current dampening uses `idf = 1 / (1 + log(df))`, where `df` is the number of majors tagged with that quality—common qualities contribute slightly less, while rarer ones carry a bit more weight. This prevents ubiquitous traits from crowding out distinctive strengths.
3. **Combined profile:** The final quality profile is the sum of direct hints and the contributions inferred from your strongest majors.

## Example: how one user’s answers flow through

1. **Inputs:** Suppose a user answers “5” (strongly agree) to Q1 and Q6, “4” to Q12, and “3” (neutral) elsewhere.
2. **Cluster lift:** Q1 and Q6 push Computing & AI up strongly; Q12 adds Sciences & Quantitative and a smaller boost to Computing & AI and Business & Management.
3. **Majors affected:** Direct nudges lift Computer Science, Artificial Intelligence, Business Analytics, and Data Science & Analytics. Cluster spillover further raises other Computing & AI majors.
4. **Diversity-aware ordering:** After scores are normalised and percented, ties are ordered to spread across clusters before picking the top 5.
5. **Qualities surfaced:** Analytical Thinking and Problem Solving get strong signals from the answers; Attention to Detail grows via data questions; additional boosts come from the high-scoring majors that list these qualities.
6. **Displayed result:** The user would likely see Computing-heavy majors among the top matches (e.g., Computer Science, Artificial Intelligence, Business Analytics), with clear quality highlights explaining why they fit.

## Other details to know

- **Sorting stability:** Within the same score group, majors are ordered by their ID (alphabetical) after diversity balancing to keep results predictable.
- **Percent guardrails:** Percentages are computed against the highest shifted score, with a fallback of 1 to avoid divide-by-zero when all scores are zero.
- **Saved results:** When you finish the quiz, the computed scores, top majors, and qualities are saved to `localStorage` with a timestamp. Reloading the results page restores this data instead of rerunning the quiz.
- **Extensibility:** The weights, clusters, and qualities all live in configuration files, making it straightforward to tune how strongly certain answers influence your matches.
