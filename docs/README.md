# Documentation Index

## Overview

**my-stagehand-app** is a Proof of Concept (POC) project that demonstrates AI-powered browser automation using Stagehand. The project automates navigation and data extraction on the Real Madrid official e-commerce store, showcasing how AI can understand and interact with web pages using natural language instructions.

The POC validates the capability of Stagehand to:
- Navigate complex e-commerce websites autonomously
- Handle dynamic elements like cookie consent dialogs
- Extract structured data from product pages
- Generate visual reports with screenshots

## Documents

- **architecture.md**: Technical architecture, components, dependencies, and system design decisions
- **functional.md**: Product features, user flows, inputs/outputs, and error handling
- **diagrams.md**: Visual representations of system context, component interactions, and sequence diagrams

## How to Use This Documentation

1. **New developers**: Start with `functional.md` to understand the project's purpose and capabilities
2. **Technical architects**: Review `architecture.md` for system design and integration details
3. **Visual learners**: Refer to `diagrams.md` for flow visualizations
4. **Quick reference**: Return to this `README.md` as the central navigation point

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your LLM API keys to .env

# Run the automation script
npm start

# Run tests with Playwright
npm test

# View test reports
npm run test:report
```

## Project Status

| Component | Status |
|-----------|--------|
| Core Automation | Functional |
| Test Suite | Implemented |
| Report Generation | Working |
| CI/CD Integration | Pending |
