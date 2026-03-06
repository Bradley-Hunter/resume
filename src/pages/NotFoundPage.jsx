import { Link } from 'react-router-dom'
import useDocTitle from '../hooks/useDocTitle'

export default function NotFoundPage() {
  useDocTitle('404')
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="text-6xl font-bold text-primary dark:text-primary-dark mb-4">404</p>
      <h1 className="text-2xl font-semibold text-white mb-2">Page not found</h1>
      <p className="text-gray-300 mb-8">That route doesn&apos;t exist.</p>
      <Link
        to="/"
        className="inline-block px-6 py-3 rounded-lg bg-primary dark:bg-primary-dark text-gray-900 font-medium hover:opacity-90 transition-opacity"
      >
        Go home
      </Link>
    </div>
  )
}
