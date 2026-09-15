import Image from 'next/image'

// Soft-edge the photo so the shoulders fade into the page instead of ending in a hard crop.
const MASK = 'radial-gradient(ellipse 58% 60% at 50% 40%, #000 55%, transparent 100%)'

// Services page header: a whispered "Shhh…" headline beside the shushing robot, cut into the black page.
export default function ShhhBand() {
  return (
    <section style={{ background: '#000', overflow: 'hidden' }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '3rem clamp(1rem, 4vw, 2rem) 1rem',
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem 2rem',
      }}>
        <h1 style={{
          flex: '1 1 420px', color: '#fff', fontWeight: 900, lineHeight: 0.98,
          fontSize: 'clamp(2.6rem, 6.2vw, 5.2rem)', letterSpacing: '-0.02em',
        }}>
          <span style={{
            display: 'block', fontSize: '0.58em', fontWeight: 700, fontStyle: 'italic',
            color: '#b8b8b8', letterSpacing: '0.01em', marginBottom: '0.3em',
          }}>
            Shhh…
          </span>
          we&apos;re fixing to outrank your competition.
        </h1>

        <div style={{ flex: '1 1 360px', position: 'relative', maxWidth: '560px', margin: '0 auto' }}>
          <div aria-hidden="true" style={{
            position: 'absolute', inset: '8% 4% 4%', borderRadius: '50%', filter: 'blur(24px)',
            background: 'radial-gradient(closest-side, rgba(124,58,237,0.5), rgba(124,58,237,0.15) 60%, transparent)',
          }} />
          {/* lighten lets the purple glow show through the photo's black background, not over the robot */}
          <Image src="/robot-shh.png" alt="Robot holding a finger to its lips: shhh" width={1254} height={1254}
            priority sizes="(max-width: 800px) 92vw, 560px"
            style={{
              position: 'relative', width: '100%', height: 'auto', display: 'block', mixBlendMode: 'lighten',
              WebkitMaskImage: MASK, maskImage: MASK,
            }} />
        </div>
      </div>
    </section>
  )
}
