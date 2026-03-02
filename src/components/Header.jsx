import { useState } from 'react'
import { Link } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'
import ProjectDropdown from './ProjectDropdown'
import projects from '../data/projects'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)

  const closeMobile = () => {
    setMobileOpen(false)
    setProjectsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-600 dark:border-gray-800 bg-gray-600/90 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-white hover:text-primary dark:hover:text-primary-dark transition-colors">
            Bradley Hunter
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-200 dark:text-gray-300 hover:bg-gray-500 dark:hover:bg-gray-800 transition-colors"
            >
              Home
            </Link>
            <ProjectDropdown />
            <DarkModeToggle />
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <DarkModeToggle />
            <button
              onClick={() => {
                setMobileOpen(!mobileOpen)
                if (mobileOpen) setProjectsOpen(false)
              }}
              className="p-2 rounded-lg text-gray-200 dark:text-gray-300 hover:bg-gray-500 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-600 dark:border-gray-800 bg-gray-600 dark:bg-gray-950 px-4 py-3 space-y-1">
          <Link
            to="/"
            onClick={closeMobile}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-200 dark:text-gray-300 hover:bg-gray-500 dark:hover:bg-gray-800 transition-colors"
          >
            Home
          </Link>

          {/* Projects with expand/collapse */}
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-200 dark:text-gray-300 hover:bg-gray-500 dark:hover:bg-gray-800 transition-colors"
          >
            Projects
            <svg
              className={`w-4 h-4 transition-transform ${projectsOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {projectsOpen && (
            <div className="pl-3 space-y-1">
              <Link
                to="/projects"
                onClick={closeMobile}
                className="block px-3 py-2 rounded-lg text-sm text-gray-300 dark:text-gray-400 hover:bg-gray-500 dark:hover:bg-gray-800 transition-colors"
              >
                All Projects
              </Link>
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  onClick={closeMobile}
                  className="block px-3 py-1.5 rounded-lg text-sm text-gray-300 dark:text-gray-400 hover:bg-gray-500 dark:hover:bg-gray-800 transition-colors"
                >
                  {project.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
