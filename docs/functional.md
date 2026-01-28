# Functional Documentation

## Product Purpose

### Problem Statement

Traditional web automation relies on brittle CSS selectors and XPath expressions that break when websites update their UI. This creates significant maintenance overhead and reduces the reliability of automated tests and data extraction processes.

### Solution

This POC demonstrates **AI-powered browser automation** using Stagehand, which interprets natural language instructions to interact with web pages. Instead of targeting elements by technical selectors, the automation describes what it wants to do in plain language, and the AI determines the appropriate actions.

### Target Users

| User Type | Use Case |
|-----------|----------|
| **QA Engineers** | Writing maintainable E2E tests with natural language |
| **Data Engineers** | Building resilient web scrapers |
| **Business Analysts** | Understanding automation logic without code expertise |
| **Developers** | Rapid prototyping of web automation workflows |

## Core Features

### Feature 1: AI-Driven Navigation

**Description**: Navigate web pages using natural language instructions instead of hardcoded selectors.

**Example**:
```typescript
await stagehand.act("Open the Dani Carvajal player page");
```

**Benefits**:
- Survives UI changes without code modifications
- Self-documenting automation scripts
- Reduced time-to-implementation

---

### Feature 2: Intelligent Data Extraction

**Description**: Extract structured data from pages by describing what information is needed.

**Example**:
```typescript
const availability = await stagehand.extract(
  "Report the product name, price, and whether size L is available"
);
```

**Benefits**:
- No need to parse HTML manually
- AI understands page context and relationships
- Returns human-readable summaries

---

### Feature 3: Visual Evidence Capture

**Description**: Automatically capture screenshots at each step for reporting and debugging.

**Example**:
```typescript
const capture = async (label: string) => {
  await page.screenshot({ path: `${runDir}/${label}.png`, fullPage: true });
};
```

**Benefits**:
- Visual audit trail of execution
- Faster debugging of failures
- Documentation artifacts generated automatically

---

### Feature 4: Resilient Action Execution

**Description**: Retry failed actions with the `observe + act` pattern and built-in retry logic.

**Example**:
```typescript
const actWithRetry = async (instruction: string, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await stagehand.act(instruction);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};
```

**Benefits**:
- Handles transient failures gracefully
- Reduces false negatives in test suites
- Configurable retry policies

---

### Feature 5: Markdown Report Generation

**Description**: Generate comprehensive markdown reports with embedded screenshots and extracted data.

**Output Example**:
```markdown
# Reporte de prueba

## Ejecucion
- URL: https://shop.realmadrid.com/content/players
- Fecha: 2025-01-28T10:30:00.000Z

## Navegacion (con screenshots)
1. Aceptar cookies
![](./01-accepted-cookies.png)
2. Pagina de Dani Carvajal
![](./02-dani-carvajal-page.png)
...
```

---

### Feature 6: Playwright Test Integration

**Description**: Run AI-powered automation within the Playwright test framework for CI/CD integration.

**Benefits**:
- Standard test reporting (HTML, JSON, JUnit)
- Video recording on failure
- Trace files for debugging
- Compatible with existing CI/CD pipelines

## User Flows

### Flow 1: Standalone Automation Script

**Entry Point**: `npm start`

**Steps**:
1. Initialize Stagehand with LLM client configuration
2. Open browser and navigate to target URL
3. Accept cookie consent if prompted
4. Navigate to player profile page
5. Open specific product page
6. Select product variant (size)
7. Extract product information
8. Generate markdown report with screenshots
9. Close browser

**Output**: `reports/run-{timestamp}/report.md`

---

### Flow 2: Playwright Test Execution

**Entry Point**: `npm test`

**Steps**:
1. Playwright test runner loads configuration
2. Test initializes Stagehand within test context
3. Execute test steps with assertions
4. Capture artifacts (screenshots, attachments)
5. Generate HTML report

**Output**: `playwright-report/index.html`

---

### Flow 3: Development Iteration

**Entry Point**: Manual development workflow

**Steps**:
1. Modify `index.ts` or test file
2. Run `npm start` or `npm test`
3. Review console output and reports
4. Iterate on instructions and logic
5. Validate with `npm test:report`

## Inputs and Outputs

### System Inputs

| Input | Type | Source | Description |
|-------|------|--------|-------------|
| Natural Language Instructions | String | Code | Actions for AI to perform |
| Environment Variables | Config | `.env` file | LLM API keys and endpoints |
| Target URL | String | Code | Website to automate |

### System Outputs

| Output | Type | Location | Description |
|--------|------|----------|-------------|
| Console Logs | Text | stdout | Execution progress and extracted data |
| Screenshots | PNG | `reports/` or `test-results/` | Visual captures at each step |
| Markdown Report | MD | `reports/run-{timestamp}/report.md` | Comprehensive execution summary |
| HTML Report | HTML | `playwright-report/` | Interactive test results |
| Video Recording | WebM | `test-results/` | Full execution video (on failure) |
| Trace File | Zip | `test-results/` | Playwright trace for debugging |

### Expected Behaviors

| Scenario | Expected Behavior |
|----------|-------------------|
| Successful navigation | AI identifies and clicks correct elements |
| Cookie consent dialog | Automatically accepted if detected |
| Element not found | Retry with different approach or fail with error |
| Data extraction | Returns structured text/object with requested information |
| Test assertion failure | Captures screenshot and attaches to report |

## Error Handling

### Error Categories

| Category | Example | Handling Strategy |
|----------|---------|-------------------|
| **Navigation Errors** | Page not found, timeout | Retry navigation, capture screenshot, fail test |
| **Element Not Found** | AI cannot locate element | Retry with alternative instruction, use `observe` pattern |
| **LLM API Errors** | Rate limit, network failure | Retry request, fallback to cached response |
| **Assertion Failures** | Extracted data doesn't match | Attach extraction result and screenshot for debugging |
| **Browser Crashes** | Memory overflow, unexpected close | Test framework handles cleanup, retry execution |

### Retry Mechanisms

**Action Retry (`actWithRetry`)**:
```typescript
const actWithRetry = async (instruction: string, retries = 2) => {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await stagehand.act(instruction);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};
```

**Extract Retry (`expectExtractContains`)**:
- Retries extraction with optional intermediate action
- Configurable delay between attempts
- Attaches failure artifacts if all retries exhausted

### Error Artifacts

When errors occur, the following artifacts are captured:

1. **Screenshot**: Current page state at failure
2. **Extracted Text**: AI's response attached as text file
3. **Error Message**: Full error stack trace
4. **Video**: Complete execution recording (test mode)
5. **Trace**: Playwright trace file for step-by-step debugging

### Graceful Degradation

| Situation | Fallback Behavior |
|-----------|-------------------|
| `observe` fails to find element | Falls back to direct `act` call |
| AI extraction returns unexpected format | Normalizes to string representation |
| Screenshot capture fails | Continues execution, logs warning |
| Report generation fails | Logs error, does not crash main process |

## Test Scenarios

### Primary Test: "navegacion y disponibilidad con Stagehand"

**Objective**: Validate end-to-end navigation and data extraction flow

**Test Steps**:

| Step | Action | Assertion |
|------|--------|-----------|
| 1 | Open players list page | Page loads successfully |
| 2 | Accept cookies | Cookie dialog dismissed |
| 3 | Open Carvajal page | Player name "Carvajal" visible |
| 4 | Open product page | Product name matches target |
| 5 | Verify Carvajal association | Player name in customization |
| 6 | Select size L | Size selection confirmed |
| 7 | Extract availability | Product data captured |
| 8 | Extract summary | Description generated |

**Success Criteria**:
- All assertions pass
- Screenshots captured at each step
- Extracted data contains expected fields
- Test completes within 240 second timeout
