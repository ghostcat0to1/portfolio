import { useState, useEffect, useRef, useCallback } from 'react'

const QUERY = "Where is the gap between AI hype and real business value?"

const DEMO_SECTIONS = [
  { key: "PRESENT STATE", n: "01", accent: "#D4891E",
    text: "AI adoption is accelerating in spend but decelerating in genuine impact. Most organisations have tools deployed – few have outcomes delivered." },
  { key: "DEEP PATTERNS", n: "02", accent: "#D4891E",
    text: "Every technology cycle produces the same pattern: hype arrives before infrastructure. The gap is not AI's limitations – it is the absence of people who translate capability into strategy." },
  { key: "EMERGING SIGNALS", n: "03", accent: "#1EC8A8",
    text: "A new profile is forming: the AI strategist who combines domain knowledge, systems thinking, and anticipatory intelligence. Boards are actively searching." },
  { key: "TRAJECTORIES", n: "04", accent: "#1EC8A8",
    text: "High probability: independent AI strategists with business depth displace generic implementation firms within 36 months. The differentiator will not be technical – it will be judgement." },
  { key: "UNCERTAINTY MAP", n: "05", accent: "#8A8278",
    text: "The rate of AI capability change makes specific forecasts unreliable. What remains constant: the value of knowing how to read terrain ahead of others." },
  { key: "THE MOVE NO ONE IS MAKING", n: "06", accent: "#F0A828", featured: true,
    text: "Build anticipatory intelligence before the market asks for it. The consultants who will lead this decade are not learning AI – they are learning how to think ahead of it." },
]

export default function LycaonDemo() {
  const [typedText,       setTypedText]       = useState('')
  const [inputFocused,    setInputFocused]     = useState(false)
  const [btnActive,       setBtnActive]        = useState(false)
  const [showLoading,     setShowLoading]      = useState(false)
  const [visibleSections, setVisibleSections]  = useState([])
  const [cursorX,         setCursorX]          = useState(50)
  const [cursorY,         setCursorY]          = useState(50)
  const [clicking,        setClicking]         = useState(false)
  const [demoOpacity,     setDemoOpacity]      = useState(0)
  const [contentOpacity,  setContentOpacity]   = useState(1)
  const [lycaonGlow,      setLycaonGlow]       = useState(false)

  const timeoutIds    = useRef([])
  const typeInterval  = useRef(null)
  const sectionsRef   = useRef(null)
  const windowRef     = useRef(null)   // the outer demo window div
  const lycaonRef     = useRef(null)   // the LYCAON heading
  const btnRef        = useRef(null)   // the Dispatch button
  const inputRef      = useRef(null)   // the textarea
  const runSequenceRef = useRef(null)  // holds latest runSequence, so the loop can self-schedule without a TDZ self-reference

  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,200&family=Lora:ital,wght@0,400;1,400&family=Syne:wght@700&family=JetBrains+Mono:wght@400&display=swap"
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    const style = document.createElement('style')
    style.id = 'lycaon-demo-css'
    style.textContent = `
      @keyframes demoRadar { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes demoBlink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes demoSectionIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
      @keyframes demoCursorPulse { 0%,100%{box-shadow:0 0 8px rgba(212,137,30,0.7)} 50%{box-shadow:0 0 20px rgba(212,137,30,1)} }
      @keyframes lycaonFlare { 0%{text-shadow:0 0 40px rgba(212,137,30,0.15)} 40%{text-shadow:0 0 80px rgba(212,137,30,1),0 0 120px rgba(212,137,30,0.5)} 100%{text-shadow:0 0 40px rgba(212,137,30,0.15)} }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(link)
      const s = document.getElementById('lycaon-demo-css')
      if (s) document.head.removeChild(s)
    }
  }, [])

  const clearAll = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout)
    timeoutIds.current = []
    if (typeInterval.current) clearInterval(typeInterval.current)
  }, [])

  const schedule = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay)
    timeoutIds.current.push(id)
    return id
  }, [])

  // Convert an element's center to % relative to the window container
  const toPercent = useCallback((el) => {
    if (!el || !windowRef.current) return { x: 50, y: 50 }
    const win = windowRef.current.getBoundingClientRect()
    const box = el.getBoundingClientRect()
    return {
      x: ((box.left + box.width / 2 - win.left) / win.width) * 100,
      y: ((box.top + box.height / 2 - win.top) / win.height) * 100,
    }
  }, [])

  const runSequence = useCallback(() => {
    clearAll()
    setTypedText('')
    setInputFocused(false)
    setBtnActive(false)
    setShowLoading(false)
    setVisibleSections([])
    setClicking(false)
    setContentOpacity(1)
    setLycaonGlow(false)
    if (sectionsRef.current) sectionsRef.current.scrollTop = 0
    setCursorX(80)
    setCursorY(80)

    let t = 0

    schedule(() => setDemoOpacity(1), t)
    t += 800

    // ── Move to LYCAON title – measured from DOM
    schedule(() => {
      const p = toPercent(lycaonRef.current)
      setCursorX(p.x)
      setCursorY(p.y)
    }, t)
    t += 1000

    // ── Click LYCAON title
    schedule(() => setClicking(true), t)
    schedule(() => { setClicking(false); setLycaonGlow(true) }, t + 200)
    schedule(() => setLycaonGlow(false), t + 900)
    t += 1100

    // ── Move to input center – measured from DOM
    schedule(() => {
      const p = toPercent(inputRef.current)
      setCursorX(p.x)
      setCursorY(p.y)
    }, t)
    t += 800

    // ── Click input
    schedule(() => setClicking(true), t)
    schedule(() => { setClicking(false); setInputFocused(true) }, t + 200)
    t += 500

    // ── Type query
    schedule(() => {
      let i = 0
      typeInterval.current = setInterval(() => {
        i++
        setTypedText(QUERY.slice(0, i))
        if (i >= QUERY.length) clearInterval(typeInterval.current)
      }, 46)
    }, t)
    t += QUERY.length * 46 + 500

    // ── Move to Dispatch button – measured from DOM
    schedule(() => {
      const p = toPercent(btnRef.current)
      setCursorX(p.x)
      setCursorY(p.y)
    }, t)
    t += 900

    // ── Click Dispatch
    schedule(() => setClicking(true), t)
    schedule(() => { setClicking(false); setBtnActive(true); setInputFocused(false) }, t + 200)
    schedule(() => { setBtnActive(false); setShowLoading(true) }, t + 420)
    t += 650

    // ── Cursor to loading spinner area
    schedule(() => { setCursorX(50); setCursorY(58) }, t)
    t += 2200

    // ── Results cascade
    schedule(() => setShowLoading(false), t)
    DEMO_SECTIONS.forEach((_, i) => {
      schedule(() => {
        setVisibleSections(p => [...p, DEMO_SECTIONS[i].key])
        setCursorX(15)
        setCursorY(62 + i * 5.5)
        if (sectionsRef.current) sectionsRef.current.scrollTo({ top: sectionsRef.current.scrollHeight, behavior: 'smooth' })
      }, t)
      t += 1100
    })

    t += 3000
    schedule(() => setContentOpacity(0), t)
    t += 1000
    schedule(() => runSequenceRef.current(), t + 500)
  }, [clearAll, schedule, toPercent])

  useEffect(() => {
    runSequenceRef.current = runSequence
  }, [runSequence])

  useEffect(() => {
    schedule(runSequence, 0)
    return clearAll
  }, [runSequence, clearAll, schedule])

  return (
    <section style={{ position:'relative', zIndex:5, padding:'100px 32px 120px', borderTop:'1px solid rgba(212,137,30,0.06)' }}>

      <div style={{ maxWidth:'960px', margin:'0 auto', marginBottom:'48px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{ width:'32px', height:'1px', background:'rgba(212,137,30,0.4)' }} />
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', letterSpacing:'0.45em', color:'#D4891E', textTransform:'uppercase', opacity:0.75 }}>See it in action</div>
          <div style={{ flex:1, height:'1px', background:'linear-gradient(to right,rgba(212,137,30,0.3),transparent)' }} />
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', letterSpacing:'0.2em', color:'#3A3020' }}>Autoplay · No audio</div>
        </div>
      </div>

      <div style={{ maxWidth:'900px', margin:'0 auto', opacity:demoOpacity, transition:'opacity 0.8s ease' }}>
        <div ref={windowRef} style={{ position:'relative', background:'#07080D', border:'1px solid rgba(212,137,30,0.18)', borderRadius:'6px', overflow:'hidden', boxShadow:'0 0 80px rgba(0,0,0,0.6),0 0 40px rgba(212,137,30,0.06)' }}>

          {/* Chrome */}
          <div style={{ display:'flex', alignItems:'center', gap:'7px', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'rgba(0,0,0,0.3)' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => (
              <div key={i} style={{ width:'10px', height:'10px', borderRadius:'50%', background:c, opacity:0.6 }} />
            ))}
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', color:'#3A3020', letterSpacing:'0.2em' }}>lycaon · anticipatory intelligence</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ opacity:contentOpacity, transition:'opacity 0.8s ease', padding:'32px 36px 28px' }}>

            {/* LYCAON title – ref attached here */}
            <div style={{ textAlign:'center', marginBottom:'28px' }}>
              <div ref={lycaonRef} style={{ display:'inline-block', fontFamily:"'Fraunces',serif", fontSize:'42px', fontWeight:200, fontStyle:'italic', letterSpacing:'-0.03em', lineHeight:1, color:'#F0E8D8', animation: lycaonGlow ? 'lycaonFlare 0.9s ease-out' : 'none', textShadow:'0 0 40px rgba(212,137,30,0.15)' }}>
                LYCAON
              </div>
            </div>

            {/* Input area */}
            <div style={{ marginBottom:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', letterSpacing:'0.38em', color: inputFocused ? '#D4891E' : '#4A3E2A', textTransform:'uppercase', transition:'color 0.3s' }}>
                <span style={{ width:'5px', height:'5px', borderRadius:'50%', background: inputFocused ? '#D4891E' : '#3A2E1A', boxShadow: inputFocused ? '0 0 8px rgba(212,137,30,0.7)' : 'none', transition:'all 0.3s', flexShrink:0 }} />
                Dispatch
              </div>

              {/* Textarea – ref attached here */}
              <div ref={inputRef} style={{ background:'#0A0907', border:`1px solid ${inputFocused ? 'rgba(212,137,30,0.45)' : 'rgba(212,137,30,0.08)'}`, borderLeft:`2px solid ${inputFocused ? '#D4891E' : 'rgba(212,137,30,0.2)'}`, borderRadius:'2px', padding:'14px 18px', minHeight:'72px', transition:'all 0.3s', boxShadow: inputFocused ? 'inset 0 0 30px rgba(212,137,30,0.02)' : 'none' }}>
                <div style={{ fontFamily:"'Lora',serif", fontSize:'15px', lineHeight:'1.65', color:'#E8E0D0', letterSpacing:'0.01em', minHeight:'24px' }}>
                  {typedText || <span style={{ color:'#3A3020', fontStyle:'italic' }}>What do you want to think about...</span>}
                  {inputFocused && typedText.length < QUERY.length && (
                    <span style={{ animation:'demoBlink 0.9s ease-in-out infinite', marginLeft:'1px', color:'#D4891E' }}>|</span>
                  )}
                </div>
              </div>

              {/* Dispatch button – ref attached here */}
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'10px' }}>
                <div ref={btnRef} style={{ padding:'9px 20px', border:`1px solid ${btnActive ? 'transparent' : 'rgba(212,137,30,0.35)'}`, background: btnActive ? '#D4891E' : 'transparent', borderRadius:'1px', fontFamily:"'Syne',sans-serif", fontSize:'9px', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color: btnActive ? '#07080D' : (showLoading ? '#5A4A30' : '#D4891E'), transition:'all 0.2s' }}>
                  {showLoading ? 'Tracking →' : 'Dispatch →'}
                </div>
              </div>
            </div>

            {/* Loading */}
            {showLoading && (
              <div style={{ display:'flex', alignItems:'center', gap:'16px', padding:'20px 0', justifyContent:'center' }}>
                <div style={{ position:'relative', width:'32px', height:'32px' }}>
                  <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(212,137,30,0.15)' }} />
                  <div style={{ position:'absolute', inset:0, borderRadius:'50%', borderTop:'1px solid #D4891E', borderRight:'1px solid transparent', borderBottom:'1px solid transparent', borderLeft:'1px solid transparent', animation:'demoRadar 1.2s linear infinite' }} />
                  <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'3px', height:'3px', borderRadius:'50%', background:'#D4891E', boxShadow:'0 0 6px rgba(212,137,30,1)' }} />
                </div>
                <div style={{ fontFamily:"'Lora',serif", fontSize:'13px', fontStyle:'italic', color:'#5A4E3A', letterSpacing:'0.03em' }}>Reading terrain ahead...</div>
              </div>
            )}

            {/* Results */}
            {visibleSections.length > 0 && (
              <div ref={sectionsRef} style={{ display:'flex', flexDirection:'column', gap:'3px', maxHeight:'280px', overflowY:'auto', scrollbarWidth:'none' }}>
                {DEMO_SECTIONS.filter(s => visibleSections.includes(s.key)).map(s => (
                  <div key={s.key} style={{ background: s.featured ? '#100C04' : '#0A0907', border:`1px solid ${s.featured ? 'rgba(240,168,40,0.12)' : 'rgba(255,255,255,0.03)'}`, borderLeft:`2px solid ${s.accent}`, borderRadius:'2px', overflow:'hidden', animation:'demoSectionIn 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 14px', borderBottom:'1px solid rgba(255,255,255,0.03)', background:'rgba(0,0,0,0.2)' }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'7px', color:s.accent, opacity:0.35, letterSpacing:'0.1em' }}>{s.n}</span>
                      <span style={{ color:s.accent, fontSize:'8px' }}>◈</span>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'8px', fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:s.accent }}>{s.key}</span>
                    </div>
                    <div style={{ padding:'10px 16px 12px', fontFamily:"'Lora',serif", fontSize:'12.5px', lineHeight:'1.7', color: s.featured ? '#C8B070' : '#A09888', letterSpacing:'0.005em' }}>{s.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cursor dot */}
          <div style={{ position:'absolute', left:`${cursorX}%`, top:`${cursorY}%`, transform:'translate(-50%,-50%)', width: clicking ? '14px' : '9px', height: clicking ? '14px' : '9px', borderRadius:'50%', background:'#D4891E', boxShadow: clicking ? '0 0 24px rgba(212,137,30,1),0 0 48px rgba(212,137,30,0.5)' : '0 0 10px rgba(212,137,30,0.8)', animation: !clicking ? 'demoCursorPulse 2s ease-in-out infinite' : 'none', transition:'left 0.75s cubic-bezier(0.4,0,0.2,1),top 0.75s cubic-bezier(0.4,0,0.2,1),width 0.15s ease,height 0.15s ease,box-shadow 0.15s ease', pointerEvents:'none', zIndex:30 }} />

          {/* Trail ring */}
          <div style={{ position:'absolute', left:`${cursorX}%`, top:`${cursorY}%`, transform:'translate(-50%,-50%)', width:'24px', height:'24px', borderRadius:'50%', border:'1px solid rgba(212,137,30,0.18)', transition:'left 1s cubic-bezier(0.4,0,0.2,1),top 1s cubic-bezier(0.4,0,0.2,1)', pointerEvents:'none', zIndex:29 }} />
        </div>

        <div style={{ textAlign:'center', marginTop:'20px', fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', color:'#3A3020', letterSpacing:'0.3em', textTransform:'uppercase' }}>
          LYCAON · Six dimensions · Illustrative preview — scripted, not live
        </div>
        <div style={{ textAlign:'center', marginTop:'18px' }}>
          <a href="https://lycaon.vercel.app" target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', padding:'10px 22px', border:'1px solid rgba(212,137,30,0.4)', borderRadius:'1px', fontFamily:"'Syne',sans-serif", fontSize:'9px', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'#D4891E', transition:'all 0.2s', cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#D4891E'; e.currentTarget.style.color = '#07080D' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D4891E' }}>
              Try the real thing ↗
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
