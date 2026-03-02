import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProjectsHub from './pages/ProjectsHub'
import ProjectPage from './pages/ProjectPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsHub />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
