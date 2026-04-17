// TODO: Add code file imports when created in src/data/code/
// import nibKeyboardHook from '../code/nib-keyboard-hook?raw'
// import nibDetection from '../code/nib-detection?raw'
// import nibPaste from '../code/nib-paste?raw'
// import nibMonitor from '../code/nib-monitor?raw'
// import { nibCode } from "../code/nib-code"

export default {
  slug: 'nib',
  title: 'Nib — Clipboard Manager',
  order: 1,
  featured: false,
  date: 'Mar 2026',
  description:
    'A context-aware clipboard manager for Windows that replaces the built-in Win+V history. Nib remembers where you copied something and filters clips by the app you\'re pasting into. It stores all clipboard formats and supports pinned clips, pinned apps, and keyboard navigation.',
  tools: ['Rust', 'egui', 'Win32 API', 'SQLite', 'Inno Setup'],
  github: 'https://github.com/Bradley-Hunter/nib-releases',
  githubNote: 'Source code is private. Links to public releases.',
  media: { type: 'image', src: '/nib-screenshot.png' },
  //files: nibCode,
}
