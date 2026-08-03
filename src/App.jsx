import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Nav from './components/Nav'
import Portfolio from './pages/Portfolio'
import NotFound from './pages/NotFound'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  return (
    <BrowserRouter>
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Portfolio theme={theme} />} />
        <Route path="*" element={<NotFound theme={theme} />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}
