import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import DevStylePanel from './DevStylePanel'
import ErrorBoundary from './ErrorBoundary'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:bg-primary focus:text-gray-900"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 animate-page">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      {import.meta.env.DEV && <DevStylePanel />}
    </div>
  )
}
