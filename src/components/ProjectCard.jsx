import { Link } from 'react-router-dom'
import ToolBadge from './ToolBadge'

export default function ProjectCard({ project, featured }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`group block rounded-xl border transition-all duration-200 hover:shadow-lg ${
        featured
          ? 'p-8 border-cyan-300/50 dark:border-primary-dark/40 bg-gray-400 dark:bg-gray-900 hover:border-cyan-300 dark:hover:border-primary-dark ring-1 ring-cyan-300/15 dark:ring-primary-dark/10'
          : 'p-6 border-gray-600 dark:border-gray-800 bg-gray-400 dark:bg-gray-900 hover:border-primary dark:hover:border-primary-dark'
      }`}
    >
      {featured && (
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-300 dark:text-primary-dark mb-2">
          Featured
        </span>
      )}
      <h3 className={`font-semibold text-white dark:text-white group-hover:text-cyan-300 dark:group-hover:text-primary-dark transition-colors ${
        featured ? 'text-xl' : 'text-lg'
      }`}>
        {project.title}
      </h3>
      <p className={`mt-2 text-gray-200 dark:text-gray-400 ${
        featured ? 'text-sm' : 'text-sm line-clamp-3'
      }`}>
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tools.slice(0, featured ? 8 : 5).map((tool) => (
          <ToolBadge key={tool} name={tool} />
        ))}
        {project.tools.length > (featured ? 8 : 5) && (
          <span className="text-xs text-gray-300 dark:text-gray-400 self-center">
            +{project.tools.length - (featured ? 8 : 5)} more
          </span>
        )}
      </div>
    </Link>
  )
}
