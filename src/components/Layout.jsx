import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import AnimatedPage from './AnimatedPage'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <AnimatedPage key={location.pathname}>
            <Outlet />
          </AnimatedPage>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
