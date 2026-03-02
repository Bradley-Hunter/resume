import { useParams, Link } from 'react-router-dom'
import projects from '../data/projects'
import CodeBlock from '../components/CodeBlock'
import ToolBadge from '../components/ToolBadge'
import useDocTitle from '../hooks/useDocTitle'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)
  useDocTitle(project?.title ?? 'Project Not Found')

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white dark:text-white mb-4">Project not found</h1>
        <Link to="/projects" className="text-primary dark:text-primary-dark hover:underline">
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/projects" className="text-sm text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors mb-6 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Projects
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold text-white dark:text-white mt-4 mb-4">
        {project.title}
      </h1>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {project.tools.map((tool) => (
          <ToolBadge key={tool} name={tool} />
        ))}
      </div>

      <p className="text-gray-200 dark:text-gray-300 leading-relaxed mb-8">
        {project.description}
      </p>

      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity mb-8"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          View on GitHub
        </a>
      )}

      {/* Media */}
      {project.media && (
        <div className="mb-8">
          {project.media.type === 'youtube' && (
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${project.media.id}`}
                title={`${project.title} demo`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
          {project.media.type === 'video' && (
            <video controls className="w-full rounded-xl">
              <source src={`${import.meta.env.BASE_URL}${project.media.src}`} type="video/mp4" />
            </video>
          )}
          {project.media.type === 'image' && (
            <img
              src={`${import.meta.env.BASE_URL}${project.media.src}`}
              alt={project.title}
              className="w-full rounded-xl"
            />
          )}
        </div>
      )}

      {/* Code Files */}
      {project.files.length > 0 && (() => {
        const hasGroups = project.files.some((f) => f.group)
        if (hasGroups) {
          const groups = []
          const seen = new Set()
          for (const file of project.files) {
            if (!seen.has(file.group)) {
              seen.add(file.group)
              groups.push(file.group)
            }
          }
          return (
            <div>
              <h2 className="text-xl font-bold text-white dark:text-white mb-4">Source Code</h2>
              <div className="space-y-8">
                {groups.map((group) => (
                  <div key={group}>
                    <div className="flex items-center justify-between mb-3 border-b border-gray-400 dark:border-gray-700 pb-2">
                      <h3 className="text-lg font-semibold text-gray-200 dark:text-gray-200">
                        {group}
                      </h3>
                      {project.groupLinks?.[group] && (
                        <a
                          href={project.groupLinks[group]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                    <div className="space-y-3">
                      {project.files
                        .filter((f) => f.group === group)
                        .map((file) => (
                          <CodeBlock key={file.name} name={file.name} language={file.language} code={file.code} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
        return (
          <div>
            <h2 className="text-xl font-bold text-white dark:text-white mb-4">Source Code</h2>
            <div className="space-y-3">
              {project.files.map((file) => (
                <CodeBlock key={file.name} name={file.name} language={file.language} code={file.code} />
              ))}
            </div>
          </div>
        )
      })()}

      {project.files.length === 0 && !project.github && (
        <p className="text-gray-300 dark:text-gray-400 italic">
          Code samples for this project are not yet available online.
        </p>
      )}
    </div>
  )
}
