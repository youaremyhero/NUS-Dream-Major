# NUS Dream Major

An interactive quiz that helps prospective students discover NUS programmes aligned with their interests, motivations, and strengths. The landing page walks users through a Likert-style questionnaire, surfaces tailored recommendations, and highlights reasons to join NUS. A dedicated results page lets users review their matches, explore next steps, and export a PDF summary.

## Features
- Guided quiz with progress indicator, back/continue controls, and inline validation to prevent accidental skips.
- Results view that persists locally so refreshing or jumping to `results.html` after completing the quiz keeps your matches intact.
- Spotlight cards for emerging programmes plus a grid of additional options powered by structured content data.
- “Why join NUS” metrics and “Next steps” resources rendered from reusable content lists.
- Theme toggle (light/dark) that respects system preference and user choice.
- Optional PDF export of results from the results page.


## Project structure
- `index.html` – Landing page with the quiz flow and supporting sections.
- `results.html` – Standalone results view with PDF export.
- `css/` – Shared layout styles plus quiz/results-specific styling.
- `js/main.js` – Entry point that wires quiz navigation, rendering, theme toggling, and content mounting.
- `js/scoring.js` – Calculates scores, persists results, and restores cached outcomes.
- `js/results.js` – Renders the results view and prepares content for PDF export.
- `js/navigation.js` – Accessible header navigation and scroll behavior.
- `js/content/` – Static content for “Why NUS,” programme highlights, and next steps.
- `js/config/` – Question definitions (Likert scales and prompts).
- `js/majors.js` – Programme metadata used when mapping quiz outcomes to recommendations.

## Customising the experience
- **Quiz questions:** Update Likert prompts and scales in `js/config/questionsLikert.js`.
- **Programme data:** Adjust major metadata and clusters in `js/majors.js` to refine recommendation mappings.
- **Content sections:** Edit cards and copy in `js/content/whyNUS.js`, `js/content/exploreProgrammes.js`, and `js/content/nextSteps.js`.
- **Styling:** Tweak layout or theme styling in `css/styles.css`, with quiz-specific adjustments in `css/questions.css` and results styling in `css/results.css`.

## Notes
- The app stores quiz answers and results in `localStorage` to enable refreshing without data loss.
- The PDF export on `results.html` is optional; the site functions without it if the user never visits the results page.
