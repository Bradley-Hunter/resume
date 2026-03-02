import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects'
import useDocTitle from '../hooks/useDocTitle'

export default function ProjectsHub() {
  useDocTitle('Projects')
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white dark:text-white mb-2">Projects</h1>
      <p className="text-gray-300 dark:text-gray-400 mb-10">
        A collection of software projects spanning multiple languages and frameworks.
      </p>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300 dark:text-gray-500 mb-4">
            Featured
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} featured />
            ))}
          </div>
        </div>
      )}

      {/* All other projects */}
      <div>
        {featured.length > 0 && (
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300 dark:text-gray-500 mb-4">
            All Projects
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
