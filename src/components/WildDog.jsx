// src/components/WildDog.jsx
// African Wild Dog – rendered as a star chart.
// Anatomical key points as stars of varying magnitude,
// connected by constellation lines. Greek designations
// at the brightest nodes. Diffraction spikes. Chart grid.

export default function WildDog({ opacity = 0.38 }) {
  const A = "#D4891E"  // amber

  // ── Anatomical nodes with star magnitude (r) ─────────────────────────────
  const N = {
    // Head – facing right
    nose:     { x: 1368, y: 302, r: 4   },
    eye:      { x: 1282, y: 246, r: 9,   label: "α LYC" },
    crown:    { x: 1208, y: 220, r: 5   },
    earLtip:  { x: 1155, y: 122, r: 5   },
    earRtip:  { x: 1230, y: 116, r: 5   },
    earBase:  { x: 1200, y: 214, r: 3.5 },
    throat:   { x: 1140, y: 325, r: 3   },
    // Spine
    withers:  { x: 1008, y: 185, r: 8,   label: "β LYC" },
    spMid1:   { x: 862,  y: 178, r: 5   },
    spMid2:   { x: 718,  y: 180, r: 5   },
    loin:     { x: 578,  y: 193, r: 6.5, label: "γ LYC" },
    rump:     { x: 476,  y: 216, r: 7.5 },
    // Tail
    tailBase: { x: 425,  y: 246, r: 3.5 },
    tailMid:  { x: 336,  y: 233, r: 3   },
    tailTip:  { x: 230,  y: 218, r: 3   },
    // Underline
    chest:    { x: 980,  y: 320, r: 5.5 },
    belly:    { x: 718,  y: 332, r: 4   },
    flank:    { x: 502,  y: 318, r: 4   },
    // Front right leg – extended forward
    shldrR:   { x: 1040, y: 330, r: 4   },
    elbowR:   { x: 1075, y: 392, r: 3.5 },
    pawFR:    { x: 1092, y: 472, r: 4.5 },
    // Front left leg – under body
    shldrL:   { x: 970,  y: 338, r: 3.5 },
    elbowL:   { x: 940,  y: 392, r: 3   },
    pawFL:    { x: 924,  y: 472, r: 4.5 },
    // Rear right leg – reaching forward
    hipR:     { x: 622,  y: 328, r: 4   },
    stifleR:  { x: 585,  y: 390, r: 3.5 },
    pawRR:    { x: 565,  y: 472, r: 4.5 },
    // Rear left leg – pushing off
    hipL:     { x: 528,  y: 328, r: 3.5 },
    stifleL:  { x: 490,  y: 390, r: 3   },
    pawRL:    { x: 472,  y: 472, r: 4.5 },
  }

  // ── Constellation edges ───────────────────────────────────────────────────
  const E = [
    ['nose','eye'], ['eye','crown'],
    ['crown','earBase'], ['earBase','earLtip'], ['earBase','earRtip'],
    ['crown','throat'],
    ['crown','withers'], ['throat','chest'],
    ['withers','spMid1'], ['spMid1','spMid2'], ['spMid2','loin'], ['loin','rump'],
    ['rump','tailBase'], ['tailBase','tailMid'], ['tailMid','tailTip'],
    ['withers','chest'], ['chest','belly'], ['belly','flank'], ['flank','rump'],
    ['chest','shldrR'], ['shldrR','elbowR'], ['elbowR','pawFR'],
    ['chest','shldrL'], ['shldrL','elbowL'], ['elbowL','pawFL'],
    ['rump','hipR'], ['hipR','stifleR'], ['stifleR','pawRR'],
    ['rump','hipL'], ['hipL','stifleL'], ['stifleL','pawRL'],
  ]

  return (
    <svg
      viewBox="0 0 1600 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}
      aria-hidden="true"
    >
      <g opacity={opacity}>

        {/* ── Star chart coordinate grid ── */}
        <g opacity="0.14">
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`v${i}`}
              x1={(i + 1) * 110} y1={0}
              x2={(i + 1) * 110} y2={560}
              stroke={A} strokeWidth="0.3"
            />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`h${i}`}
              x1={0} y1={(i + 1) * 110}
              x2={1600} y2={(i + 1) * 110}
              stroke={A} strokeWidth="0.3"
            />
          ))}
        </g>

        {/* ── Constellation lines ── */}
        <g opacity="0.75" strokeLinecap="round">
          {E.map(([a, b], i) => (
            <line key={i}
              x1={N[a].x} y1={N[a].y}
              x2={N[b].x} y2={N[b].y}
              stroke={A} strokeWidth="0.85"
            />
          ))}
        </g>

        {/* ── Stars ── */}
        {Object.entries(N).map(([id, n]) => {
          const big = n.r >= 7
          const mid = n.r >= 5
          const spike = n.r * 3.8

          return (
            <g key={id}>

              {/* Diffuse outer nebula – only for brightest */}
              {big && <circle cx={n.x} cy={n.y} r={n.r * 7} fill={A} opacity="0.04"/>}
              {big && <circle cx={n.x} cy={n.y} r={n.r * 5} fill={A} opacity="0.06"/>}

              {/* Glow layers */}
              {mid && <circle cx={n.x} cy={n.y} r={n.r * 3.5} fill={A} opacity="0.09"/>}
              <circle cx={n.x} cy={n.y} r={n.r * 2.2} fill={A} opacity="0.16"/>
              <circle cx={n.x} cy={n.y} r={n.r * 1.5} fill={A} opacity="0.28"/>

              {/* Core amber */}
              <circle cx={n.x} cy={n.y} r={n.r} fill={A} opacity="0.95"/>

              {/* Bright white centre */}
              <circle cx={n.x} cy={n.y} r={n.r * 0.45} fill="white" opacity="0.55"/>

              {/* Diffraction spikes – named stars only */}
              {mid && (
                <g opacity="0.35">
                  <line x1={n.x - spike} y1={n.y} x2={n.x + spike} y2={n.y}
                    stroke={A} strokeWidth="0.6"/>
                  <line x1={n.x} y1={n.y - spike} x2={n.x} y2={n.y + spike}
                    stroke={A} strokeWidth="0.6"/>
                  {big && <>
                    <line x1={n.x - spike * 0.7} y1={n.y - spike * 0.7}
                          x2={n.x + spike * 0.7} y2={n.y + spike * 0.7}
                      stroke={A} strokeWidth="0.4"/>
                    <line x1={n.x + spike * 0.7} y1={n.y - spike * 0.7}
                          x2={n.x - spike * 0.7} y2={n.y + spike * 0.7}
                      stroke={A} strokeWidth="0.4"/>
                  </>}
                </g>
              )}

              {/* Greek letter designation */}
              {n.label && (
                <text
                  x={n.x + n.r + 6}
                  y={n.y - n.r - 6}
                  fill={A} opacity="0.6"
                  fontSize="10"
                  fontFamily="'JetBrains Mono', monospace"
                  letterSpacing="0.08em"
                >
                  {n.label}
                </text>
              )}

            </g>
          )
        })}

      </g>
    </svg>
  )
}
