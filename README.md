# AutomationExercise Playwright Framework

A TypeScript Playwright test framework covering **smoke**, **regression**, **e2e**, and **API**
tests against:

- UI: https://automationexercise.com
- API: https://automationexercise.com/api_list

## Stack

- [Playwright Test](https://playwright.dev/) + TypeScript
- Page Object Model (`src/pages`)
- Custom fixtures wiring page objects and an API client (`src/fixtures`)
- [@faker-js/faker](https://fakerjs.dev/) for randomized, unique test data
- ESLint + Prettier
- GitHub Actions CI

## Project layout

```
src/
  api/          ApiClient wrapping the 14 documented endpoints
  fixtures/     Custom Playwright test extended with page objects + apiClient
  pages/        Page Object Model classes (one per site page)
  utils/        Test data generation (faker-backed)
tests/
  api/          API tests, one file per documented endpoint group
  ui/
    smoke/      Fast, critical-path checks (chromium only)
    regression/ Broader functional coverage (chromium + firefox + webkit)
    e2e/        Full user journeys (register/login → purchase → logout/delete)
  fixtures/     Static test fixtures (e.g. file upload sample)
.github/workflows/playwright.yml
```

## Getting started

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env   # optional, only needed to override base URLs
```

## Running tests

```bash
npm test                 # everything, all projects
npm run test:smoke       # smoke only (chromium)
npm run test:regression  # regression, chromium + firefox + webkit
npm run test:e2e         # full user journeys (chromium)
npm run test:api         # API suite (no browser needed)

npm run test:headed      # any of the above with --headed
npm run test:ui          # Playwright's UI mode
npm run report           # open the last HTML report
```

Quality gates:

```bash
npm run lint
npm run typecheck
```

## Test projects

Configured in `playwright.config.ts`:

| Project               | Test dir              | Browser(s)                  |
|------------------------|------------------------|------------------------------|
| `smoke`                | `tests/ui/smoke`       | Chromium                    |
| `regression-chromium`  | `tests/ui/regression`  | Chromium                    |
| `regression-firefox`   | `tests/ui/regression`  | Firefox                     |
| `regression-webkit`    | `tests/ui/regression`  | WebKit                      |
| `e2e`                  | `tests/ui/e2e`         | Chromium                    |
| `api`                  | `tests/api`            | none (uses `request` only)  |

## Test data and cleanup

Every test that creates an account (via the UI signup form or the `registeredUser`
fixture, which seeds a user through `POST /api/createAccount`) deletes that account
before finishing — either through the UI delete-account flow or `DELETE /api/deleteAccount`.
Emails are generated uniquely per run (`uniqueEmail()` in `src/utils/testData.ts`), so
tests are safe to run concurrently and repeatedly against the live site without colliding
or leaving orphaned accounts behind.

## A note on site ads

automationexercise.com is ad-monetized and periodically shows a full-page Google
"Vignette" interstitial ad, independent of anything the tests do. This can intercept
clicks on the nav bar and, in Firefox, can occasionally delay a page's `load` event.
`BasePage` (`src/pages/BasePage.ts`) handles this defensively:

- Page navigations use `waitUntil: 'domcontentloaded'` rather than `load`.
- Nav-bar actions that must land (logout, delete account, "Continue") use
  `clickNavLinkResilient`, which dismisses the overlay and retries the click until the
  expected navigation actually happens.

Combined with `retries: 2` in CI, this keeps the suite reliable despite the third-party
ad noise, which is outside the application/test framework's control.

## CI/CD

`.github/workflows/playwright.yml` runs on push/PR to `main`, nightly at 03:00 UTC, and
via manual dispatch (with a suite picker). Jobs:

1. **lint-and-typecheck** — gate for everything else.
2. **smoke** — every push/PR/dispatch.
3. **api** — every push/PR/dispatch (no browser install needed).
4. **regression** — matrix across chromium/firefox/webkit; PRs, nightly, and dispatch.
5. **e2e** — PRs, nightly, and dispatch.

Each job uploads its HTML report and traces as a build artifact (14-day retention) for
debugging failures.
