# POC Stagehand - AI-Powered Browser Automation

## Overview

**my-stagehand-app** is a Proof of Concept (POC) that demonstrates AI-powered browser automation using [Stagehand v3](https://github.com/browserbase/stagehand). This project showcases how natural language instructions can replace brittle CSS selectors for more maintainable and resilient web automation.

### Key Features

- **AI-Driven Navigation**: Use natural language instead of CSS/XPath selectors
- **Intelligent Data Extraction**: Extract structured data using AI interpretation
- **Visual Evidence**: Automatic screenshot capture at each step
- **Playwright Integration**: Full E2E testing with industry-standard tools
- **Local LLM Support**: Compatible with Ollama for offline development
- **Report Generation**: Comprehensive markdown reports with embedded screenshots

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and configure your LLM provider:

**Option A: Local Ollama (Recommended for Development)**
```bash
OLLAMA_API_KEY=ollama
OLLAMA_API_BASE=http://localhost:11434/v1
```

**Option B: OpenAI API**
```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Install Playwright Browsers

```bash
npm run playwright:install
```

### 4. Run the Automation

**Standalone Script:**
```bash
npm start
```
This will navigate the Real Madrid shop, extract product information, and generate a report in `reports/run-{timestamp}/`.

**Test Suite:**
```bash
npm test              # Run tests
npm run test:report   # View HTML report
npm run test:headed   # Run with visible browser
```

## Project Structure

```
my-stagehand-app/
├── index.ts                  # Main automation script
├── tests/
│   └── stagehand.spec.ts     # Playwright test suite
├── docs/                     # Detailed documentation
│   ├── README.md             # Documentation index
│   ├── architecture.md       # Technical architecture
│   ├── functional.md         # Features and user flows
│   └── diagrams.md           # Visual diagrams
├── reports/                  # Generated execution reports
├── playwright-report/        # Test reports (HTML, JSON)
├── playwright.config.ts      # Test configuration
├── package.json              # Dependencies and scripts
└── .env.example              # Environment configuration template
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the main automation script |
| `npm test` | Run Playwright test suite |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:ui` | Open Playwright test UI |
| `npm run test:report` | View HTML test report |
| `npm run test:ci` | Run tests in CI mode |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Type check without emitting files |

## What This POC Demonstrates

This project automates the Real Madrid official shop to:

1. Navigate to the players page
2. Accept cookie consent (if prompted)
3. Open a specific player's page (Dani Carvajal)
4. Open a specific product (Authentic Home Jersey 25/26)
5. Select size L
6. Extract product information (name, price, availability)
7. Generate a natural language summary

**Why Natural Language?**
```typescript
// Traditional approach (brittle):
await page.click('button[data-testid="cookie-accept"]');

// AI-powered approach (resilient):
await stagehand.act("Accept cookies on the site if prompted");
```

## Documentation

For detailed information, see the [docs/](docs/) directory:

- **[docs/README.md](docs/README.md)**: Documentation index and quick reference
- **[docs/architecture.md](docs/architecture.md)**: Technical architecture and design decisions
- **[docs/functional.md](docs/functional.md)**: Features, user flows, and test scenarios
- **[docs/diagrams.md](docs/diagrams.md)**: Visual system diagrams

## LLM Configuration

The project is configured to work with local Ollama by default. Configuration is in `index.ts`:

```typescript
const stagehand = new Stagehand({
  env: "LOCAL",
  llmClient: new CustomOpenAIClient({
    modelName: "gpt-oss:20b-cloud",
    client: new OpenAI({
      apiKey: process.env.OLLAMA_API_KEY ?? "ollama",
      baseURL: process.env.OLLAMA_API_BASE ?? "http://localhost:11434/v1",
    }),
  }),
});
```

To switch to cloud-hosted browsers, change `env: "LOCAL"` to `env: "BROWSERBASE"` and configure BrowserBase credentials in `.env`.

## Requirements

- Node.js 18+
- LLM provider (Ollama local or OpenAI API)
- Chromium browser (installed via `npm run playwright:install`)

## Learn More

- [Stagehand Documentation](https://github.com/browserbase/stagehand)
- [Playwright Documentation](https://playwright.dev/)
- [claude.md](claude.md): Stagehand API reference and examples

## Development Tools

This project includes custom `.cursorrules` to help with Stagehand development patterns and best practices when using Cursor IDE.
