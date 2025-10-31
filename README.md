# NUS Dream Major Quiz

An interactive quiz that helps prospective students discover National University of Singapore majors that fit their strengths and motivations.

## Run locally

1. Install any static web server (examples below) if you do not already have one available.
2. From the repository root, serve the files. Either command works:
   - `python -m http.server 3000`
   - `npx serve .`
3. Visit `http://localhost:3000/index.html` for the quiz and `http://localhost:3000/results.html` for the results page.

The site uses only static assets, so no build step is required.

## Animations & template styles

All GSAP-powered enhancements and layout styles for the landing template are scoped with the `ndm` prefix:

- `css/animations.css` &mdash; presentation rules for the hero, explore grid, and other template sections.
- `js/animations.js` &mdash; registers scroll-triggered animations when GSAP is available.
- External dependencies are loaded via CDN with pinned versions:
  - `gsap@3.12.5`
  - `ScrollTrigger@3.12.5`

If GSAP is unavailable (offline, blocked network, etc.) the page continues to work without animation.

## Disabling motion

- System-wide `prefers-reduced-motion: reduce` is respected automatically. When that preference is enabled no GSAP animations will run.
- To disable animations manually for debugging, remove or comment out the `<script defer src="js/animations.js"></script>` tag in `index.html` or temporarily block the GSAP CDN requests in your developer tools.

## Results & PDF export

Complete the quiz to be redirected to `/results`. The page automatically hydrates the stored answers, triggers the celebration confetti once, and supports exporting a PDF using the “Download PDF” button.

## Project structure

```
css/
  animations.css   Template + animation styles (scoped to `.ndm`)
  questions.css    Quiz-specific presentation
  results.css      Layout for the results page
  styles.css       Global tokens, layout, and shared components
js/
  animations.js    GSAP integrations (progressive enhancement)
  main.js          Quiz flow & landing content wiring
  results.js       Results rendering & PDF helpers
  ...              Supporting content/data modules
index.html         Landing page with quiz
results.html       Results view (accessed via /results)
```
