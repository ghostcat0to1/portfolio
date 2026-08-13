/**
 * GRYPS — 60s Path A motion demo (Golden Advisor whitelist only).
 * Source: gryps-golden-advisor.json · captured 2026-08-12T15:10:12Z
 * No MEO, no countdowns, no invented metrics. Score 40 · Grade D.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

const GOLDEN = {
  lat: 68.2,
  lng: 27.4,
  sector: 'forestry',
  autonomy: 'autonomous',
  criticality: 'safety-critical',
  setup: 'Starlink standard kit, no backup',
  score: 40,
  grade: 'D',
  summary:
    'Single-provider setup with no redundancy poses high operational risk for safety-critical autonomous forestry operations in Arctic conditions.',
  risks: [
    {
      label: 'Single-provider dependency',
      severity: 'critical',
      detail:
        'Starlink alone is vulnerable to orbital congestion, solar activity, or regional outages, risking loss of autonomous control.',
    },
    {
      label: 'Arctic environmental exposure',
      severity: 'high',
      detail:
        'Extreme cold, snow, and auroral activity can degrade signal quality or damage equipment, increasing downtime risk.',
    },
  ],
  gaps: [
    {
      label: 'No backup connectivity',
      detail: 'Critical safety systems lack failover, leaving no alternative if primary link fails.',
    },
  ],
  options: [
    {
      provider: 'OneWeb',
      type: 'LEO',
      confidence: 85,
      note: 'Good polar coverage but latency may impact real-time autonomy.',
      highlight: false,
    },
    {
      provider: 'Iridium Certus',
      type: 'LEO',
      confidence: 90,
      note: 'High reliability for safety-critical ops, but lower bandwidth than Starlink.',
      highlight: true,
    },
    {
      provider: 'Inmarsat Global Xpress',
      type: 'GEO',
      confidence: 75,
      note: 'Stable but higher latency; suitable as secondary backup.',
      highlight: false,
    },
  ],
  recommendation:
    'Deploy Iridium Certus as primary backup with OneWeb as secondary to ensure redundancy for safety-critical autonomous operations. Implement thermal shielding for equipment to mitigate Arctic conditions.',
  caveats: [
    'LEO providers may experience temporary outages during polar passes.',
    "Starlink's Arctic coverage is improving but not yet fully optimized for high-latitude operations.",
  ],
  realData: {
    realDataScore: 17,
    elevationCenterM: 291,
    elevationVarianceM: 41.6,
  },
}

const PHASE = {
  INPUT: 0,
  EXEC: 1,
  DIAGNOSIS: 2,
  OPTIONS: 3,
  ADVISORY: 4,
  CLOSE: 5,
}

const mono = "'JetBrains Mono', ui-monospace, monospace"
const ui = "'Syne', system-ui, sans-serif"

export default function GrypsDemo() {
  const [phase, setPhase] = useState(PHASE.INPUT)
  const [visibleOptions, setVisibleOptions] = useState(0)
  const [opacity, setOpacity] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [reduced, setReduced] = useState(false)
  const timeouts = useRef([])
  const rootRef = useRef(null)
  const runRef = useRef(null)

  const clearAll = useCallback(() => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
  }, [])

  const at = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms)
    timeouts.current.push(id)
  }, [])

  const run = useCallback(() => {
    clearAll()
    setPhase(PHASE.INPUT)
    setVisibleOptions(0)
    setScanning(false)
    setOpacity(0)

    at(() => setOpacity(1), 80)
    at(() => setPhase(PHASE.INPUT), 0)

    at(() => {
      setPhase(PHASE.EXEC)
      setScanning(true)
    }, 8000)

    at(() => {
      setScanning(false)
      setPhase(PHASE.DIAGNOSIS)
    }, 15000)

    at(() => {
      setPhase(PHASE.OPTIONS)
      setVisibleOptions(1)
    }, 25000)
    at(() => setVisibleOptions(2), 26100)
    at(() => setVisibleOptions(3), 27200)

    at(() => {
      setPhase(PHASE.ADVISORY)
    }, 35000)

    at(() => setPhase(PHASE.CLOSE), 48000)
    at(() => runRef.current?.(), 60000)
  }, [at, clearAll])

  useEffect(() => {
    runRef.current = run
  }, [run])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'gryps-demo-css'
    style.textContent = `
      @keyframes grypsScan {
        0% { opacity: 0.35; }
        50% { opacity: 1; }
        100% { opacity: 0.35; }
      }
      @keyframes grypsIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes grypsPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.0); }
        50% { box-shadow: 0 0 0 1px rgba(16,185,129,0.45); }
      }
    `
    document.head.appendChild(style)
    return () => document.getElementById('gryps-demo-css')?.remove()
  }, [])

  useEffect(() => {
    if (reduced) {
      at(() => {
        setOpacity(1)
        setPhase(PHASE.ADVISORY)
        setVisibleOptions(3)
      }, 0)
      return clearAll
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) run()
        else clearAll()
      },
      { threshold: 0.35 },
    )
    if (rootRef.current) io.observe(rootRef.current)
    return () => {
      io.disconnect()
      clearAll()
    }
  }, [reduced, run, clearAll, at])

  // ADVISORY must not stack on DIAGNOSIS — that caused recommendation text overlap.
  const showDiag = phase >= PHASE.DIAGNOSIS && phase < PHASE.ADVISORY
  const showOpts = phase >= PHASE.OPTIONS && phase < PHASE.ADVISORY
  const showAdv = phase === PHASE.ADVISORY
  const showClose = phase === PHASE.CLOSE

  return (
    <div
      ref={rootRef}
      aria-label="GRYPS Resilience Signature demo — Path A golden run"
      style={{
        marginTop: 4,
        borderRadius: 2,
        border: '1px solid rgba(79,168,255,0.2)',
        background: '#0B0F17',
        overflow: 'hidden',
        opacity,
        transition: 'opacity 0.6s ease',
        position: 'relative',
        minHeight: 420,
        aspectRatio: '16 / 9',
        fontFamily: mono,
        color: '#94A3B8',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: scanning ? 0.9 : 0.45,
          animation: scanning ? 'grypsScan 1.2s ease-in-out infinite' : 'none',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, padding: '20px 22px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#4FA8FF' }}>GRYPS · RESILIENCE ADVISOR</div>
          <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#64748B' }}>
            SITE: {GOLDEN.lat}°N, {GOLDEN.lng}°E
          </div>
        </div>

        {(phase === PHASE.INPUT || phase === PHASE.EXEC) && (
          <div style={{ animation: 'grypsIn 0.5s ease' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {[GOLDEN.sector, GOLDEN.autonomy, GOLDEN.criticality].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 8,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '4px 8px',
                    border: '1px solid rgba(148,163,184,0.35)',
                    borderRadius: 2,
                    color: '#CBD5E1',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#E2E8F0', marginBottom: 8, letterSpacing: '0.06em' }}>
              CURRENT SETUP: {GOLDEN.setup}
            </div>
            {phase === PHASE.EXEC ? (
              <div style={{ marginTop: 28 }}>
                <div style={{ fontSize: 13, letterSpacing: '0.2em', color: '#4FA8FF', animation: 'grypsScan 1s ease-in-out infinite' }}>
                  EXECUTING RESILIENCE ADVISOR…
                </div>
                <div style={{ fontSize: 9, marginTop: 8, letterSpacing: '0.14em', color: '#64748B' }}>
                  EVALUATING MULTI-ORBIT RISK PROFILE
                </div>
                <div style={{ marginTop: 16, fontSize: 8, letterSpacing: '0.1em', color: '#475569', lineHeight: 1.8 }}>
                  score · grade · risk_factors · redundancy_gaps · connectivity_options · recommendation · caveats
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 36,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 18px',
                  border: '1px solid #4FA8FF',
                  color: '#4FA8FF',
                  fontFamily: ui,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                }}
              >
                RUN ADVISOR
              </div>
            )}
          </div>
        )}

        {showDiag && (
          <div style={{ display: 'grid', gridTemplateColumns: showOpts ? 'minmax(160px, 0.9fr) 1.4fr' : '1fr', gap: 14, flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <div
              style={{
                border: '2px solid rgba(239,68,68,0.55)',
                background: 'rgba(239,68,68,0.1)',
                borderRadius: 2,
                padding: '18px 20px',
                animation: 'grypsIn 0.35s ease',
                minHeight: 0,
                overflowY: 'auto',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 72, fontWeight: 900, color: '#EF4444', lineHeight: 0.9, letterSpacing: '-0.05em' }}>{GOLDEN.score}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#EF4444', border: '2px solid rgba(239,68,68,0.65)', padding: '4px 14px', borderRadius: 4, lineHeight: 1 }}>{GOLDEN.grade}</div>
              </div>
              <div style={{ fontSize: 10, color: '#CBD5E1', lineHeight: 1.55, fontFamily: mono }}>{GOLDEN.summary}</div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GOLDEN.risks.map((r) => (
                  <div key={r.label} style={{ borderLeft: '2px solid #EF4444', paddingLeft: 10 }}>
                    <div style={{ fontSize: 9, color: '#FCA5A5', letterSpacing: '0.08em' }}>
                      {r.label} · {r.severity}
                    </div>
                    <div style={{ fontSize: 9, color: '#94A3B8', lineHeight: 1.45, marginTop: 2 }}>{r.detail}</div>
                  </div>
                ))}
                {GOLDEN.gaps.map((g) => (
                  <div key={g.label} style={{ borderLeft: '2px solid #F59E0B', paddingLeft: 10 }}>
                    <div style={{ fontSize: 9, color: '#FCD34D', letterSpacing: '0.08em' }}>{g.label}</div>
                    <div style={{ fontSize: 9, color: '#94A3B8', lineHeight: 1.45, marginTop: 2 }}>{g.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {showOpts && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, overflowY: 'auto', opacity: 0.72 }}>
                <div style={{ fontSize: 8, letterSpacing: '0.14em', color: '#64748B' }}>CONNECTIVITY OPTIONS · CONFIDENCE</div>
                {GOLDEN.options.slice(0, visibleOptions).map((o) => (
                  <div
                    key={o.provider}
                    style={{
                      border: '1px solid rgba(148,163,184,0.18)',
                      background: 'rgba(148,163,184,0.04)',
                      borderRadius: 2,
                      padding: '8px 10px',
                      animation: 'grypsIn 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 10, color: '#94A3B8' }}>
                        {o.provider} · {o.type}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748B' }}>confidence {o.confidence}</div>
                    </div>
                    <div style={{ fontSize: 9, color: '#64748B', marginTop: 4, lineHeight: 1.45 }}>{o.note}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showAdv && (
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(100px, 0.35fr) 1fr', gap: 14, animation: 'grypsIn 0.4s ease', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#EF4444', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {GOLDEN.score} · {GOLDEN.grade}
              </div>
            </div>
            <div style={{ minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: mono }}>
              <div style={{ fontSize: 10, color: '#E2E8F0', lineHeight: 1.55 }}>{GOLDEN.recommendation}</div>
              {GOLDEN.caveats.map((c) => (
                <div key={c} style={{ fontSize: 9, color: '#94A3B8', lineHeight: 1.5 }}>
                  · {c}
                </div>
              ))}
              <div style={{ fontSize: 8, color: '#475569', letterSpacing: '0.08em' }}>
                terrain evidence · score {GOLDEN.realData.realDataScore} · elev {GOLDEN.realData.elevationCenterM} m ±
                {GOLDEN.realData.elevationVarianceM}
              </div>
            </div>
          </div>
        )}

        {showClose && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              animation: 'grypsIn 0.5s ease',
              gap: 10,
            }}
          >
            <div style={{ fontFamily: ui, fontSize: 42, fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.28em' }}>GRYPS</div>
            <div style={{ fontSize: 12, color: '#94A3B8', maxWidth: 420, lineHeight: 1.5 }}>
              Auditable connectivity risk & resilience intelligence.
            </div>
            <div style={{ fontSize: 11, color: '#4FA8FF', letterSpacing: '0.14em', marginTop: 8 }}>gryps.vercel.app</div>
            <div style={{ fontSize: 8, color: '#475569', marginTop: 16, letterSpacing: '0.12em' }}>
              {GOLDEN.score} · {GOLDEN.grade} · Free · ~60 seconds
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
