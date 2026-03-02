import { listProgramFiles } from './code/list-program'
import { canvasApiFiles } from './code/canvas-api'
import { pythonProjectFiles } from './code/python-projects'

const projects = [
  {
    slug: 'vellum',
    title: 'Vellum Web Browser',
    description: 'A feature-rich tabbed web browser desktop application with workspace management, tiling split panes for simultaneous multi-site viewing, a built-in text editor, bookmarks with folders, searchable browsing history, and automatic session persistence, all backed by a local SQLite database.',
    tools: ['TypeScript', 'React', 'Electron', 'Vite', 'Tailwind CSS', 'Zustand', 'SQLite', 'Vitest', 'React Testing Library', 'ESLint', 'Claude Code'],
    github: 'https://github.com/Bradley-Hunter/vellum-releases',
    files: [],
    media: null,
  },
  {
    slug: 'canvas-api',
    title: 'Canvas by Instructure API App',
    description: 'A desktop application that interacts with the API for Canvas by Instructure. Uses Rust for the backend with Tauri for the desktop framework, and JavaScript/HTML/CSS for the frontend.',
    tools: ['Rust', 'serde', 'reqwest', 'Tauri', 'HTML', 'CSS', 'JavaScript'],
    github: null,
    files: canvasApiFiles,
    media: { type: 'youtube', id: 'NpEaa2P7qZI' },
  },
  {
    slug: 'list-program',
    title: 'List Program',
    description: 'Three separate terminal-based programs, each built from scratch in a different language (Java, C++, and Rust), that allow one to keep and store multiple lists of items. Each implementation demonstrates proficiency in the syntax and idioms of its respective language.',
    tools: ['Rust', 'Java', 'C++', 'JSON'],
    github: null,
    groupLinks: {
      'Java': 'https://github.com/Bradley-Hunter/ListOfListsJava',
      'C++': 'https://github.com/Bradley-Hunter/ListOfListsCPP',
      'Rust': 'https://github.com/Bradley-Hunter/ListOfListsRust',
    },
    files: listProgramFiles,
    media: { type: 'youtube', id: '0oIDNygpOJM' },
  },
  {
    slug: 'derivative-calc',
    title: 'Derivative Calculator',
    description: 'A GUI-based calculator that computes the derivative of a given equation, graphs it, and can compute the derivative at a given point.',
    tools: ['Python', 'ctypes', 'tkinter', 'matplotlib', 'numpy', 'pyparsing'],
    github: null,
    files: [],
    media: null,
  },
  {
    slug: 'gpib',
    title: 'GPIB Hello World',
    description: 'A basic program that can find all GPIB devices connected on the bus. Program is also capable of displaying the identification for a specified device.',
    tools: ['Rust', 'visa-rs', 'NI-VISA', 'NI-488.2'],
    github: null,
    files: [],
    media: null,
  },
  {
    slug: 'batch-installer',
    title: 'Installation Batch File',
    description: 'A Windows batch file to allow one to quickly install all the programs needed for running Intel\'s Voltage Regulator Test Suite as required by the company Infineon Technologies AG. The installed version of Python is installed alongside the needed libraries.',
    tools: ['Batch', 'Python'],
    github: null,
    files: [],
    media: null,
  },
  {
    slug: 'linked-list',
    title: 'Basic Linked List',
    description: 'A singly Linked List implemented in C with functionality to add and remove items from the list.',
    tools: ['C', 'stdio.h', 'string.h', 'stdlib.h', 'stdbool.h'],
    github: null,
    files: [],
    media: null,
  },
  {
    slug: 'python-projects',
    title: 'Python Projects',
    description: 'A collection of Python programs developed for the CSE 130 Algorithm Design class at Brigham Young University-Idaho, including a sort algorithm and a Francois number sequence generator.',
    tools: ['Python', 'JSON'],
    github: null,
    files: pythonProjectFiles,
    media: null,
  },
]

export default projects
