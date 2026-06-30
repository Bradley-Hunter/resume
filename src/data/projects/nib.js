import { nibCode } from "../code/nib-code"

export default {
  slug: 'nib',
  title: 'Nib — Clipboard Manager',
  order: 1,
  featured: false,
  date: 'Mar 2026',
  description:
    "Nib is a clipboard manager for Windows that I built in Rust using egui for the interface and direct Win32 API calls for system integration. The reason I built it was because the built-in Win+V clipboard history in Windows is essentially just a list of everything you've copied recently, with no awareness of what you were doing when you copied it or what you're working on now. I wanted a clipboard that understood context, so Nib intercepts the Win+V shortcut through a low-level keyboard hook and replaces the default history with one that tracks which application every clip came from, preserves all clipboard formats including images and rich text, and stores everything locally in a SQLite database.\n\nThe main technical challenge I ran into was making the context-aware filtering actually work reliably across all Windows applications. The idea is straightforward — when you open Nib, it defaults to showing clips from whatever app you're currently in, so if you're working in VS Code you see your VS Code clips first without having to dig through everything else. To do this I needed to identify the source application for every clipboard event using Win32 process enumeration, which worked well for most apps. Where it got complicated was with UWP applications like Windows Settings and Calculator, because Windows wraps those inside a generic host process called ApplicationFrameHost.exe. A direct process lookup just returns that host name instead of the actual app, so I had to enumerate the child windows of the host process to find the real application hiding underneath.\n\nBeyond the filtering, Nib also detects sensitive content like passwords and API tokens using Shannon entropy analysis instead of relying on pattern matching that would break on edge cases, and those clips automatically expire after a configurable timeout. The app ships as a signed installer with an auto-update system that verifies every download against ed25519 signatures before applying it.", 
  tools: ['Rust', 'egui', 'Win32 API', 'SQLite', 'Inno Setup'],
  github: 'https://github.com/Bradley-Hunter/nib-releases',
  githubNote: 'Source code is private. Links to public releases.',
  media: { type: 'image', src: '/nib-screenshot.png' },
  files: nibCode,
}
