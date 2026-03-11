import { canvasApiFiles } from '../code/canvas-api'

export default {
  slug: 'canvas-api',
  title: 'Canvas by Instructure API App',
  order: 3,
  description: 'A desktop application that interacts with the API for Canvas by Instructure. Uses Rust for the backend with Tauri for the desktop framework, and JavaScript/HTML/CSS for the frontend.',
  tools: ['Rust', 'serde', 'reqwest', 'Tauri', 'HTML', 'CSS', 'JavaScript'],
  github: null,
  files: canvasApiFiles,
  media: { type: 'youtube', id: 'NpEaa2P7qZI' },
}
