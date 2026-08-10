import LycaonDemo from '../components/LycaonDemo'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useEffect, useRef, useState } from 'react'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}


function useParticles(canvasRef, isLight, reducedMotion) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = Array.from({ length: 70 }, (_, i) => {
      const tier = i < 6 ? 'alpha' : i < 24 ? 'beta' : 'omega'
      return {
        x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * (tier === 'alpha' ? 0.45 : 0.2),
        vy: (Math.random() - 0.5) * (tier === 'alpha' ? 0.35 : 0.15),
        size: tier === 'alpha' ? Math.random() * 2 + 3.5 : tier === 'beta' ? Math.random() * 1.2 + 1.8 : Math.random() * 0.7 + 0.6,
        opacity: tier === 'alpha' ? 0.85 : tier === 'beta' ? 0.55 : 0.22,
        pulse: Math.random() * Math.PI * 2, tier,
        color: i % 8 === 0 ? 'teal' : 'amber',
      }
    })
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const alphas = particles.filter(p => p.tier === 'alpha')
      const betas  = particles.filter(p => p.tier === 'beta')
      ;[...alphas, ...betas].forEach((a, ai) => {
        ;[...alphas, ...betas].forEach((b, bi) => {
          if (ai >= bi) return
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxD = a.tier === 'alpha' && b.tier === 'alpha' ? 200 : 140
          if (dist < maxD) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(212,137,30,${(isLight ? 0.25 : 0.18) * (1 - dist / maxD)})`
            ctx.lineWidth = a.tier === 'alpha' && b.tier === 'alpha' ? 0.8 : 0.4
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        })
      })
      particles.forEach(p => {
        const pm = p.tier === 'alpha' ? Math.sin(p.pulse) * 0.2 + 0.8 : 1
        const r = p.color === 'teal' ? 30 : 212
        const g = p.color === 'teal' ? 200 : 137
        const b2 = p.color === 'teal' ? 165 : 30
        const opMult = isLight ? 0.5 : 1
        if (p.tier === 'alpha') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5)
          grad.addColorStop(0, `rgba(${r},${g},${b2},${0.25 * opMult})`)
          grad.addColorStop(1, `rgba(${r},${g},${b2},0)`)
          ctx.beginPath(); ctx.fillStyle = grad
          ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2); ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * pm, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b2},${p.opacity * pm * opMult})`
        ctx.fill()
        if (!reducedMotion) {
          p.pulse += 0.02
          p.x += p.vx; p.y += p.vy
          if (p.x < -10) p.x = canvas.width + 10
          if (p.x > canvas.width + 10) p.x = -10
          if (p.y < -10) p.y = canvas.height + 10
          if (p.y > canvas.height + 10) p.y = -10
        }
      })
      if (!reducedMotion) animId = requestAnimationFrame(draw)
    }
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; draw() }
    resize()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [canvasRef, isLight, reducedMotion])
}

function useScrollReveal(ref, options = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          el.style.filter = 'blur(0px)'
          observer.disconnect()
        }
      },
      { threshold: options.threshold || 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, options.threshold])
}

function RevealWrapper({ children, delay = 0 }) {
  const ref = useRef(null)
  useScrollReveal(ref)
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(36px)',
        filter: 'blur(6px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function BgLayers({ isLight }) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.011 0.009' numOctaves='5' seed='12' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.5 0 0 0 0.09 0.3 0 0 0 0.05 0 0 0 0 0.01 0 0 0 0.16 0'/%3E%3C/filter%3E%3Crect width='800' height='800' filter='url(%23c)'/%3E%3C/svg%3E")`,
        backgroundSize: '800px', opacity: isLight ? 0.15 : 0.5, mixBlendMode: 'screen' }} />
      {!isLight && <>
        <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 120% 60% at 50% 110%, rgba(180,90,20,0.1) 0%, transparent 60%)' }} />
        <div style={{ position: 'fixed', inset: 0, zIndex: 4, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(7,8,13,0.55) 100%)' }} />
      </>}
      <div style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23g)' opacity='0.038'/%3E%3C/svg%3E")`,
        backgroundSize: '280px', opacity: 0.6 }} />
    </>
  )
}

function Section({ id, children, style = {}, isLight }) {
  const isMobile = useIsMobile()
  return (
    <section id={id} style={{
      position: 'relative', zIndex: 5,
      maxWidth: '960px', margin: '0 auto',
      padding: isMobile ? '60px 20px' : '120px 40px',
      textAlign: 'center',
      borderTop: `1px solid ${isLight ? 'rgba(212,137,30,0.15)' : 'rgba(212,137,30,0.06)'}`,
      ...style,
    }}>
      {children}
    </section>
  )
}

function SectionEyebrow({ children, color = '#D4891E' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '12px',
      marginBottom: '36px', fontFamily: "'JetBrains Mono', monospace",
      fontSize: '9px', letterSpacing: '0.45em', textTransform: 'uppercase', color,
    }}>
      <span style={{ width: '24px', height: '1px', background: color, opacity: 0.5 }} />
      {children}
    </div>
  )
}

function Hero({ isLight }) {
  const canvasRef = useRef(null)
  const isMobile = useIsMobile()
  const reducedMotion = usePrefersReducedMotion()
  useParticles(canvasRef, isLight, reducedMotion)
  const titleColor   = isLight ? '#1A0E04' : '#F0E8D8'
  const taglineColor = isLight ? 'rgba(140,80,10,0.7)' : 'rgba(212,137,30,0.45)'
  const pillColor    = isLight ? '#7A5A20' : '#A09070'
  const pillBorder   = isLight ? 'rgba(212,137,30,0.3)' : 'rgba(212,137,30,0.18)'
  const scrollColor  = isLight ? '#8A6A30' : '#8A8070'
  const coords = [
    'PT · 39.40°N 8.22°W', 'AD · 42.51°N 1.52°E',
    'ES · 40.46°N 3.75°W', 'GR · 39.07°N 21.82°E',
    'BE · 50.50°N 4.47°E', 'FI · 61.92°N 25.75°E',
  ]
  // Fixed 100vh + overflow:hidden clipped badges/pills on typical laptop heights.
  // Grow with content; keep a full-viewport minimum; clip only the canvas layer.
  return (
    <section id="hero" style={{
      position: 'relative',
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '88px 20px 40px' : '100px 40px 48px',
      boxSizing: 'border-box',
    }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', width: '100%', maxWidth: '920px' }}>
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: isMobile ? '28px' : '36px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: isMobile ? '8px 14px' : '9px 22px',
            border: `1px solid ${isLight ? 'rgba(212,137,30,0.3)' : 'rgba(212,137,30,0.16)'}`,
            borderRadius: '100px',
            background: isLight ? 'rgba(212,137,30,0.08)' : 'rgba(212,137,30,0.04)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4891E', display: 'inline-block', animation: 'hmPulse 2.2s ease-in-out infinite', flexShrink: 0 }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: isMobile ? '8px' : '9px',
              letterSpacing: isMobile ? '0.18em' : '0.28em',
              color: '#D4891E', textTransform: 'uppercase',
            }}>Vila Nova de Gaia → Espoo</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: isMobile ? '8px 14px' : '9px 22px',
            border: `1px solid ${isLight ? 'rgba(30,200,168,0.3)' : 'rgba(30,200,168,0.18)'}`,
            borderRadius: '100px',
            background: isLight ? 'rgba(30,200,168,0.08)' : 'rgba(30,200,168,0.05)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1EC8A8', display: 'inline-block', animation: 'hmPulse 2.2s ease-in-out infinite', flexShrink: 0 }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: isMobile ? '8px' : '9px',
              letterSpacing: isMobile ? '0.18em' : '0.28em',
              color: '#1EC8A8', textTransform: 'uppercase',
            }}>Open to opportunities</span>
          </div>
        </div>
        <h1 style={{ margin: 0, animation: 'hmTitleIn 1.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <span style={{
            display: 'block', fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(48px, 12vw, 136px)', fontWeight: 200, fontStyle: 'italic',
            letterSpacing: '-0.04em', lineHeight: 0.9, color: titleColor,
            textShadow: isLight ? 'none' : '0 0 120px rgba(212,137,30,0.12)',
          }}>HENRIQUE</span>
          <span style={{
            display: 'block', fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(48px, 12vw, 136px)', fontWeight: 200, fontStyle: 'italic',
            letterSpacing: '-0.04em', lineHeight: 0.9, color: '#D4891E',
            textShadow: isLight ? 'none' : '0 0 80px rgba(212,137,30,0.3)',
            marginBottom: isMobile ? '24px' : '32px',
          }}>MOREIRA</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px', margin: '0 auto 24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,137,30,0.35))' }} />
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden><path d="M10 1 L19 15 L10 11 L1 15 Z" stroke="#D4891E" strokeWidth="0.8" strokeOpacity="0.65" fill="rgba(212,137,30,0.05)" /></svg>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(212,137,30,0.35))' }} />
        </div>
        <div style={{
          fontFamily: "'Lora', serif", fontSize: 'clamp(15px, 2vw, 22px)', fontStyle: 'italic',
          color: isLight ? 'rgba(80,40,5,0.85)' : 'rgba(240,232,216,0.75)',
          lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 28px', letterSpacing: '0.01em',
        }}>
          18 years in Nordic forest industry commercial operations — now building AI-native products for the industries that need them most.
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isMobile ? '9px' : '10px',
          color: taglineColor,
          lineHeight: 1.7,
          maxWidth: isMobile ? '320px' : '560px',
          margin: '0 auto 28px',
          letterSpacing: '0.02em',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: isMobile ? '6px 12px' : '8px 24px',
          justifyItems: isMobile ? 'start' : 'center',
          textAlign: isMobile ? 'left' : 'center',
        }}>
          {coords.map((c) => (
            <span key={c} style={{ whiteSpace: 'nowrap' }}>{c}</span>
          ))}
        </div>
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: isMobile ? '40px' : '56px',
        }}>
          {['Systems Thinker', 'AI Builder', 'Global Citizen'].map(pill => (
            <div key={pill} style={{
              padding: '8px 18px', border: `1px solid ${pillBorder}`, borderRadius: '100px',
              fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: pillColor,
            }}>{pill}</div>
          ))}
        </div>
        <div style={{ animation: 'hmBounce 2.4s ease-in-out infinite' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', letterSpacing: '0.3em', color: scrollColor, textTransform: 'uppercase', marginBottom: '10px' }}>Scroll</div>
          <div style={{ width: '1px', height: isMobile ? '32px' : '44px', background: 'linear-gradient(to bottom, #D4891E, transparent)', margin: '0 auto' }} />
        </div>
      </div>
    </section>
  )
}

function Story({ isLight }) {
  const isMobile = useIsMobile()
  const languages    = ['Portuguese · native', 'Spanish', 'Catalan', 'English', 'Finnish', 'French']
  const headingColor = isLight ? '#1A0E04' : '#F0E8D8'
  const bodyColor    = isLight ? '#2A1A08' : '#B8AE9A'
  const pillColor    = isLight ? '#5A3A10' : '#C8B890'
  const credBg       = isLight ? 'rgba(212,137,30,0.06)' : 'rgba(212,137,30,0.04)'
  const credBorder   = isLight ? 'rgba(212,137,30,0.2)' : 'rgba(212,137,30,0.12)'
  const credentials  = [
    { label: 'Background', value: 'International Business Management · Packaging · Forest Industry' },
    { label: 'Corporate Tools', value: 'SAP · Power BI · CRM · BW' },
    { label: 'Regions', value: 'Portugal · South East Europe · EMEA' },
    { label: 'Building', value: 'LYCAON · GRYPS · Velu · Grantemia' },
    { label: 'Earlier Work', value: 'DisclAI · Litrix · Iraun — explored, shelved' },
    { label: 'Stack', value: 'React · Next.js · Neon · Vercel · Resend · Cloudflare · Mistral' },
    { label: 'Focus', value: 'AI research · EU compliance · Systems Intelligence' },
  ]
  return (
    <Section id="story" isLight={isLight}>
      <RevealWrapper>
        <SectionEyebrow>The Story</SectionEyebrow>
        {/* Photo + text: single column on mobile, two columns on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '60px', alignItems: 'center', marginBottom: isMobile ? '32px' : '60px', textAlign: 'left' }}>
          {/* Photo */}
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '2px', border: `1px solid ${isLight ? 'rgba(212,137,30,0.2)' : 'rgba(212,137,30,0.08)'}`, background: '#1A1612' }}>
            <img
              src="/henrique.png"
              alt="Henrique Moreira presenting"
              style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: '50% 15%', maxHeight: isMobile ? '360px' : '520px', filter: isLight ? 'brightness(1.05)' : 'brightness(0.92)' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: `linear-gradient(to top, #1A1612, transparent)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', letterSpacing: '0.25em', color: '#D4891E', textTransform: 'uppercase', opacity: 0.8 }}>
              Espoo, Finland · 2025
            </div>
          </div>
          {/* Text */}
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? '32px' : 'clamp(32px, 4vw, 52px)', fontWeight: 200, fontStyle: 'italic', color: headingColor, lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: '28px' }}>
              Some people arrive.<br /><span style={{ color: '#D4891E' }}>Others keep moving.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
              {[
                "Systems thinking forged across two decades and multiple industries. Not methodology – necessity.",
                "Six languages. Enough countries to lose count. The world stops feeling foreign when you stop treating it as one.",
                "Now building intelligence that thinks ahead. The rest is in the work.",
              ].map((para, i) => (
                <p key={i} style={{ fontFamily: "'Lora', serif", fontSize: isMobile ? '15px' : '16px', lineHeight: '1.85', color: bodyColor, letterSpacing: '0.01em' }}>{para}</p>
              ))}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', letterSpacing: '0.42em', color: isLight ? '#8A6A30' : '#6A5A3A', textTransform: 'uppercase', marginBottom: '12px' }}>Languages</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {languages.map(l => (
                <div key={l} style={{ padding: '6px 14px', background: isLight ? 'rgba(212,137,30,0.08)' : 'rgba(212,137,30,0.05)', border: `1px solid ${isLight ? 'rgba(212,137,30,0.3)' : 'rgba(212,137,30,0.18)'}`, borderRadius: '100px', fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', color: pillColor }}>{l}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Credibility row */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '4px' }}>
          {credentials.map(c => (
            <div key={c.label} style={{ background: credBg, border: `1px solid ${credBorder}`, borderRadius: '2px', padding: '16px 20px', textAlign: 'left' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7.5px', letterSpacing: '0.3em', color: '#D4891E', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.7 }}>{c.label}</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: '13px', color: bodyColor, lineHeight: 1.6 }}>{c.value}</div>
            </div>
          ))}
        </div>
      </RevealWrapper>
    </Section>
  )
}

function ProductCard({ n, accent, category, name, tagline, description, tags, challenge, status, nonCommercial, href, isLight }) {
  const cardBg         = isLight ? 'rgba(255,248,235,0.95)' : '#0A0908'
  const cardBorder     = isLight ? 'rgba(212,137,30,0.12)' : 'rgba(255,255,255,0.03)'
  const nameColor      = isLight ? '#1A0E04' : '#F0E8D8'
  const descColor      = isLight ? '#2A1A08' : '#8A8278'
  const challengeColor = isLight ? '#5A3A10' : '#5A5248'
  const neutralColor   = isLight ? '#5A5040' : '#8A8070'
  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderLeft: `3px solid ${accent}`, borderRadius: '2px', padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: accent, opacity: 0.6, letterSpacing: '0.1em' }}>{n}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: accent, flex: 1 }}>{category}</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7.5px', color: accent, opacity: 0.7, letterSpacing: '0.1em', padding: '3px 8px', border: `1px solid ${accent}40`, borderRadius: '100px' }}>{status}</div>
          {nonCommercial && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7.5px', color: neutralColor, letterSpacing: '0.1em', padding: '3px 8px', border: `1px dashed ${neutralColor}60`, borderRadius: '100px' }}>Non-commercial Research Project</div>
          )}
        </div>
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 200, fontStyle: 'italic', color: nameColor, letterSpacing: '-0.03em', lineHeight: 0.9 }}>{name}</div>
      <div style={{ fontFamily: "'Lora', serif", fontSize: '14px', fontStyle: 'italic', color: accent, lineHeight: 1.65 }}>{tagline}</div>
      <div style={{ fontFamily: "'Lora', serif", fontSize: '13.5px', color: descColor, lineHeight: 1.75, textAlign: 'left' }}>{description}</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <div key={tag} style={{ padding: '4px 10px', border: `1px solid ${accent}30`, borderRadius: '100px', fontFamily: "'JetBrains Mono', monospace", fontSize: '7.5px', color: accent, letterSpacing: '0.1em' }}>{tag}</div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${isLight ? 'rgba(212,137,30,0.12)' : 'rgba(255,255,255,0.04)'}`, paddingTop: '14px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7.5px', color: accent, opacity: 0.6, letterSpacing: '0.2em', textTransform: 'uppercase' }}>The challenge – </span>
        <span style={{ fontFamily: "'Lora', serif", fontSize: '12.5px', fontStyle: 'italic', color: challengeColor, lineHeight: 1.6 }}>{challenge}</span>
      </div>
      {href && (
        <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', marginTop: '4px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', border: `1px solid ${accent}`, borderRadius: '1px', fontFamily: "'Syne', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#07080D' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = accent }}>
            Visit {name} ↗
          </div>
        </a>
      )}
    </div>
  )
}

function EarlierWorkItem({ accent, name, description, href, isLight }) {
  const nameColor = isLight ? '#1A0E04' : '#F0E8D8'
  const descColor = isLight ? '#4A3A20' : '#7A7268'
  const cardBg    = isLight ? 'rgba(255,248,235,0.6)' : 'rgba(255,255,255,0.015)'
  const content = (
    <div style={{ background: cardBg, borderLeft: `2px solid ${accent}`, padding: '12px 18px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '5px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: nameColor }}>{name}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '6.5px', letterSpacing: '0.1em', color: accent, opacity: 0.75, textTransform: 'uppercase', padding: '2px 7px', border: `1px dashed ${accent}70`, borderRadius: '100px' }}>Personal</span>
      </div>
      <div style={{ fontFamily: "'Lora', serif", fontSize: '12px', fontStyle: 'italic', color: descColor, lineHeight: 1.55 }}>{description}</div>
    </div>
  )
  return href
    ? <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{content}</a>
    : content
}

function Work({ isLight }) {
  const isMobile    = useIsMobile()
  const headingColor = isLight ? '#1A0E04' : '#F0E8D8'
  const lycaonBg     = isLight ? 'rgba(255,248,220,0.95)' : '#100C04'
  const lycaonBorder = isLight ? 'rgba(240,168,40,0.25)' : 'rgba(240,168,40,0.15)'
  const taglineColor = isLight ? '#7A5A00' : '#C8B070'
  const descColor    = isLight ? '#2A1A08' : '#8A7A50'
  return (
    <Section id="work" isLight={isLight}>
      <RevealWrapper>
        <SectionEyebrow>Projects</SectionEyebrow>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 200, fontStyle: 'italic', color: headingColor, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '12px' }}>
          What I explore.<br /><span style={{ color: '#D4891E' }}>What I bring.</span>
        </h2>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '13px', fontStyle: 'italic', color: isLight ? '#8A6A30' : '#4A4030', marginBottom: '12px', textAlign: 'center' }}>
          Personal R&D projects – built independently as research and learning initiatives.
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', color: isLight ? '#8A6A30' : '#6A5A3A', textAlign: 'center', marginBottom: '40px' }}>
          LYCAON · GRYPS · Velu · Grantemia — Non-commercial Research Projects
        </div>
      </RevealWrapper>
      <RevealWrapper delay={150}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* LYCAON */}
          <div style={{ background: lycaonBg, border: `1px solid ${lycaonBorder}`, borderLeft: '4px solid #F0A828', borderRadius: '2px', padding: isMobile ? '24px 20px' : '40px 44px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 0% 50%, rgba(240,168,40,0.06) 0%, transparent 55%)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#F0A828', opacity: 0.6, letterSpacing: '0.1em' }}>01</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F0A828' }}>Anticipatory Intelligence</div>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(240,168,40,0.2), transparent)', maxWidth: '120px' }} />
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: isLight ? '#8A6A20' : '#8A7A60', letterSpacing: '0.1em', padding: '4px 10px', border: '1px solid rgba(240,168,40,0.3)', borderRadius: '100px' }}>Personal project</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: isLight ? '#5A5040' : '#8A8070', letterSpacing: '0.1em', padding: '4px 10px', border: `1px dashed ${isLight ? '#5A504060' : '#8A807060'}`, borderRadius: '100px' }}>Non-commercial Research Project</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 200, fontStyle: 'italic', color: isLight ? '#1A0E04' : '#F0E8D8', letterSpacing: '-0.03em', lineHeight: 0.9, marginBottom: '16px' }}>LYCAON</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: '17px', fontStyle: 'italic', color: taglineColor, lineHeight: 1.8, maxWidth: '560px', margin: '0 auto', marginBottom: '24px' }}>"Not what is. What comes next."</div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: '15px', color: descColor, lineHeight: 1.7, maxWidth: '560px', margin: '0 auto', marginBottom: '28px' }}>
                Anticipatory intelligence across six temporal dimensions. Reads terrain ahead, maps trajectories, identifies the move no one is making.
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
                {['Temporal Analysis', 'Pattern Recognition', 'Strategic Foresight'].map(tag => (
                  <div key={tag} style={{ padding: '5px 14px', border: '1px solid rgba(240,168,40,0.3)', borderRadius: '100px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: isLight ? '#8A6A20' : '#8A7A50', letterSpacing: '0.12em' }}>{tag}</div>
                ))}
              </div>
              <a href="https://lycaon.vercel.app" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '12px 26px', border: '1px solid #F0A828', borderRadius: '1px', fontFamily: "'Syne', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#F0A828', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F0A828'; e.currentTarget.style.color = '#07080D' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#F0A828' }}>
                  Visit LYCAON ↗
                </div>
              </a>
            </div>
          </div>

          {/* grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '4px' }}>
            <ProductCard n="02" accent="#4FA8FF" category="Satellite Connectivity Intelligence" name="GRYPS" tagline='"Satellite connectivity should be as simple to manage as any other network."' description="Intelligence platform for satellite connectivity operations. Monitors link quality, predicts outages, and surfaces actionable signals across LEO, MEO, and GEO constellations – built for operators who can't afford blind spots." tags={['Link Intelligence', 'Outage Prediction', 'Constellation Monitoring']} challenge="Satellite networks are uniquely opaque. Ground teams react to outages they could have seen coming." status="Live" nonCommercial href="https://gryps.vercel.app" isLight={isLight} />
            <ProductCard n="03" accent="#1EC8A8" category="Operational Intelligence" name="VELU" tagline='"The operational clarity big organisations take for granted – explored here for everyone else."' description="Five intelligence modules covering pipeline, email performance, market signals, competitive position, and operational health. No analyst required." tags={['Pipeline Intelligence', 'Market Signals', 'Competitive Watch']} challenge="Large analytics suites are notoriously complex and costly to run. This project explores a simpler alternative." status="Personal project" nonCommercial href="https://velu.fi" isLight={isLight} />
            <ProductCard n="04" accent="#5BA89A" category="Research Intelligence · Finland & EU" name="GRANTEMIA" tagline='"2,400 active funders. One researcher. One perfect match."' description="AI-matched grant discovery for Finnish and EU researchers — with a Portugal twin for the same product loop. Tracks deadlines, surfaces new announcements, manages the application pipeline – so researchers spend time on research, not spreadsheets." tags={['AI Matching', 'Deadline Intelligence', 'Funding Discovery']} challenge="The funding landscape never stops moving. Most researchers only ever see a fraction of what they're eligible for." status="Personal project" nonCommercial href="https://grantemia.fi" isLight={isLight} />
          </div>

          {/* Earlier Work */}
          <div style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: isLight ? 'rgba(212,137,30,0.15)' : 'rgba(255,255,255,0.05)' }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', letterSpacing: '0.35em', textTransform: 'uppercase', color: isLight ? '#8A6A30' : '#6A5A3A' }}>Earlier Work</div>
              <div style={{ flex: 1, height: '1px', background: isLight ? 'rgba(212,137,30,0.15)' : 'rgba(255,255,255,0.05)' }} />
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: '12px', fontStyle: 'italic', color: isLight ? '#8A6A30' : '#4A4030', textAlign: 'center', marginBottom: '20px' }}>
              Explored and shelved — built for learning, not currently active.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '4px' }}>
              <EarlierWorkItem accent="#B8334C" name="DISCLAI" description="EU AI Act compliance documents — transparency notices, impact assessments, harm taxonomies." isLight={isLight} />
              <EarlierWorkItem accent="#C8A050" name="LITRIX" description="AI literacy training compliance under EU law, since February 2025." isLight={isLight} />
              <EarlierWorkItem accent="#8A7ADB" name="IRAUN" description="A personal AI ops assistant for managing several projects at once." href="https://iraun.vercel.app" isLight={isLight} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', letterSpacing: '0.15em', color: isLight ? '#8A6A30' : '#5A5040', textAlign: 'center', marginTop: '28px' }}>
              Mistral · Neon · Vercel · Resend — solo-built, zero infrastructure overhead by design.
            </div>
          </div>

          {/* Internal Tooling */}
          <div style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: isLight ? 'rgba(212,137,30,0.15)' : 'rgba(255,255,255,0.05)' }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', letterSpacing: '0.35em', textTransform: 'uppercase', color: isLight ? '#8A6A30' : '#6A5A3A' }}>Internal Tooling · Personal Projects</div>
              <div style={{ flex: 1, height: '1px', background: isLight ? 'rgba(212,137,30,0.15)' : 'rgba(255,255,255,0.05)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr', gap: '4px' }}>
              <ProductCard n="—" accent="#6A93B0" category="Personal Projects Dashboard" name="FORGE" tagline='"One dashboard for every personal project, deployment, and session in one place."' description="Private dashboard tracking personal coding projects, deployments, and session history in one place. Built for personal use and intentionally private: no live link, requires authentication." tags={['Deployment Tracking', 'Session History', 'Private / Internal']} challenge="Keeping track of several personal projects means state lives in many different places. Forge is where it all comes together." status="Active · Private" isLight={isLight} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', letterSpacing: '0.15em', color: isLight ? '#8A6A30' : '#5A5040', textAlign: 'center', marginTop: '20px' }}>
              Built with Claude Code.
            </div>
          </div>

        </div>
      </RevealWrapper>
    </Section>
  )
}

function Contact({ isLight }) {
  const headingColor = isLight ? '#1A0E04' : '#F0E8D8'
  const bodyColor    = isLight ? '#2A1A08' : '#B0A888'
  const footerColor  = isLight ? '#8A6A30' : '#8A8070'
  const dividerColor = isLight ? 'rgba(212,137,30,0.2)' : 'rgba(255,255,255,0.04)'
  return (
    <Section id="contact" isLight={isLight} style={{ textAlign: 'center' }}>
      <RevealWrapper>
        <SectionEyebrow>Contact</SectionEyebrow>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 200, fontStyle: 'italic', color: headingColor, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '24px' }}>
          Let's think<br /><span style={{ color: '#D4891E' }}>ahead together.</span>
        </h2>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: bodyColor, lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 52px' }}>
          Whether you're building something, exploring AI, or simply want to connect – reach out.
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
          <a href="mailto:hqe.moreira@gmail.com" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '14px 32px', background: '#D4891E', color: '#07080D', fontFamily: "'Syne', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: '1px', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 32px rgba(212,137,30,0.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              Send a message
            </div>
          </a>
          <a href="https://www.linkedin.com/in/hqemoreira" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '14px 32px', border: '1px solid rgba(212,137,30,0.4)', color: '#D4891E', fontFamily: "'Syne', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: '1px', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,137,30,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              LinkedIn ↗
            </div>
          </a>
        </div>
        <div style={{ borderTop: `1px solid ${dividerColor}`, paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontStyle: 'italic', fontWeight: 300, color: footerColor, letterSpacing: '0.02em' }}>H·M</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: footerColor, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Vila Nova de Gaia → Espoo</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: footerColor, letterSpacing: '0.2em' }}>© {new Date().getFullYear()} Henrique Moreira</div>
        </div>
      </RevealWrapper>
    </Section>
  )
}

export default function Portfolio({ theme = 'dark' }) {
  const isLight = theme === 'light'
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'portfolio-styles'
    style.textContent = `
      @keyframes hmTitleIn { from { opacity: 0; transform: translateY(28px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
      @keyframes hmPulse { 0%, 100% { box-shadow: 0 0 6px rgba(212,137,30,0.5); transform: scale(1); } 50% { box-shadow: 0 0 16px rgba(212,137,30,0.9); transform: scale(1.3); } }
      @keyframes hmBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
    `
    document.head.appendChild(style)

    // Schema.org structured data
    const schema = document.createElement('script')
    schema.type = 'application/ld+json'
    schema.id = 'portfolio-schema'
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Henrique Moreira",
      "url": "https://henriquemoreira.eu",
      "email": "hqe.moreira@gmail.com",
      "jobTitle": "AI Builder & Systems Thinker",
      "description": "AI builder and systems thinker based in Espoo, Finland. Building LYCAON, Velu, Grantemia, DisclAI, Litrix and GRYPS – intelligence tools for the decade ahead.",
      "address": { "@type": "PostalAddress", "addressLocality": "Espoo", "addressCountry": "FI" },
      "sameAs": ["https://www.linkedin.com/in/hqemoreira"],
      "knowsAbout": ["Artificial Intelligence", "Systems Thinking", "Software Development", "EU AI Act", "Supply Chain", "International Business"],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "AI Product Builder",
        "occupationLocation": { "@type": "City", "name": "Espoo" }
      }
    })
    document.head.appendChild(schema)

    return () => {
      const s = document.getElementById('portfolio-styles')
      if (s) document.head.removeChild(s)
      const sc = document.getElementById('portfolio-schema')
      if (sc) document.head.removeChild(sc)
    }
  }, [])
  return (
    <div style={{ background: isLight ? '#F5F0E6' : '#07080D', minHeight: '100vh', overflowX: 'hidden', transition: 'background 0.4s ease' }}>
      <BgLayers isLight={isLight} />
      <Hero isLight={isLight} />
      <Story isLight={isLight} />
      <Work isLight={isLight} />
      <LycaonDemo />
      <Contact isLight={isLight} />
    </div>
  )
}
