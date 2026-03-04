// Auto-discovers all .md files in ./blog/ folder.
// Each file must begin with YAML frontmatter:
//   ---
//   title: Post Title
//   date: 2026-03-04
//   description: Short summary shown on listing page.
//   draft: true   ← optional, omit or set false to publish
//   ---

const modules = import.meta.glob('./blog/*.md', { query: '?raw', import: 'default', eager: true })

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: '2-digit',
  })
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/m)
  if (!match) return { meta: {}, content: raw }

  const meta = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim()
    meta[key] = value === 'true' ? true : value === 'false' ? false : value
  }
  return { meta, content: match[2] }
}

const parsed = Object.entries(modules)
  .map(([path, raw]) => {
    const filename = path.replace('./blog/', '').replace('.md', '')
    const { meta, content } = parseFrontmatter(raw)
    return {
      slug: meta.slug || filename,
      title: meta.title || filename,
      date: meta.date || '',
      description: meta.description || '',
      tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      draft: meta.draft || false,
      featured: meta.featured || false,
      content,
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .map((p) => ({ ...p, date: formatDate(p.date) }))

export const allPosts = parsed
const posts = parsed.filter((p) => !p.draft)
export default posts
