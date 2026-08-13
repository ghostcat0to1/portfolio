import { Link } from 'react-router-dom'

const YEAR = new Date().getFullYear()

const linkStyle = (color) => ({
  color,
  textDecoration: 'none',
  borderBottom: `1px solid ${color}55`,
})

export function LegalShell({ theme = 'dark', title, lastUpdated, children }) {
  const isLight = theme === 'light'
  const bg = isLight ? '#F5F0E6' : '#07080D'
  const heading = isLight ? '#1A0E04' : '#F0E8D8'
  const body = isLight ? '#2A1A08' : '#B0A888'
  const muted = isLight ? '#8A6A30' : '#8A8070'
  const divider = isLight ? 'rgba(212,137,30,0.2)' : 'rgba(255,255,255,0.06)'
  const accent = '#D4891E'

  return (
    <div style={{ background: bg, minHeight: '100vh', color: body, transition: 'background 0.4s ease' }}>
      <article style={{
        position: 'relative', zIndex: 5, maxWidth: '720px', margin: '0 auto',
        padding: '120px 24px 56px', textAlign: 'left',
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.4em', color: accent, textTransform: 'uppercase', marginBottom: '20px' }}>
          Legal
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 200,
          fontStyle: 'italic', color: heading, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px',
        }}>
          {title}
        </h1>
        {lastUpdated ? (
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: muted, letterSpacing: '0.08em', marginBottom: '40px' }}>
            {lastUpdated}
          </p>
        ) : (
          <div style={{ marginBottom: '40px' }} />
        )}

        <div style={{
          fontFamily: "'Lora', serif", fontSize: '15px', lineHeight: 1.8, color: body,
          display: 'flex', flexDirection: 'column', gap: '28px',
        }}>
          {children}
        </div>

        <div style={{
          marginTop: '48px', paddingTop: '24px', borderTop: `1px solid ${divider}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" style={linkStyle(accent)}>Home</Link>
            <Link to="/privacy" style={linkStyle(accent)}>Privacy</Link>
            <Link to="/terms" style={linkStyle(accent)}>Terms</Link>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: muted, letterSpacing: '0.18em', lineHeight: 1.7 }}>
            © {YEAR} Henrique Moreira · All rights reserved
            <br />
            Espoo, Finland · Personal site
          </div>
        </div>
      </article>
    </div>
  )
}

export function LegalH2({ children }) {
  return (
    <h2 style={{
      fontFamily: "'Syne', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: '#D4891E', margin: '8px 0 0',
    }}>
      {children}
    </h2>
  )
}

export function LegalP({ children }) {
  return <p style={{ margin: 0 }}>{children}</p>
}

export function LegalUl({ children }) {
  return (
    <ul style={{ margin: 0, paddingLeft: '1.2em', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {children}
    </ul>
  )
}
