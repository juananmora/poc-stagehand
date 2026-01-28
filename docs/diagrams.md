# Diagrams

## System Context

Overview of how the POC system interacts with external components.

```mermaid
flowchart TB
    subgraph Users["Users"]
        Dev["Developer / QA Engineer"]
    end
    
    subgraph POC["my-stagehand-app"]
        Main["Main Script\n(index.ts)"]
        Tests["Test Suite\n(stagehand.spec.ts)"]
    end
    
    subgraph External["External Services"]
        LLM["LLM Service\n(Ollama / OpenAI)"]
        Website["Target Website\n(shop.realmadrid.com)"]
    end
    
    subgraph Outputs["Generated Outputs"]
        Reports["Markdown Reports"]
        Screenshots["Screenshots"]
        HTMLReport["HTML Test Report"]
    end
    
    Dev -->|"npm start"| Main
    Dev -->|"npm test"| Tests
    Main --> LLM
    Tests --> LLM
    Main --> Website
    Tests --> Website
    Main --> Reports
    Main --> Screenshots
    Tests --> HTMLReport
    Tests --> Screenshots
```

## Component Diagram

Internal structure and relationships between components.

```mermaid
flowchart LR
    subgraph Application["Application Layer"]
        index["index.ts"]
        test["stagehand.spec.ts"]
    end
    
    subgraph SDK["Stagehand SDK"]
        Stagehand["Stagehand Class"]
        Act["act()"]
        Extract["extract()"]
        Observe["observe()"]
        Context["V3Context"]
    end
    
    subgraph LLMClient["LLM Integration"]
        CustomClient["CustomOpenAIClient"]
        OpenAI["OpenAI Client"]
    end
    
    subgraph Browser["Browser Layer"]
        Playwright["Playwright"]
        Page["Page Object"]
        BrowserCtx["Browser Context"]
    end
    
    index --> Stagehand
    test --> Stagehand
    Stagehand --> Act
    Stagehand --> Extract
    Stagehand --> Observe
    Stagehand --> Context
    Act --> CustomClient
    Extract --> CustomClient
    Observe --> CustomClient
    CustomClient --> OpenAI
    Context --> BrowserCtx
    BrowserCtx --> Page
    Page --> Playwright
```

## Main Execution Flow

Sequence diagram for the main script (`npm start`).

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Main as index.ts
    participant SH as Stagehand
    participant LLM as LLM Service
    participant Browser as Playwright Browser
    participant Site as Real Madrid Shop
    participant FS as File System
    
    Dev->>Main: npm start
    Main->>SH: new Stagehand(config)
    Main->>SH: init()
    SH->>Browser: Launch browser
    Browser-->>SH: Browser ready
    
    Main->>Browser: goto(players URL)
    Browser->>Site: HTTP Request
    Site-->>Browser: Page loaded
    
    Main->>SH: act("Accept cookies")
    SH->>LLM: Analyze page + instruction
    LLM-->>SH: Element to click
    SH->>Browser: Click element
    Main->>Browser: screenshot()
    Browser-->>FS: Save 01-accepted-cookies.png
    
    Main->>SH: act("Open Carvajal page")
    SH->>LLM: Analyze page + instruction
    LLM-->>SH: Link to click
    SH->>Browser: Click link
    Browser->>Site: Navigate
    Main->>Browser: screenshot()
    Browser-->>FS: Save 02-dani-carvajal-page.png
    
    Main->>SH: act("Open product page")
    SH->>LLM: Analyze page + instruction
    LLM-->>SH: Product link
    SH->>Browser: Click product
    Main->>Browser: screenshot()
    Browser-->>FS: Save 03-product-page.png
    
    Main->>SH: act("Select size L")
    SH->>LLM: Analyze page + instruction
    LLM-->>SH: Size button
    SH->>Browser: Click size
    Main->>Browser: screenshot()
    Browser-->>FS: Save 04-size-l-selection.png
    
    Main->>SH: extract("Product info")
    SH->>LLM: Analyze page + extraction request
    LLM-->>SH: Structured data
    SH-->>Main: availability data
    
    Main->>SH: extract("Summary")
    SH->>LLM: Generate summary
    LLM-->>SH: Text summary
    SH-->>Main: summary text
    
    Main->>FS: writeFile(report.md)
    Main->>SH: close()
    SH->>Browser: Close browser
    Main-->>Dev: Execution complete
```

## Test Execution Flow

Sequence diagram for Playwright test execution (`npm test`).

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant PW as Playwright Runner
    participant Test as stagehand.spec.ts
    participant SH as Stagehand
    participant LLM as LLM Service
    participant Browser as Browser
    participant Site as Target Site
    
    Dev->>PW: npm test
    PW->>Test: Load test file
    PW->>Test: Run test
    
    Test->>SH: new Stagehand(config)
    Test->>SH: init()
    SH->>Browser: Launch browser
    
    rect rgb(240, 248, 255)
        Note over Test,Site: Step: Open players list
        Test->>Browser: goto(URL)
        Browser->>Site: Load page
        Test->>Test: attachShot("01-players-list")
    end
    
    rect rgb(255, 248, 240)
        Note over Test,Site: Step: Accept cookies
        Test->>SH: observe("Find cookie button")
        SH->>LLM: Analyze page
        LLM-->>SH: Actions array
        Test->>SH: act(matchedAction)
        SH->>Browser: Click accept
        Test->>Test: attachShot("02-accepted-cookies")
    end
    
    rect rgb(240, 255, 240)
        Note over Test,Site: Step: Open player page
        Test->>SH: actFromObservation("Carvajal")
        SH->>LLM: Find element
        SH->>Browser: Click player
        Test->>SH: extract("Confirm player")
        SH->>LLM: Verify page
        LLM-->>Test: "Carvajal"
        Test->>Test: expect().toContain()
        Test->>Test: attachShot("03-dani-carvajal-page")
    end
    
    rect rgb(255, 240, 255)
        Note over Test,Site: Step: Open product
        Test->>SH: actFromObservation(productName)
        SH->>Browser: Click product
        Test->>SH: extract("Confirm product")
        Test->>Test: expect().toContain()
        Test->>Test: attachShot("04-product-page")
    end
    
    rect rgb(255, 255, 240)
        Note over Test,Site: Step: Select size & extract
        Test->>SH: safeAct("Select size L")
        SH->>Browser: Click size
        Test->>SH: extract("Availability")
        Test->>SH: extract("Summary")
        Test->>Test: attach("availability.txt")
        Test->>Test: attach("summary.txt")
    end
    
    Test->>SH: close()
    SH->>Browser: Close browser
    Test-->>PW: Test complete
    PW->>PW: Generate HTML report
    PW-->>Dev: Results + Report
```

## Stagehand Method Flow

How Stagehand methods interact with the LLM and browser.

```mermaid
flowchart TD
    subgraph Input["Developer Input"]
        Instruction["Natural Language\nInstruction"]
    end
    
    subgraph Stagehand["Stagehand Processing"]
        Act["act()"]
        Extract["extract()"]
        Observe["observe()"]
    end
    
    subgraph LLMProcessing["LLM Processing"]
        PageAnalysis["Analyze Page\nDOM/Screenshot"]
        ElementID["Identify Target\nElement"]
        DataExtract["Extract Requested\nData"]
        ActionPlan["Plan Available\nActions"]
    end
    
    subgraph BrowserActions["Browser Actions"]
        Click["Click Element"]
        Type["Type Text"]
        Navigate["Navigate"]
        Capture["Screenshot"]
    end
    
    subgraph Output["Output"]
        Result["Execution Result"]
        Data["Extracted Data"]
        Actions["Action Candidates"]
    end
    
    Instruction --> Act
    Instruction --> Extract
    Instruction --> Observe
    
    Act --> PageAnalysis
    Extract --> PageAnalysis
    Observe --> PageAnalysis
    
    PageAnalysis --> ElementID
    PageAnalysis --> DataExtract
    PageAnalysis --> ActionPlan
    
    ElementID --> Click
    ElementID --> Type
    ElementID --> Navigate
    
    DataExtract --> Data
    ActionPlan --> Actions
    
    Click --> Result
    Type --> Result
    Navigate --> Result
```

## Error Handling Flow

How errors are handled with retry logic.

```mermaid
flowchart TD
    Start["Start Action"] --> TryAction["Execute stagehand.act()"]
    TryAction --> Success{Success?}
    
    Success -->|Yes| Return["Return Result"]
    Success -->|No| CheckRetry{Retries\nRemaining?}
    
    CheckRetry -->|Yes| IncrementAttempt["Increment Attempt\nCounter"]
    IncrementAttempt --> Wait["Wait (optional)"]
    Wait --> TryAction
    
    CheckRetry -->|No| CaptureError["Capture Error\nArtifacts"]
    CaptureError --> AttachScreenshot["Attach Screenshot"]
    AttachScreenshot --> AttachError["Attach Error Text"]
    AttachError --> Throw["Throw Error /\nFail Test"]
    
    style Start fill:#90EE90
    style Return fill:#90EE90
    style Throw fill:#FFB6C1
```

## Report Generation Flow

How the markdown report is assembled.

```mermaid
flowchart LR
    subgraph Execution["Execution Phase"]
        Nav1["Step 1:\nCookies"]
        Nav2["Step 2:\nPlayer Page"]
        Nav3["Step 3:\nProduct Page"]
        Nav4["Step 4:\nSize Selection"]
        Ext1["Extract:\nAvailability"]
        Ext2["Extract:\nSummary"]
    end
    
    subgraph Screenshots["Screenshot Captures"]
        SS1["01-accepted-cookies.png"]
        SS2["02-dani-carvajal-page.png"]
        SS3["03-product-page.png"]
        SS4["04-size-l-selection.png"]
    end
    
    subgraph Data["Extracted Data"]
        Avail["Product Name\nPrice\nSize L Status"]
        Summary["2-4 Sentence\nDescription"]
    end
    
    subgraph Report["report.md"]
        Header["# Reporte de prueba"]
        Meta["## Ejecucion\nURL, Date, Command"]
        Navigation["## Navegacion\nScreenshots embedded"]
        Product["## Comprobacion\nAvailability data"]
        Resumen["## Resumen\nGenerated summary"]
    end
    
    Nav1 --> SS1
    Nav2 --> SS2
    Nav3 --> SS3
    Nav4 --> SS4
    Ext1 --> Avail
    Ext2 --> Summary
    
    SS1 --> Navigation
    SS2 --> Navigation
    SS3 --> Navigation
    SS4 --> Navigation
    Avail --> Product
    Summary --> Resumen
    
    Header --> Meta
    Meta --> Navigation
    Navigation --> Product
    Product --> Resumen
```

## User Journey: E-Commerce Navigation

Visual representation of the automated user journey on the Real Madrid shop.

```mermaid
journey
    title Real Madrid Shop Automation Journey
    section Landing
      Open Players Page: 5: Automation
      View Cookie Dialog: 3: Website
      Accept Cookies: 5: Automation
    section Player Selection
      Browse Players List: 4: Automation
      Find Dani Carvajal: 5: Automation
      Open Player Profile: 5: Automation
    section Product Selection
      View Player Products: 4: Website
      Select Authentic Kit: 5: Automation
      Open Product Page: 5: Automation
    section Product Configuration
      View Product Details: 4: Website
      Select Size L: 5: Automation
      Verify Availability: 5: Automation
    section Data Collection
      Extract Product Info: 5: Automation
      Generate Summary: 5: Automation
      Create Report: 5: Automation
```

## State Diagram: Test Execution States

```mermaid
stateDiagram-v2
    [*] --> Initializing: npm test
    
    Initializing --> BrowserLaunched: Stagehand.init()
    
    BrowserLaunched --> NavigatingToSite: page.goto()
    
    NavigatingToSite --> HandlingCookies: Page loaded
    
    HandlingCookies --> PlayerPageNavigation: Cookies accepted
    HandlingCookies --> PlayerPageNavigation: No cookies dialog
    
    PlayerPageNavigation --> PlayerPageVerification: Clicked Carvajal
    
    PlayerPageVerification --> ProductPageNavigation: Player confirmed
    PlayerPageVerification --> Failed: Player not found
    
    ProductPageNavigation --> ProductVerification: Clicked product
    
    ProductVerification --> SizeSelection: Product confirmed
    ProductVerification --> Failed: Product not found
    
    SizeSelection --> DataExtraction: Size L selected
    
    DataExtraction --> ReportGeneration: Data extracted
    
    ReportGeneration --> Cleanup: Report saved
    
    Cleanup --> [*]: Browser closed
    
    Failed --> Cleanup: Capture artifacts
```

## Deployment Architecture

```mermaid
flowchart TB
    subgraph Development["Development Environment"]
        Code["TypeScript Code"]
        EnvFile[".env Configuration"]
    end
    
    subgraph LocalExecution["Local Execution"]
        NodeJS["Node.js Runtime"]
        Playwright["Playwright Browser"]
        OllamaLocal["Ollama LLM\n(Local)"]
    end
    
    subgraph CloudExecution["Cloud Execution (Optional)"]
        BrowserBase["BrowserBase\nCloud Browsers"]
        OpenAICloud["OpenAI API\n(Cloud)"]
    end
    
    subgraph CI_CD["CI/CD Pipeline"]
        GitHub["GitHub Actions /\nAzure DevOps"]
        TestRunner["Playwright\nTest Runner"]
        ArtifactStorage["Artifact Storage"]
    end
    
    Code --> NodeJS
    EnvFile --> NodeJS
    
    NodeJS --> Playwright
    NodeJS --> OllamaLocal
    
    NodeJS -.->|"env: BROWSERBASE"| BrowserBase
    NodeJS -.->|"OpenAI API Key"| OpenAICloud
    
    Code --> GitHub
    GitHub --> TestRunner
    TestRunner --> ArtifactStorage
```
