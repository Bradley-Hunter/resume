import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProjectsHub from './pages/ProjectsHub'
import ProjectPage from './pages/ProjectPage'
import ContactPage from './pages/ContactPage'
import ResumePage from './pages/ResumePage'
import BlogHub from './pages/BlogHub'
import BlogPost from './pages/BlogPost'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsHub />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/blog" element={<BlogHub />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
