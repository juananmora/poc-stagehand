import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Stagehand POC
 * 
 * Features:
 * - CI/CD optimized settings
 * - Multiple browser support
 * - Automatic retries in CI
 * - Comprehensive reporting
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: "./tests",

  // Maximum time one test can run
  timeout: 240000,

  // Expect timeout for assertions
  expect: {
    timeout: 15000,
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only - helps with flaky AI responses
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI (Stagehand + LLM can be resource intensive)
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: process.env.CI
    ? [
        ["github"],
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["json", { outputFile: "test-results/results.json" }],
        ["junit", { outputFile: "test-results/junit.xml" }],
      ]
    : [
        ["list"],
        ["html", { open: "never", outputFolder: "playwright-report" }],
      ],

  // Shared settings for all projects
  use: {
    // Run in headless mode
    headless: true,

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Collect trace when retrying a failed test
    trace: process.env.CI ? "on-first-retry" : "retain-on-failure",

    // Capture screenshot on failure
    screenshot: "only-on-failure",

    // Record video for all tests (useful for AI automation debugging)
    video: process.env.CI ? "on-first-retry" : "on",

    // Base URL for relative navigation (if needed)
    // baseURL: "http://localhost:3000",

    // Action timeout
    actionTimeout: 30000,

    // Navigation timeout
    navigationTimeout: 60000,
  },

  // Output folder for test artifacts
  outputDir: "test-results",

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        // Stagehand works best with Chromium
        channel: "chrome",
      },
    },

    // Uncomment to test on Firefox
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // Uncomment to test on WebKit (Safari)
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    // Mobile viewport testing
    // {
    //   name: "mobile-chrome",
    //   use: { ...devices["Pixel 5"] },
    // },
  ],

  // Global setup/teardown (uncomment if needed)
  // globalSetup: require.resolve("./tests/global-setup.ts"),
  // globalTeardown: require.resolve("./tests/global-teardown.ts"),

  // Run your local dev server before starting the tests (if applicable)
  // webServer: {
  //   command: "npm run dev",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});
