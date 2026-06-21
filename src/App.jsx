import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Portfolio from './pages/Portfolio'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  return (
    <BrowserRouter>
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Portfolio theme={theme} />} />
      </Routes>
    </BrowserRouter>
  )
}
