import { useState } from 'react'
import useDocTitle from '../hooks/useDocTitle'
import useMetaDescription from '../hooks/useMetaDescription'
import { email, github, linkedin } from '../data/contact'

export default function ContactPage() {
  useDocTitle('Contact')
  useMetaDescription('Get in touch with Bradley Hunter via email, GitHub, LinkedIn, or a direct message.')
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const res = await fetch('https://formspree.io/f/mreanynn', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(e.target),
    })
    if (res.ok) {
      setStatus('success')
      e.target.reset()
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white dark:text-white mb-4">Get in Touch</h1>
      <p className="text-gray-200 dark:text-gray-300 leading-relaxed mb-10">
        I'm always open to discussing new opportunities, interesting projects, or just connecting.
        Feel free to reach out through any of the channels below.
      </p>

      <div className="lg:grid lg:grid-cols-2 lg:gap-10">
        {/* Contact cards */}
        <div className="space-y-4">
          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-500 dark:border-gray-800 hover:border-primary dark:hover:border-primary-dark transition-colors group"
          >
            <div className="p-3 rounded-lg bg-gray-500 dark:bg-gray-800 text-gray-200 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white dark:text-white">Email</p>
              <p className="text-sm text-gray-300 dark:text-gray-400">{email}</p>
            </div>
          </a>

          {/* GitHub */}
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-500 dark:border-gray-800 hover:border-primary dark:hover:border-primary-dark transition-colors group"
          >
            <div className="p-3 rounded-lg bg-gray-500 dark:bg-gray-800 text-gray-200 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white dark:text-white">GitHub</p>
              <p className="text-sm text-gray-300 dark:text-gray-400">Bradley-Hunter</p>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-500 dark:border-gray-800 hover:border-primary dark:hover:border-primary-dark transition-colors group"
          >
            <div className="p-3 rounded-lg bg-gray-500 dark:bg-gray-800 text-gray-200 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white dark:text-white">LinkedIn</p>
              <p className="text-sm text-gray-300 dark:text-gray-400">bradley-hunter</p>
            </div>
          </a>
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-10 lg:mt-0">
          <h2 className="text-xl font-semibold text-white dark:text-white mb-6">Send a Message</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 rounded-lg bg-gray-500 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary dark:focus:border-primary-dark transition-colors text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 rounded-lg bg-gray-500 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary dark:focus:border-primary-dark transition-colors text-sm"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-1">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full px-3 py-2 rounded-lg bg-gray-500 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary dark:focus:border-primary-dark transition-colors text-sm resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending' || status === 'success'}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-primary dark:bg-primary-dark text-gray-900 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
            {status === 'success' && (
              <p className="text-sm text-green-400">Message sent! I'll get back to you soon.</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
