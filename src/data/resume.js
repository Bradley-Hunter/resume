export const about = `Most of my work centers on systems programming and desktop development, where I tend to reach for Rust and TypeScript for personal projects and C++ for my higher-level design coursework, because I prefer the guardrails that statically typed, compiled languages give me. Away from the keyboard I solve Rubik's cubes, read everything I can get my hands on, and play my way through metroidvanias. I like problems that reward patience and pattern recognition, whether that's debugging a tricky borrow checker issue or routing through Hallownest.`

export const resumeAbout = `Systems-focused software engineer graduating from BYU-Idaho December 2026. Builds and ships real tools. Published a Rust crate for RON schema validation (crates.io, at 1.0 with 10 pre-release versions) and architected a full-featured tabbed browser from scratch.`

export const skills = {
  languages: 'Rust, TypeScript',
  languagesNote: 'shipped projects, 10k+ lines each',
  courseworkExposure: 'C++, Python, Java',
}

export const homeSkills = [
  {
    name: 'Rust',
    summary: 'Published the first open-source RON schema validator crate and built a context-aware clipboard manager for Windows.',
  },
  {
    name: 'TypeScript / JavaScript',
    summary: 'Built a tabbed web browser with workspace management, tiling split panes, and automatic session persistence.',
  },
]

export const employment = [
  {
    title: "Teacher's Assistant",
    company: 'Brigham Young University-Idaho',
    dates: 'Sept 2025 - Dec 2025',
    duties: [
      'Assisted students learning foundational programming concepts in CSE110 (Introduction to Programming).',
      'Graded assignments and provided clear, constructive feedback on student code.',
    ],
  },
  {
    title: 'Operations Specialist',
    company: 'CIT Electronics',
    dates: 'Feb 2024 - Nov 2024',
    duties: [
      'Researched and documented technical specifications for electronics, translating complex component details for non-technical team members.',
      'Rapidly onboarded across new product categories and internal tools as business needs shifted.',
    ],
  },
  {
    title: 'Inventory Management/Tech',
    company: 'Ridgefield School District',
    dates: 'June - Aug 2021',
    duties: [
      'Processed and prepared district Chromebook fleet for the school year, inspecting, repairing, and salvaging parts from decommissioned units.',
      'Deployed classroom technology equipment and coordinated distribution of nearly 1,000 devices in a single day.',
    ],
  },
]

export const employmentAdditional = 'Additional experience in customer service and operations roles (2021-2023).'

export const projects = [
  {
    name: 'Vellum Web Browser',
    date: '2026',
    bullets: [
      'Tabbed web browser desktop application with workspace management, tiling split panes modeled as recursive binary trees, bookmarks, searchable history, and automatic session persistence backed by a local SQLite database.',
      'Built a separate Rust API server (Axum, PostgreSQL) for cross-device sync with last-write-wins conflict resolution and soft-delete tombstones.',
      'Renderer process is fully sandboxed with a typed preload bridge exposing roughly 50 explicitly declared methods, preventing accidental API surface exposure in an app that loads arbitrary web content.',
    ],
  },
  {
    name: 'Nib, Clipboard Manager',
    date: '2026',
    bullets: [
      'Windows clipboard manager built in Rust using egui and direct Win32 API calls. Intercepts Win+V through a low-level keyboard hook and replaces the default clipboard history with context-aware filtering that tracks which application every clip came from.',
      'Solved UWP application identification by enumerating child windows of ApplicationFrameHost.exe to find the actual app behind the generic host process.',
      'Detects sensitive content like passwords and API tokens using Shannon entropy analysis rather than pattern matching, with automatic expiration after a configurable timeout.',
    ],
  },
  {
    name: 'RON Schema Validator',
    subtitle: 'Open Source, crates.io',
    date: '2026',
    bullets: [
      'First schema validation tool for RON (Rusty Object Notation). No equivalent existed before this project. Define expected data structure in a custom .ronschema format, then validate against it, catching type mismatches, missing fields, and invalid enum variants.',
      '~8,000 lines of Rust across 10 pre-release versions to 1.0. ~250 downloads on crates.io. MIT licensed.',
    ],
  },
]

export const education = {
  degree: 'Software Engineering, B.S.',
  school: 'Brigham Young University-Idaho',
  dates: 'Sept 2021 - Dec 2026',
  location: 'Rexburg, ID',
  depth: 'Studied software design across six terms.',
}
