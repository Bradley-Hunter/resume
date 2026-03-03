# Bradley Hunter — Portfolio

Personal portfolio and resume website showcasing software engineering projects, skills, and work experience.

**Live site:** [bradley-hunter.github.io/resume](https://bradley-hunter.github.io/resume/)

## Tech Stack

- **React 19** — component-based UI
- **Vite 7** — build tooling and dev server
- **Tailwind CSS v4** — utility-first styling with dark/light mode
- **react-router-dom** — client-side routing (HashRouter for GitHub Pages)
- **react-syntax-highlighter** — syntax-highlighted code blocks

## Features

- **Dark / mid-tone light mode** — toggle between themes, persisted to localStorage
- **Featured projects** — highlighted at the top of the Projects hub
- **Per-page document titles** — browser tab updates on navigation
- **Collapsible code blocks** — syntax-highlighted source with Prism
- **Grouped source code** — multi-language projects organized by language with per-group GitHub links
- **Project dropdown nav** — hover dropdown on desktop, expandable list on mobile
- **Responsive** — mobile-first layout with hamburger menu
- **Code splitting** — syntax highlighter and code data loaded as separate chunks

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
│   ├── Layout.jsx        # Page shell (Header + Outlet + Footer)
│   ├── ThemeProvider.jsx  # Dark/light mode context
│   ├── DarkModeToggle.jsx # Sun/moon theme toggle button
│   ├── ProjectDropdown.jsx # Desktop hover dropdown for projects
│   ├── CodeBlock.jsx      # Collapsible syntax-highlighted code viewer
│   ├── ProjectCard.jsx    # Card for project hub grid (supports featured variant)
│   ├── ToolBadge.jsx      # Technology pill badge
│   ├── Section.jsx        # Reusable heading + content wrapper
│   └── JobEntry.jsx       # Employment entry with duties list
├── hooks/
│   └── useDocTitle.js     # Sets document.title per page
├── pages/
│   ├── HomePage.jsx       # Resume — hero, about, skills, employment, education
│   ├── ProjectsHub.jsx    # Featured + grid of all projects
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
