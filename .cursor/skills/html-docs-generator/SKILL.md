---
name: html-docs-generator
description: Generates beautiful HTML documentation with Mermaid diagrams, AI-themed styling, and modern CSS. Use when the user asks for HTML documentation, web-based docs, or visual documentation with diagrams.
---

# HTML Documentation Generator

## Purpose

Generate comprehensive, visually appealing HTML documentation for a repository. Output includes modern CSS styling, Mermaid.js diagrams, and AI/tech-themed images. All documentation is self-contained and can be viewed in any browser.

## When to Use

Use this skill when the user requests:

- HTML documentation
- Web-based documentation
- Visual documentation with diagrams
- Beautiful/styled documentation
- Documentation that can be opened in a browser

## Output Location

- Write to `htm/` folder at the repository root
- If `htm/` does not exist, create it
- Prefer updating existing files over creating new ones

## Required Files

Create or update these files:

- `htm/index.html` - Main documentation page (overview, navigation)
- `htm/architecture.html` - Technical architecture documentation
- `htm/functional.html` - Functional documentation
- `htm/diagrams.html` - All Mermaid diagrams
- `htm/styles.css` - Modern CSS styling

---

## CRITICAL: Mermaid Diagrams

> **ALL DIAGRAMS MUST BE IN MERMAID FORMAT AND RENDERED CLIENT-SIDE**

### Mermaid.js Setup

Every HTML page with diagrams MUST include:

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({ 
    startOnLoad: true,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#6366f1',
      primaryTextColor: '#e2e8f0',
      primaryBorderColor: '#818cf8',
      lineColor: '#06b6d4',
      secondaryColor: '#1a1a2e',
      tertiaryColor: '#252542',
      background: '#0f0f23',
      mainBkg: '#1a1a2e',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      textColor: '#e2e8f0',
      nodeTextColor: '#e2e8f0'
    }
  });
</script>
```

### Mermaid Diagram Format in HTML

Use `<div class="mermaid">` tags (NOT code blocks):

```html
<div class="mermaid">
flowchart TD
    A[Start] --> B[End]
</div>
```

### Minimum Required Diagrams

The `diagrams.html` page MUST include at least:

1. **System Context** (`flowchart TB/LR`) - External actors and systems
2. **Component Diagram** (`flowchart LR`) - Internal module relationships
3. **Sequence Diagram** (`sequenceDiagram`) - At least one key flow
4. **Error Handling Flow** (`flowchart TD`) - Retry/error logic
5. **State Diagram** (`stateDiagram-v2`) - Lifecycle states

---

## CSS Theme Requirements

### Color Palette (AI/Tech Dark Theme)

```css
:root {
  /* Primary Colors */
  --primary: #6366f1;        /* Indigo/Violet */
  --primary-light: #818cf8;
  --secondary: #06b6d4;      /* Cyan */
  --accent: #f472b6;         /* Pink */
  
  /* Backgrounds */
  --bg-dark: #0f0f23;
  --bg-card: #1a1a2e;
  --bg-card-hover: #252542;
  
  /* Text */
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
}
```

### Required CSS Features

- Dark background with subtle gradient patterns
- Glow effects on interactive elements
- Card-based layout with hover animations
- Responsive design (mobile-friendly)
- Sticky navigation bar
- Smooth scroll behavior
- Code blocks with syntax highlighting colors

### Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- Body text: Inter
- Code: JetBrains Mono

---

## AI/Tech Images

Include relevant tech/AI images from Unsplash. Use these URL patterns:

```
https://images.unsplash.com/photo-{ID}?w=1200&h=400&fit=crop
```

### Recommended Image IDs (AI/Tech themed)

| Image Type | Unsplash Photo ID | Description |
|------------|-------------------|-------------|
| Neural Network | `1677442136019-21780ecad995` | AI brain visualization |
| Server Room | `1558494949-ef010cbdcc31` | Data center architecture |
| Circuit Board | `1555255707-c07966088b7b` | Tech circuit patterns |
| Robot | `1531746790731-6c087fecd65a` | AI robot assistant |
| Dashboard | `1551288049-bebda4e38f71` | Data visualization |
| Matrix Code | `1526374965328-7f61d4dc18c5` | Code/data flow |
| AI Brain | `1620712943543-bcc4688e7485` | Neural network brain |

### Image Container Template

```html
<div class="ai-image-container">
  <img src="https://images.unsplash.com/photo-{ID}?w=1200&h=350&fit=crop" 
       alt="Description" class="ai-image">
  <div class="ai-image-overlay">
    <h3>Title</h3>
    <p>Subtitle text</p>
  </div>
</div>
```

---

## HTML Structure Templates

### Base HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - Project Name</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({ startOnLoad: true, theme: 'dark', /* ... */ });
  </script>
</head>
<body>
  <nav class="navbar"><!-- Navigation --></nav>
  <section class="hero"><!-- Hero section --></section>
  <main class="container"><!-- Content --></main>
  <footer class="footer"><!-- Footer --></footer>
</body>
</html>
```

### Navigation Template

```html
<nav class="navbar">
  <div class="nav-content">
    <a href="index.html" class="nav-brand">
      <svg><!-- Logo SVG --></svg>
      Project Name
    </a>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="architecture.html">Architecture</a></li>
      <li><a href="functional.html">Functional</a></li>
      <li><a href="diagrams.html">Diagrams</a></li>
    </ul>
  </div>
</nav>
```

### Card Grid Template

```html
<div class="card-grid">
  <div class="card">
    <h3>Title</h3>
    <p>Description</p>
  </div>
  <!-- More cards -->
</div>
```

### Table Template

```html
<table>
  <thead>
    <tr><th>Column 1</th><th>Column 2</th></tr>
  </thead>
  <tbody>
    <tr><td>Data</td><td>Data</td></tr>
  </tbody>
</table>
```

---

## Page Content Requirements

### index.html (Home)

- Hero section with project title and description
- Feature cards (4-6 key features)
- System context diagram (embedded Mermaid)
- Quick start code block
- Project status table
- Links to other documentation pages

### architecture.html

- System overview and goals
- Component tables
- Data flow diagram (Mermaid)
- Runtime and deployment info
- Dependencies tables
- Key architectural decisions

### functional.html

- Problem statement and solution
- Target users table
- Core features (6+ features with code examples)
- User flow diagrams (Mermaid)
- Inputs/outputs tables
- Error handling section with diagram

### diagrams.html

- Diagram index with anchor links
- All Mermaid diagrams (minimum 10):
  1. System Context
  2. Component Diagram
  3. Main Execution Flow (sequence)
  4. Test Execution Flow (sequence)
  5. Method/Function Flow
  6. Error Handling Flow
  7. Report/Output Generation
  8. User Journey
  9. State Diagram
  10. Deployment Architecture
- Summary table of all diagrams

---

## Workflow

1. Read and understand the repository structure and code
2. Create `htm/styles.css` with the full CSS theme
3. Create `htm/index.html` with overview and navigation
4. Create `htm/architecture.html` with technical details
5. Create `htm/functional.html` with features and flows
6. Create `htm/diagrams.html` with all Mermaid diagrams
7. Verify all pages link correctly and diagrams render
8. Add AI/tech images to enhance visual appeal

## Quality Checks

Before completing, verify:

- [ ] All HTML files are valid and well-structured
- [ ] CSS is properly linked in all pages
- [ ] Mermaid.js is loaded and configured in pages with diagrams
- [ ] All diagrams use `<div class="mermaid">` format
- [ ] Navigation works between all pages
- [ ] Images load correctly (use Unsplash URLs)
- [ ] Responsive design works on mobile viewports
- [ ] Code blocks are properly styled
- [ ] Tables are readable and styled

## Notes

- All content must be based on actual repository code and configuration
- Do not invent features or services not present in the codebase
- Use consistent terminology across all pages
- Keep diagrams accurate to the actual system flows
- Test that HTML pages open correctly in a browser
