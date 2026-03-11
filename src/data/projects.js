// Auto-discovers all .js files in ./projects/ folder.
// Each file exports a default project object with at minimum:
//   slug, title, order, description, tools, files

const modules = import.meta.glob('./projects/*.js', { import: 'default', eager: true })

const projects = Object.values(modules)
  .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.slug.localeCompare(b.slug))

export default projects
