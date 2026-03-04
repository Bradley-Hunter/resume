import { useState, useRef, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import projects from '../data/projects'

export default function ProjectDropdown() {
  const [open, setOpen] = useState(false)
  const itemRefs = useRef([])
  const triggerRef = useRef(null)
  const navigate = useNavigate()
  let timeout = useRef(null)

  const openMenu = useCallback(() => {
    clearTimeout(timeout.current)
    setOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const handleMouseEnter = () => {
    clearTimeout(timeout.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150)
  }

  function handleTriggerKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (open) {
        closeMenu()
      } else {
        openMenu()
        setTimeout(() => itemRefs.current[0]?.focus(), 0)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      openMenu()
      setTimeout(() => itemRefs.current[0]?.focus(), 0)
    } else if (e.key === 'Escape') {
      closeMenu()
    }
  }

  function handleItemKeyDown(e, index) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      itemRefs.current[index + 1]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (index === 0) {
        triggerRef.current?.focus()
      } else {
        itemRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'Escape') {
      closeMenu()
      triggerRef.current?.focus()
    } else if (e.key === 'Tab') {
      closeMenu()
    }
  }

  function handleBlur(e) {
    // Close if focus moves outside the entire dropdown container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      closeMenu()
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
    >
      <NavLink
        ref={triggerRef}
        to="/projects"
        viewTransition
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-500 dark:hover:bg-gray-800 inline-flex items-center gap-1 ${isActive ? 'text-primary dark:text-primary-dark' : 'text-gray-200 dark:text-gray-300'}`}
      >
        Projects
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </NavLink>

      {open && (
        <div role="menu" className="absolute top-full left-0 mt-1 w-64 py-2 bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
          {projects.map((project, i) => (
            <NavLink
              key={project.slug}
              ref={(el) => (itemRefs.current[i] = el)}
              to={`/projects/${project.slug}`}
              role="menuitem"
              viewTransition
              onClick={() => closeMenu()}
              onKeyDown={(e) => handleItemKeyDown(e, i)}
              className={({ isActive }) => `block px-4 py-2 text-sm transition-colors hover:bg-gray-700 ${isActive ? 'text-primary dark:text-primary-dark font-medium' : 'text-gray-200 dark:text-gray-300'}`}
            >
              {project.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
