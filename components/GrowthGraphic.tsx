// Hero graphic: bars rise one by one, a trend line draws up to an arrow, the top bar is #1.
const BAR_W = 44
const BAR_GAP = 18
const BASE_Y = 370
const HEIGHTS = [70, 105, 140, 185, 235, 290]
const START_X = (420 - (HEIGHTS.length * BAR_W + (HEIGHTS.length - 1) * BAR_GAP)) / 2

const bars = HEIGHTS.map((h, i) => ({ x: START_X + i * (BAR_W + BAR_GAP), top: BASE_Y - h, h }))
const trend = bars.map(b => `${b.x + BAR_W / 2},${b.top - 22}`).join(' ') + ' 385,37'
const last = bars[bars.length - 1]

const css = `
  .gg-bar { transform-box: fill-box; transform-origin: 50% 100%; animation: ggRise 0.9s cubic-bezier(.2,.8,.2,1) both; }
  .gg-line { stroke-dasharray: 520; stroke-dashoffset: 520; animation: ggDraw 1.1s 0.9s ease-out forwards; }
  .gg-fade { opacity: 0; animation: ggFade 0.5s 1.8s forwards; }
  @keyframes ggRise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  @keyframes ggDraw { to { stroke-dashoffset: 0; } }
  @keyframes ggFade { to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) {
    .gg-bar, .gg-line, .gg-fade { animation: none; stroke-dashoffset: 0; opacity: 1; }
  }
`

export default function GrowthGraphic() {
  return (
    <svg viewBox="0 0 420 420" role="img" aria-label="Bar chart rising to number one"
      style={{ width: '100%', height: 'auto', display: 'block' }}>
      <style>{css}</style>
      <defs>
        <linearGradient id="gg-fade-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="gg-top-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#9a9a9a" />
        </linearGradient>
        <radialGradient id="gg-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="gg-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Kept inside the viewBox so the glow fades out instead of clipping to a square. */}
      <circle cx="300" cy="125" r="115" fill="url(#gg-halo)" />

      {[60, 120, 180, 240, 300].map(y => (
        <line key={y} x1="20" x2="400" y1={y} y2={y} stroke="#161616" strokeWidth="1" />
      ))}
      <line x1="20" x2="400" y1={BASE_Y} y2={BASE_Y} stroke="#333" strokeWidth="1.5" />

      {bars.map((b, i) => {
        const isTop = i === bars.length - 1
        return (
          <rect key={i} className="gg-bar" x={b.x} y={b.top} width={BAR_W} height={b.h} rx="4"
            fill={isTop ? 'url(#gg-top-bar)' : 'url(#gg-fade-bar)'}
            stroke={isTop ? 'none' : 'rgba(255,255,255,0.25)'} strokeWidth="1"
            filter={isTop ? 'url(#gg-glow)' : undefined}
            style={{ animationDelay: `${i * 0.12}s` }} />
        )
      })}

      <text className="gg-fade" x={last.x + BAR_W / 2} y={last.top + 32} textAnchor="middle"
        fontSize="18" fontWeight="900" fill="#000" style={{ fontFamily: 'inherit' }}>#1</text>

      <polyline className="gg-line" points={trend} fill="none" stroke="#fff" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" filter="url(#gg-glow)" />
      <path className="gg-fade" d="M396 26 L392 42 L380 31 Z" fill="#fff" filter="url(#gg-glow)" />
      {bars.map((b, i) => (
        <circle key={i} className="gg-fade" cx={b.x + BAR_W / 2} cy={b.top - 22} r="4.5"
          fill="#000" stroke="#fff" strokeWidth="2" />
      ))}
    </svg>
  )
}
