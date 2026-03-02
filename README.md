# Bradley Hunter — Portfolio

Personal portfolio and resume website showcasing software engineering projects, skills, and work experience.

**Live site:** [bradley-hunter.github.io/resume](https://bradley-hunter.github.io/resume/)

## Tech Stack

- **React 19** — component-based UI
- **Vite 7** — build tooling and dev server
- **Tailwind CSS v4** — utility-first styling with dark/light mode
- **react-router-dom** — client-side routing (HashRouter for GitHub Pages)
- **react-syntax-highlighter** — syntax-highlighted code blocks
- **framer-motion** — page transition animations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173/resume/](http://localhost:5173/resume/) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Header.jsx        # Sticky nav with project dropdown + dark mode toggle
│   ├── Footer.jsx        # Contact links (GitHub, LinkedIn, Email)
│   ├── Layout.jsx        # Page shell with animated transitions
│   ├── ThemeProvider.jsx  # Dark/light mode context
│   ├── CodeBlock.jsx      # Collapsible syntax-highlighted code viewer
│   ├── ProjectCard.jsx    # Card for project hub grid
│   └── ...
├── pages/
│   ├── HomePage.jsx       # Resume — hero, about, skills, employment, education
│   ├── ProjectsHub.jsx    # Grid of all projects
│   └── ProjectPage.jsx    # Individual project detail page
├── data/
│   ├── resume.js          # About, skills, employment, education
│   ├── projects.js        # Project metadata (descriptions, tools, media, GitHub links)
│   └── code/              # Source code strings for inline display
└── index.css              # Tailwind directives + theme config
```

## Deployment

Automatically deployed to GitHub Pages via GitHub Actions on push to `master`. See [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## License

MIT
