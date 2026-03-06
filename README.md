# Bradley Hunter — Portfolio

Personal portfolio and resume website showcasing software engineering projects, skills, and work experience.

**Live site:** [bradley-hunter.github.io/resume](https://bradley-hunter.github.io/resume/)

## Tech Stack

- **React 19** — component-based UI
- **Vite 7** — build tooling and dev server
- **Tailwind CSS v4** — utility-first styling with dark/light mode
- **react-router-dom** — client-side routing (HashRouter for GitHub Pages)
- **react-markdown** — markdown blog with YAML frontmatter
- **react-syntax-highlighter** — syntax-highlighted code blocks
- **ESLint 9** — linting with React and hooks rules

## Features

- **Dark / mid-tone light mode** — toggle between themes, persisted to localStorage
- **Markdown blog** — posts auto-discovered from `.md` files with YAML frontmatter, tag filtering, draft preview mode
- **Featured projects** — highlighted at the top of the Projects hub
- **Open Graph / Twitter Card meta tags** — per-page social share previews (title, description, image)
- **Umami Analytics** — privacy-respecting, cookie-free analytics that works for a developer audience
- **Error boundary** — catches page-level render errors without crashing the whole app
- **Per-page document titles and meta descriptions** — updates on every navigation
- **Collapsible code blocks** — syntax-highlighted source with Prism
- **Grouped source code** — multi-language projects organized by language with per-group GitHub links
- **Project dropdown nav** — hover dropdown on desktop, expandable list on mobile
- **Responsive** — mobile-first layout with hamburger menu
- **Print-friendly resume** — dedicated `/resume` page optimized for PDF export
- **Code splitting** — syntax highlighter and code data loaded as separate chunks

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173/resume/](http://localhost:5173/resume/) in your browser.

## Build & Lint

```bash
npm run build     # production build
npm run preview   # preview production build locally
npm run lint      # run ESLint across src/
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx             # Sticky nav with project dropdown + dark mode toggle
│   ├── Footer.jsx             # Contact links (GitHub, LinkedIn, Email)
│   ├── Layout.jsx             # Page shell (Header + ErrorBoundary + Outlet + Footer)
│   ├── ErrorBoundary.jsx      # Catches render errors, shows fallback UI
│   ├── ThemeProvider.jsx      # Dark/light mode context
│   ├── DarkModeToggle.jsx     # Sun/moon theme toggle button
│   ├── ProjectDropdown.jsx    # Desktop hover dropdown for projects
│   ├── CodeBlock.jsx          # Collapsible syntax-highlighted code viewer
│   ├── ProjectCard.jsx        # Card for project hub grid (supports featured variant)
│   ├── BlogCard.jsx           # Card for blog post listing
│   ├── ToolBadge.jsx          # Technology pill badge
│   ├── Section.jsx            # Reusable heading + content wrapper
│   └── JobEntry.jsx           # Employment entry with duties list
├── hooks/
│   ├── useDocTitle.js         # Sets document.title per page
│   ├── useMetaDescription.js  # Sets <meta name="description"> per page
│   └── useOpenGraph.js        # Sets Open Graph + Twitter Card meta tags per page
├── pages/
│   ├── HomePage.jsx           # Resume — hero, about, skills, employment, education
│   ├── ProjectsHub.jsx        # Featured + grid of all projects
│   ├── ProjectPage.jsx        # Individual project detail page
│   ├── BlogHub.jsx            # Blog listing with tag filtering
│   ├── BlogPost.jsx           # Individual blog post with markdown rendering
│   ├── ContactPage.jsx        # Contact cards + Formspree form
│   ├── ResumePage.jsx         # Print-optimized resume
│   └── NotFoundPage.jsx       # 404 fallback
├── data/
│   ├── resume.js              # About, skills, employment, education
│   ├── projects.js            # Project metadata (descriptions, tools, media, GitHub links)
│   ├── contact.js             # Email, GitHub, LinkedIn
│   ├── blog.js                # Auto-discovers .md files, parses frontmatter
│   ├── blog/                  # Markdown blog posts
│   └── code/                  # Source code strings for inline display
└── index.css                  # Tailwind directives + theme config
public/
└── og-image.svg               # Source file for social share preview image (export as og-image.png)
```

## Blog Posts

Blog posts live in `src/data/blog/` as `.md` files with YAML frontmatter:

```markdown
---
title: My Post Title
date: 2026-03-01
description: Short description for meta tags and cards.
tags: [rust, systems]
draft: false
featured: false
---

Post content here...
```

Set `draft: true` to hide a post from the public listing. Preview drafts at `?preview=true`.

## Deployment

Automatically deployed to GitHub Pages via GitHub Actions on push to `master`. See [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## License

MIT
