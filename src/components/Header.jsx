import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'
import ProjectDropdown from './ProjectDropdown'
import projects from '../data/projects'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
  { to: '/resume', label: 'Resume' },
]

const navCls = ({ isActive }, block = false) =>
  `${block ? 'block ' : ''}px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-700 dark:hover:bg-gray-800 ${isActive ? 'text-primary dark:text-primary-dark' : 'text-gray-200 dark:text-gray-300'}`

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)

  const closeMobile = () => {
    setMobileOpen(false)
    setProjectsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-600 dark:border-gray-800 bg-gray-900/90 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" viewTransition className="text-xl font-bold text-white hover:text-primary dark:hover:text-primary-dark transition-colors">
            Bradley Hunter
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navLinks.slice(0, 1).map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} viewTransition className={navCls}>
                {label}
              </NavLink>
            ))}
            <ProjectDropdown />
            {navLinks.slice(1).map(({ to, label }) => (
              <NavLink key={to} to={to} viewTransition className={navCls}>
                {label}
              </NavLink>
            ))}
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
              className="p-2 rounded-lg text-gray-200 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
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
      <div className={`md:hidden grid transition-[grid-template-rows] duration-200 ease-out ${mobileOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="border-t border-gray-700 dark:border-gray-800 bg-gray-900 dark:bg-gray-950 px-4 py-3 space-y-1">
            {/* Home */}
            <NavLink to="/" end viewTransition onClick={closeMobile} className={(s) => navCls(s, true)}>
              Home
            </NavLink>

            {/* Projects with expand/collapse */}
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              aria-expanded={projectsOpen}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-200 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
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

            {/* Remaining nav links */}
            {navLinks.slice(1).map(({ to, label }) => (
              <NavLink key={to} to={to} viewTransition onClick={closeMobile} className={(s) => navCls(s, true)}>
                {label}
              </NavLink>
            ))}

            {/* Projects submenu */}
            <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${projectsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className="pl-3 space-y-1 pt-1">
                  <Link
                    to="/projects"
                    viewTransition
                    onClick={closeMobile}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                  >
                    All Projects
                  </Link>
                  {projects.filter((p) => !p.archived).map((project) => (
                    <Link
                      key={project.slug}
                      to={`/projects/${project.slug}`}
                      viewTransition
                      onClick={closeMobile}
                      className="block px-3 py-1.5 rounded-lg text-sm text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                    >
                      {project.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
