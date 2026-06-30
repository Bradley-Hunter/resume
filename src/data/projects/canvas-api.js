import { canvasApiFiles } from '../code/canvas-api'

// TODO: Rewrite description in the new format:
//   - 2-3 paragraphs covering what you built, what you used, and a challenge
//     you encountered plus how you addressed it.
//   - Do this from the project repo where you have full code context.
export default {
  slug: 'canvas-api',
  title: 'Canvas by Instructure API App',
  order: 3,
  archived: true,
  description: 'A desktop application that interacts with the API for Canvas by Instructure. Uses Rust for the backend with Tauri for the desktop framework, and JavaScript/HTML/CSS for the frontend. Built in 2023 and not updated since — the Canvas API has likely changed since this was written. This was also the first project where I used AI tooling in my development workflow.',
  tools: ['Rust', 'serde', 'reqwest', 'Tauri', 'HTML', 'CSS', 'JavaScript'],
  github: null,
  files: canvasApiFiles,
  media: null,
}
