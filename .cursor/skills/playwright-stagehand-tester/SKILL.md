---
name: playwright-stagehand-tester
description: Designs and executes Playwright and Stagehand tests with stable selectors, clear steps, and reliable artifacts. Use when the user mentions Playwright, Stagehand, e2e/browser automation, flaky tests, or test reports/screenshots.
---

# Playwright + Stagehand Tester

## Quick start

When the user asks for Playwright/Stagehand test help:
1. Clarify the target page, user goal, and expected assertions.
2. Propose a short test plan (steps + assertions).
3. Provide a minimal, runnable test snippet (TypeScript by default).
4. Include how to run the test and where artifacts appear.

## Preferred response format

Use both a checklist and a short code template:
- Checklist: 4-8 bullets, action + expected result.
- Code: focused snippet with stable selectors and clear assertions.

## Workflow

### 1) Test plan
- Identify page state prerequisites (auth, cookie consent, locale, feature flags).
- List 3-6 user actions and the 1-3 key assertions.
- Prefer deterministic waits: `await expect(locator).toBeVisible()` over timeouts.

### 2) Author the test
- Use Playwright test runner APIs and `locator`-based selectors.
- Prefer `getByRole`, `getByLabel`, `getByTestId` over CSS/XPath.
- If Stagehand is available, use `stagehand.act` for actions and `stagehand.observe`
  for grounded checks, then assert with Playwright.

### 3) Execute
Use the simplest command that matches the request:
- All tests: `npx playwright test`
- Single file: `npx playwright test tests/example.spec.ts`
- Headed/debug: `npx playwright test --headed`
- Report: `npx playwright show-report`

### 4) Artifacts
- Ensure screenshots/videos are enabled if requested.
- Mention default report location or project-specific output folder.

## Templates

### Checklist template
- Open the target page and confirm it loads.
- Perform the key user action(s).
- Verify the primary UI change or navigation.
- Assert any data/state change visible to the user.
- Capture a screenshot or report if needed.

### Repo-specific notes (this project)
- Existing test: `tests/stagehand.spec.ts` uses `Stagehand` helpers like
  `actFromObservation`, `safeAct`, and `expectExtractContains`.
- Config: HTML report enabled; screenshots on failure; video and trace retained
  on failure in `playwright.config.ts`.
- If running the current suite: `npx playwright test tests/stagehand.spec.ts`

### Local run (this project)
- Copy `.env.example` to `.env` and set at least one LLM provider key.
- For Ollama local runs, set `OLLAMA_API_BASE` and `OLLAMA_API_KEY`.
- Then run: `npx playwright test tests/stagehand.spec.ts`

### Playwright + Stagehand test template (TypeScript)
```ts
import { test, expect } from "@playwright/test";
import { Stagehand } from "@browserbasehq/stagehand";

test("scenario name", async ({ page }) => {
  const stagehand = new Stagehand({ page });

  await page.goto("https://example.com");

  // Example Stagehand action + Playwright assertion
  await stagehand.act("Open the login dialog");
  await expect(page.getByRole("dialog", { name: /login/i })).toBeVisible();
});
```

## Guardrails

- Avoid fixed timeouts unless explicitly required.
- Prefer user-visible assertions (text, role, label, state).
- Keep tests minimal: one scenario per test.
- If the user reports flakiness, suggest isolating selectors, adding stable ids,
  and replacing sleeps with `expect`-based waits.

## When to ask for inputs

Ask only for missing essentials:
- Target URL or app route
- User flow steps
- Expected result/assertion
If not provided, infer and proceed with reasonable defaults.
