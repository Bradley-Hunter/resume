import { Link } from 'react-router-dom'
import ToolBadge from './ToolBadge'

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary dark:hover:border-primary-dark hover:shadow-lg transition-all duration-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
        {project.title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tools.slice(0, 5).map((tool) => (
          <ToolBadge key={tool} name={tool} />
        ))}
        {project.tools.length > 5 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
            +{project.tools.length - 5} more
          </span>
        )}
      </div>
    </Link>
  )
}
