export default function LycaonSymbol({ size = 100, theme = "dark" }) {
  const amber = "#D4891E"
  const teal  = theme === "light" ? "#0FA88A" : "#1EC8A8"
  const uid   = `ls${theme}`
  const w     = size
  const h     = Math.round(size * 0.72)

  return (
    <svg
      width={w}
      height={h}
      viewBox="-10 10 360 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LYCAON"
      role="img"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker id={`tip-${uid}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M1 1L9 5L1 9" fill="none" stroke={amber}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <style>{`
          @keyframes ${uid}flicker {
            0%,100%{opacity:1}14%{opacity:0.4}16%{opacity:0.95}17%{opacity:0.3}18%{opacity:1}59%{opacity:1}61%{opacity:0.45}63%{opacity:0.9}
          }
          @keyframes ${uid}flickerRing {
            0%,100%{opacity:0.6}14%{opacity:0.15}18%{opacity:0.7}60%{opacity:0.35}63%{opacity:0.65}
          }
          @keyframes ${uid}flickerOuter {
            0%,100%{opacity:0.25}30%{opacity:0.55}60%{opacity:0.12}80%{opacity:0.42}
          }
          @keyframes ${uid}originC {
            0%,100%{opacity:0.6}44%,56%{opacity:1}
          }
          @keyframes ${uid}originR {
            0%,100%{opacity:0.35}44%,56%{opacity:0.92}
          }
          @keyframes ${uid}scout {
            0%,100%{opacity:0.55}50%{opacity:0.9}
          }
          @keyframes ${uid}foresight {
            0%,33%{stroke-dashoffset:160;opacity:0}
            55%{stroke-dashoffset:0;opacity:1}
            88%{stroke-dashoffset:0;opacity:1}
            100%{stroke-dashoffset:0;opacity:0.55}
          }
          @keyframes ${uid}field {
            0%,100%{opacity:0}20%,80%{opacity:0.3}
          }
          .${uid}fc  { animation:${uid}flicker      5.5s ease-in-out infinite }
          .${uid}fr  { animation:${uid}flickerRing  5.5s ease-in-out infinite }
          .${uid}fo  { animation:${uid}flickerOuter 5.5s ease-in-out infinite }
          .${uid}oc  { animation:${uid}originC      5.5s ease-in-out infinite }
          .${uid}or  { animation:${uid}originR      5.5s ease-in-out infinite }
          .${uid}sc  { animation:${uid}scout 4s ease-in-out infinite }
          .${uid}sc:nth-of-type(2){animation-delay:0.7s}
          .${uid}sc:nth-of-type(3){animation-delay:1.4s}
          .${uid}sc:nth-of-type(4){animation-delay:2.1s}
          .${uid}sc:nth-of-type(5){animation-delay:2.8s}
          .${uid}fv  { stroke-dasharray:160; animation:${uid}foresight 5.5s ease-in-out infinite }
          .${uid}fl  { animation:${uid}field 5.5s ease-in-out infinite }
          .${uid}fl:nth-of-type(2){animation-delay:0.4s}
          .${uid}fl:nth-of-type(3){animation-delay:0.8s}
        `}</style>
        <path id={`s1-${uid}`} d="M12,22 Q80,60 158,124"/>
        <path id={`s2-${uid}`} d="M5,95 Q80,100 158,126"/>
        <path id={`fp-${uid}`} d="M163,125 Q240,108 313,93"/>
      </defs>

      {/* Scout nodes */}
      <circle className={`${uid}sc`} cx="12"  cy="22"  r="7"   fill="none" stroke={amber} strokeWidth="2"/>
      <circle className={`${uid}sc`} cx="5"   cy="95"  r="5.5" fill="none" stroke={amber} strokeWidth="2"/>
      <circle className={`${uid}sc`} cx="22"  cy="170" r="4"   fill="none" stroke={amber} strokeWidth="2"/>
      <circle className={`${uid}sc`} cx="55"  cy="215" r="6"   fill="none" stroke={amber} strokeWidth="2"/>
      <circle className={`${uid}sc`} cx="92"  cy="52"  r="5"   fill="none" stroke={amber} strokeWidth="2"/>

      {/* Teal field lines */}
      <path className={`${uid}fl`} d="M12,22 Q55,10 92,52"  fill="none" stroke={teal} strokeWidth="0.9"/>
      <path className={`${uid}fl`} d="M5,95 Q30,80 92,52"   fill="none" stroke={teal} strokeWidth="0.9"/>
      <path className={`${uid}fl`} d="M5,95 Q15,130 22,170" fill="none" stroke={teal} strokeWidth="0.9"/>

      {/* Curved signal paths */}
      <path fill="none" stroke={amber} strokeWidth="1" strokeOpacity="0.4" d="M12,22 Q80,60 155,124"/>
      <path fill="none" stroke={amber} strokeWidth="1" strokeOpacity="0.45" d="M5,95 Q80,100 155,126"/>
      <path fill="none" stroke={amber} strokeWidth="1" strokeOpacity="0.32" d="M22,170 Q90,155 155,130"/>
      <path fill="none" stroke={amber} strokeWidth="1" strokeOpacity="0.36" d="M55,215 Q110,175 157,132"/>
      <path fill="none" stroke={amber} strokeWidth="1" strokeOpacity="0.34" d="M92,52 Q125,80 155,122"/>

      {/* Signal dot 1 */}
      <circle r="4" fill={amber}>
        <animate attributeName="opacity" values="0;0;1;0.9;0" keyTimes="0;0.05;0.12;0.40;0.46" dur="5.5s" repeatCount="indefinite"/>
        <animateMotion dur="5.5s" repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.05;0.40;1" keySplines="0 0 1 1;0.4 0 0.6 1;0 0 0 0">
          <mpath href={`#s1-${uid}`}/>
        </animateMotion>
      </circle>

      {/* Signal dot 2 */}
      <circle r="3" fill={amber}>
        <animate attributeName="opacity" values="0;0;0.8;0.6;0" keyTimes="0;0.10;0.18;0.42;0.48" dur="5.5s" repeatCount="indefinite"/>
        <animateMotion dur="5.5s" repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.10;0.42;1" keySplines="0 0 1 1;0.4 0 0.6 1;0 0 0 0">
          <mpath href={`#s2-${uid}`}/>
        </animateMotion>
      </circle>

      {/* Origin node */}
      <circle className={`${uid}or`} cx="158" cy="128" r="14" fill="none" stroke={amber} strokeWidth="1.2"/>
      <circle className={`${uid}oc`} cx="158" cy="128" r="7"  fill="none" stroke={amber} strokeWidth="2.2"/>
      <circle cx="158" cy="128" r="3.5" fill={amber}/>

      {/* Uncertainty envelope */}
      <line x1="163" y1="120" x2="313" y2="80"  stroke={amber} strokeWidth="0.6" strokeOpacity="0.22"/>
      <line x1="163" y1="133" x2="313" y2="110" stroke={amber} strokeWidth="0.6" strokeOpacity="0.22"/>

      {/* Foresight vector */}
      <line className={`${uid}fv`} x1="163" y1="125" x2="308" y2="94"
        stroke={amber} strokeWidth="2.5" markerEnd={`url(#tip-${uid})`}/>

      {/* Foresight dot */}
      <circle r="4.5" fill={amber}>
        <animate attributeName="opacity" values="0;0;0;1;1;0.2;0"
          keyTimes="0;0.33;0.40;0.46;0.84;0.92;1" dur="5.5s" repeatCount="indefinite"/>
        <animateMotion dur="5.5s" repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.40;0.88;1" keySplines="0 0 0 0;0.2 0 0.3 1;0 0 0 0">
          <mpath href={`#fp-${uid}`}/>
        </animateMotion>
      </circle>

      {/* Future point – flickering */}
      <circle className={`${uid}fo`} cx="318" cy="93" r="25" fill="none" stroke={amber} strokeWidth="0.6"/>
      <circle className={`${uid}fr`} cx="318" cy="93" r="16" fill="none" stroke={amber} strokeWidth="1.2"/>
      <circle className={`${uid}fc`} cx="318" cy="93" r="6"  fill={amber}/>
    </svg>
  )
}
