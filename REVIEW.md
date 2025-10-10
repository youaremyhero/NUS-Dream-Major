# Code Review Notes

## 1. Hard-coded `/results` URL rewrite on the results page
- `renderResultsPage` forces the browser URL to `/results` regardless of where the site is hosted (lines 75-80).
- When the project is served from a subdirectory (e.g., GitHub Pages project sites), replacing the URL with `/results` breaks refreshes and deep links because there is no server route at that root-level path. Users will hit a 404 before the SPA has a chance to load.
- Consider removing the rewrite entirely or making it respect the current directory (e.g., keeping `results.html` or using `location.pathname` as-is).

## 2. Non-functional "View tab" buttons in the cluster panel
- The cluster view renders every major that shares the same cluster as the top recommendation and attaches a "View tab" button that calls `selectTabForMajor` (lines 355-362).
- Only the top five majors have tabs, so for most cluster entries the selector does not find a matching tab button. Clicking those buttons does nothing, which is confusing UX.
- Either limit the cluster list to majors that have corresponding tabs, or update the handler to navigate somewhere meaningful (e.g., scroll to the resources section or open the official link).

## 3. NaN percentages when all majors tie at zero
- `calculateResults` divides each major’s score by `maxScore` to compute the display percentage (lines 42-48 of `js/scoring.js`).
- When every major ends up with a score of `0`—which can happen with placeholder data or a misconfigured quiz—`maxScore` becomes `0` and each `percent` evaluates to `Math.round(0/0 * 100)`, i.e. `NaN`.
- The downstream UI expects numbers (e.g., to render progress circles), so the results view will display `NaN%` or break formatting. Guard against the zero-denominator case and default to `0` instead.

## 4. History entry rewrites to `/results`, breaking the Back button on static hosts
- `saveResults` pushes a `/results` entry into the history stack before redirecting to `results.html` (lines 74-76 of `js/scoring.js`).
- On static hosting (GitHub Pages, Netlify), `/results` does not resolve; when users click Back from the results page they land on `/results` and hit a 404.
- Remove the `history.pushState` call or update it to keep the relative `results.html` URL so the Back button returns to the quiz.
