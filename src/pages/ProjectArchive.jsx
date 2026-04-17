import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects'
import useDocTitle from '../hooks/useDocTitle'
import useMetaDescription from '../hooks/useMetaDescription'
import useOpenGraph from '../hooks/useOpenGraph'

export default function ProjectArchive() {
  useDocTitle('Project Archive')
  useMetaDescription('Older projects and smaller experiments by Bradley Hunter.')
  useOpenGraph({ title: 'Project Archive', description: 'Older projects and smaller experiments by Bradley Hunter.', url: '#/projects/archive' })
  const archived = projects.filter((p) => p.archived)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/projects"
        viewTransition
        className="text-sm text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary-dark transition-colors"
      >
        &larr; Back to Projects
      </Link>
      <h1 className="text-4xl font-bold text-white dark:text-white mt-4 mb-2">Project Archive</h1>
      <p className="text-gray-300 dark:text-gray-400 mb-10">
        Older projects and smaller experiments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archived.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
