import { Link } from 'react-router-dom'
import Section from '../components/Section'
import JobEntry from '../components/JobEntry'
import ToolBadge from '../components/ToolBadge'
import { about, skills, employment, education } from '../data/resume'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white dark:text-white mb-4">
          Bradley Hunter
        </h1>
        <p className="text-lg text-gray-300 dark:text-gray-400 mb-6">
          Software Engineering Student
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <a href="mailto:bradleyhunter2021@gmail.com" className="text-primary dark:text-primary-dark hover:underline">
            bradleyhunter2021@gmail.com
          </a>
          <span className="text-gray-400">|</span>
          <a href="https://github.com/Bradley-Hunter" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary-dark hover:underline">
            GitHub
          </a>
          <span className="text-gray-400">|</span>
          <a href="https://www.linkedin.com/in/bradley-hunter-68ab9a218/" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary-dark hover:underline">
            LinkedIn
          </a>
        </div>
      </div>

      {/* About */}
      <Section title="About">
        <p className="text-gray-200 dark:text-gray-300 leading-relaxed">{about}</p>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="space-y-3">
          <div>
            <span className="text-sm font-semibold text-white dark:text-white">Proficient: </span>
            <span className="inline-flex flex-wrap gap-1.5 ml-1">
              {skills.proficient.map((s) => <ToolBadge key={s} name={s} />)}
            </span>
          </div>
          <div>
            <span className="text-sm font-semibold text-white dark:text-white">Familiar: </span>
            <span className="inline-flex flex-wrap gap-1.5 ml-1">
              {skills.familiar.map((s) => <ToolBadge key={s} name={s} />)}
            </span>
          </div>
        </div>
      </Section>

      {/* Employment */}
      <Section title="Employment">
        {employment.map((job, i) => (
          <JobEntry key={i} {...job} />
        ))}
      </Section>

      {/* Education */}
      <Section title="Education">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
          <div>
            <h3 className="font-semibold text-white dark:text-white">{education.degree}</h3>
            <p className="text-gray-300 dark:text-gray-400 italic">{education.school}</p>
            <p className="text-sm text-gray-300 dark:text-gray-400 mt-1">Emphasis: {education.emphasis}</p>
          </div>
          <div className="text-sm text-gray-300 dark:text-gray-400 sm:text-right shrink-0">
            <p>{education.dates}</p>
            <p>{education.location}</p>
          </div>
        </div>
      </Section>

      {/* Projects CTA */}
      <div className="text-center mt-12 pt-8 border-t border-gray-400 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-white dark:text-white mb-4">Want to see my work?</h2>
        <Link
          to="/projects"
          className="inline-block px-6 py-3 rounded-lg bg-primary dark:bg-primary-dark text-white font-medium hover:opacity-90 transition-opacity"
        >
          View Projects
        </Link>
      </div>
    </div>
  )
}
