import { listProgramFiles } from '../code/list-program'

export default {
  slug: 'list-program',
  title: 'List Program',
  order: 4,
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
}
