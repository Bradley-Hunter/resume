import useMetaDescription from '../hooks/useMetaDescription'
import useOpenGraph from '../hooks/useOpenGraph'
import { resumeAbout, skills, employment, employmentAdditional, education, projects } from '../data/resume'
import { phone, email, github, linkedin } from '../data/contact'

export default function ResumePage() {
  useMetaDescription('Resume of Bradley Hunter — Software Engineering student at BYU-Idaho, graduating Dec 2026. Proficient in Rust, TypeScript, and C++.')
  useOpenGraph({ title: 'Resume', description: 'Resume of Bradley Hunter — Software Engineering student at BYU-Idaho, graduating Dec 2026. Proficient in Rust, TypeScript, and C++.', url: '#/resume' })
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 print:p-0 print:max-w-none animate-page">
      {/* Print button — hidden when printing */}
      <div className="flex justify-end mb-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors border border-gray-600 dark:border-gray-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      {/* Resume content */}
      <div className="resume-card bg-white text-gray-900 rounded-xl p-8 sm:p-10 shadow-lg print:shadow-none print:rounded-none print:p-0">

        {/* Header */}
        <div className="resume-section border-b-2 border-gray-800 pb-3 mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">linkedin.com/in/bradley-hunter-68ab9a218</a>
            <a href={`mailto:${email}`} className="hover:text-gray-800">{email}</a>
          </div>
          <div className="grid grid-cols-3 items-baseline">
            <div />
            <h1 className="text-3xl font-bold tracking-tight text-center">Bradley Hunter</h1>
            <span className="text-sm text-gray-600 text-right">{phone}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">www.github.com/Bradley-Hunter</a>
            <a href="https://bradley-hunter.github.io/resume/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">bradley-hunter.github.io/resume/</a>
          </div>
        </div>

        {/* Summary — no header */}
        <section className="resume-section mb-5">
          <p className="text-sm leading-relaxed text-gray-800">{resumeAbout}</p>
        </section>

        {/* Education */}
        <section className="resume-section mb-5">
          <h2 className="text-sm font-bold border-b border-gray-400 mb-2">Education</h2>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
            <span className="text-gray-600">{education.location}</span>
            <span className="font-bold">{education.school}</span>
            <span className="text-gray-600">{education.dates}</span>
          </div>
          <div className="mt-1 space-y-0.5 text-sm pl-4">
            <p><span className="font-semibold">Major:</span> {education.degree}</p>
            {education.depth && <p>{education.depth}</p>}
          </div>
        </section>

        {/* Skills */}
        <section className="resume-section mb-5">
          <h2 className="text-sm font-bold border-b border-gray-400 mb-2">Skills</h2>
          <div className="text-sm text-gray-800 space-y-0.5 pl-4">
            <p>
              <span className="font-semibold">Languages </span>
              <span className="italic">({skills.languagesNote})</span>: {skills.languages}
            </p>
            <p>
              <span className="font-semibold">Coursework exposure: </span>
              {skills.courseworkExposure}
            </p>
          </div>
        </section>

        {/* Employment */}
        <section className="resume-section mb-5">
          <h2 className="text-sm font-bold border-b border-gray-400 mb-2">Employment</h2>
          <div className="resume-jobs flex flex-col gap-4">
            {employment.map((job, i) => (
              <div key={i}>
                <div className="resume-job-header flex flex-wrap items-baseline justify-between gap-x-2 text-sm font-bold">
                  <span>{job.title}</span>
                  <span>{job.company}</span>
                  <span>{job.dates}</span>
                </div>
                <ul className="resume-duties mt-0.5 flex flex-col gap-0.5">
                  {job.duties.map((duty, j) => (
                    <li key={j} className="text-sm text-gray-800 flex gap-2 pl-2">
                      <span className="shrink-0">•</span>
                      {duty}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-sm text-gray-600 italic">{employmentAdditional}</p>
          </div>
        </section>

        {/* Software Projects */}
        <section>
          <h2 className="text-sm font-bold border-b border-gray-400 mb-2">Software Projects</h2>
          <div className="resume-projects flex flex-col gap-4">
            {projects.map((project, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm font-bold">
                  <span>{project.name}</span>
                  {project.subtitle && <span>{project.subtitle}</span>}
                  <span>{project.date}</span>
                </div>
                <ul className="mt-0.5 flex flex-col gap-0.5">
                  {project.bullets.map((bullet, j) => (
                    <li key={j} className="text-sm text-gray-800 flex gap-2 pl-2">
                      <span className="shrink-0">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
