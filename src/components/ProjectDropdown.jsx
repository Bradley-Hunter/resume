import { useState } from 'react'
import { Link } from 'react-router-dom'
import projects from '../data/projects'

export default function ProjectDropdown() {
  const [open, setOpen] = useState(false)
  let timeout

  const handleEnter = () => {
    clearTimeout(timeout)
    setOpen(true)
  }

  const handleLeave = () => {
    timeout = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        to="/projects"
        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-200 dark:text-gray-300 hover:bg-gray-500 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-1"
      >
        Projects
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 py-2 bg-gray-700 dark:bg-gray-900 border border-gray-600 dark:border-gray-700 rounded-xl shadow-lg">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-200 dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-gray-800 transition-colors"
            >
              {project.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
