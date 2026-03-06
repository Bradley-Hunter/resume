import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <p className="text-5xl mb-6">⚠</p>
          <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            This page ran into an unexpected error. The rest of the site is fine.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => this.setState({ error: null })}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors border border-gray-600"
            >
              Try again
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-primary dark:text-primary-dark border border-primary dark:border-primary-dark hover:bg-primary/10 transition-colors"
            >
              Go home
            </Link>
          </div>
          {import.meta.env.DEV && (
            <pre className="mt-10 text-left text-xs text-red-400 bg-gray-900 rounded-xl p-4 overflow-auto border border-red-900/50">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
