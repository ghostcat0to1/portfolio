import { Link } from 'react-router-dom'
import HMSymbol from './HMSymbol'

export default function Nav({ theme, onToggleTheme }) {
  const isLight = theme === 'light'
  const border  = isLight ? 'rgba(212,137,30,0.2)' : 'rgba(212,137,30,0.08)'
  const bg      = isLight ? 'rgba(245,240,230,0.95)' : 'rgba(7,8,13,0.92)'
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 40px',
      background: bg,
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `0.5px solid ${border}`,
      transition: 'background 0.4s ease',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <HMSymbol size={44} theme={isLight ? 'light' : 'dark'} />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={onToggleTheme} style={{
          background: 'transparent',
          border: `1px solid ${isLight ? 'rgba(212,137,30,0.35)' : 'rgba(212,137,30,0.25)'}`,
          borderRadius: '2px', padding: '6px 14px', cursor: 'pointer',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
          letterSpacing: '0.15em', color: '#D4891E', opacity: 0.8,
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
        >
          {isLight ? '◑ Dark' : '◑ Light'}
        </button>
      </div>
    </nav>
  )
}
