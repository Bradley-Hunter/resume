import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects'

export default function ProjectsHub() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-10">
        A collection of software projects spanning multiple languages and frameworks.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
