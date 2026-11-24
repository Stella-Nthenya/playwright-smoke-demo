# Playwright smoke suite (demo)

Smoke tests for SauceDemo (https://www.saucedemo.com), a public practice shop: login, access control, sorting, cart, checkout and logout. 12 tests run in Chromium, WebKit and mobile-viewport Chromium.

    npm ci && npx playwright install chromium webkit
    npm test
    npm run check:detects-bugs   # the site's deliberately broken account must turn the suite red

`check:detects-bugs` guards against false passes. CI retries once and reports a retried pass as flaky. Failures keep a trace and a screenshot. The GitHub Actions workflow is in `.github/workflows/smoke.yml`.

Independent demo, not client work. Not affiliated with Sauce Labs.
