import { Link } from 'react-router-dom'

export default function NotFound({ theme = 'dark' }) {
  const isLight = theme === 'light'
  const bg           = isLight ? '#F5F0E6' : '#07080D'
  const headingColor = isLight ? '#1A0E04' : '#F0E8D8'
  const bodyColor    = isLight ? '#2A1A08' : '#B0A888'

  return (
    <div style={{
      background: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px',
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.4em', color: '#D4891E', textTransform: 'uppercase', marginBottom: '28px', opacity: 0.8 }}>
        404
      </div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 200, fontStyle: 'italic', color: headingColor, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px' }}>
        Nothing to<br /><span style={{ color: '#D4891E' }}>see here.</span>
      </h1>
      <p style={{ fontFamily: "'Lora', serif", fontSize: '16px', fontStyle: 'italic', color: bodyColor, maxWidth: '420px', lineHeight: 1.7, marginBottom: '44px' }}>
        The page you're looking for doesn't exist, or has moved.
      </p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 32px', border: '1px solid rgba(212,137,30,0.4)', color: '#D4891E', fontFamily: "'Syne', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: '1px', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,137,30,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
          Back home
        </div>
      </Link>
    </div>
  )
}
