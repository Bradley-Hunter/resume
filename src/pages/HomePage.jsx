import { Link } from 'react-router-dom'
import Section from '../components/Section'
import { about, homeSkills, education } from '../data/resume'
import { email, github, linkedin } from '../data/contact'
import useDocTitle from '../hooks/useDocTitle'
import useMetaDescription from '../hooks/useMetaDescription'
import useOpenGraph from '../hooks/useOpenGraph'

export default function HomePage() {
  useDocTitle(null)
  useMetaDescription()
  useOpenGraph()
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white dark:text-white mb-4">
          Bradley Hunter
        </h1>
        <p className="text-lg text-gray-300 dark:text-gray-400 mb-6">
          Software Engineer
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <a href={`mailto:${email}`} className="text-primary dark:text-primary-dark hover:underline">
            {email}
          </a>
          <span className="text-gray-400">|</span>
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary-dark hover:underline">
            GitHub
          </a>
          <span className="text-gray-400">|</span>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary-dark hover:underline">
            LinkedIn
          </a>
        </div>
      </div>

      {/* Projects CTA */}
      <div className="text-center mb-16">
        <p className="text-gray-200 dark:text-gray-300 mb-6">
          I like building tools that people actually use, from clipboard managers to web browsers.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/projects"
            className="inline-block px-6 py-3 rounded-lg bg-primary dark:bg-primary-dark text-gray-900 font-medium hover:opacity-90 transition-opacity"
          >
            View Projects
          </Link>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 rounded-lg border border-gray-400 dark:border-gray-700 text-gray-200 dark:text-gray-300 font-medium hover:border-primary dark:hover:border-primary-dark transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* About */}
      <Section title="About">
        <p className="text-gray-200 dark:text-gray-300 leading-relaxed">{about}</p>
      </Section>

      {/* Education */}
      <Section title="Education">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
          <div>
            <h3 className="font-semibold text-white dark:text-white">{education.degree}</h3>
            <p className="text-gray-300 dark:text-gray-400 italic">{education.school}</p>
            {education.depth && (
              <p className="text-sm text-gray-300 dark:text-gray-400 mt-1">{education.depth}</p>
            )}
          </div>
          <div className="text-sm text-gray-300 dark:text-gray-400 sm:text-right shrink-0">
            <p>{education.dates}</p>
            <p>{education.location}</p>
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {homeSkills.map((skill) => (
            <div
              key={skill.name}
              className="rounded-lg border border-gray-600 dark:border-gray-800 bg-gray-600 dark:bg-gray-900 p-5"
            >
              <h3 className="font-semibold text-white dark:text-white mb-2">{skill.name}</h3>
              <p className="text-sm text-gray-200 dark:text-gray-400 leading-relaxed">{skill.summary}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
