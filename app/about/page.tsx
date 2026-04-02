import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Black Top Digital',
  description: 'Black Top Digital is an AI-powered local marketing agency built for the businesses that keep America moving.',
}

const values = [
  {
    t: 'Built for the Businesses Nobody Talks About',
    b: "The truck shops, the mechanics, the tradespeople. The ones who show up at 5am and don't leave until the job is done. They deserve marketing that works as hard as they do.",
  },
  {
    t: 'AI Without the Fluff',
    b: "We use AI the way it should be used — to do more in less time, find opportunities faster, and give every client the kind of attention that used to cost 10x more.",
  },
  {
    t: 'One Metric: Your Phone',
    b: "Impressions don't pay bills. Clicks don't pay bills. We measure one thing — calls to your business — and we optimize everything toward that number.",
  },
  {
    t: 'No Long Contracts. No Surprises.',
    b: "We earn your business every month. If we're not moving the needle, you shouldn't be paying us. It's that simple.",
  },
]

const process = [
  { n: '01', t: 'Free Audit', b: "We analyze your Google presence, your competitors, and your market. You get a clear picture of where you stand — no strings attached." },
  { n: '02', t: 'Strategy Call', b: "We walk you through exactly what's holding you back and what we'd do about it. Specific. Actionable. No vague promises." },
  { n: '03', t: 'We Get to Work', b: "Once you're in, we move fast. Most clients see meaningful changes in their Google presence within the first 30 days." },
  { n: '04', t: 'You Watch it Grow', b: "Monthly reports, direct access to your data, and a team that answers when you call. You always know exactly where things stand." },
]

export default function About() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ padding: '8rem 2rem 6rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          About Us
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.05, color: '#fff', marginBottom: '2rem' }}>
          We Built an Agency<br />
          <span style={{ color: '#333' }}>That Actually Fights For You.</span>
        </h1>
        <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '620px' }}>
          Black Top Digital was built from a simple observation: the businesses that do the hardest, most essential work — the truck shops, the repair yards, the service crews — are almost always invisible online. Not because their work isn't great. Because nobody showed them how to fix it.
        </p>
      </section>

      {/* DIVIDER */}
      <div style={{ borderTop: '1px solid #0f0f0f' }} />

      {/* MISSION */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '6rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 320px' }}>
          <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Mission</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>
            Level the playing field<br />
            <span style={{ color: '#333' }}>for local business.</span>
          </h2>
        </div>
        <div style={{ flex: '1 1 400px' }}>
          <p style={{ color: '#444', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
            Enterprise companies spend millions on marketing teams, agencies, and software. A local shop owner has none of that. Black Top Digital closes that gap — using AI to give small businesses the same firepower at a fraction of the cost.
          </p>
          <p style={{ color: '#333', fontSize: '0.95rem', lineHeight: 1.85 }}>
            We target industries where an extra 5 calls a week changes everything. Truck repair. Heavy equipment. Diesel service. The businesses that keep supply chains moving, job sites running, and America working.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: '6rem 2rem', background: '#030303', borderTop: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>How We Think</p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: '#fff', marginBottom: '3.5rem' }}>
            The Principles We Run On.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '3rem' }}>
            {values.map(v => (
              <div key={v.t} style={{ borderTop: '1px solid #111', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>{v.t}</h3>
                <p style={{ color: '#444', fontSize: '0.87rem', lineHeight: 1.7 }}>{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>How It Works</p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: '#fff', marginBottom: '3.5rem' }}>
            From Zero to Ranking.<br /><span style={{ color: '#333' }}>Here&apos;s the Process.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', background: '#0f0f0f' }}>
            {process.map(step => (
              <div key={step.n} style={{ background: '#000', padding: '2.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111', marginBottom: '1rem', fontVariantNumeric: 'tabular-nums' }}>{step.n}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>{step.t}</h3>
                <p style={{ color: '#444', fontSize: '0.87rem', lineHeight: 1.7 }}>{step.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderTop: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f', padding: '3rem 2rem', background: '#030303' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { v: '87%', l: 'of customers find local businesses online' },
            { v: '3x', l: 'more calls from optimized GBP listings' },
            { v: '30 days', l: 'to measurable ranking improvements' },
            { v: '100%', l: 'transparent reporting, always' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center', maxWidth: '180px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>{s.v}</div>
              <div style={{ fontSize: '0.72rem', color: '#444', lineHeight: 1.5, marginTop: '0.4rem', letterSpacing: '0.05em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ color: '#333', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Let&apos;s Talk</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Ready to See What&apos;s Possible?
          </h2>
          <p style={{ color: '#444', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Start with a free audit. No commitment, no pressure — just a clear look at your Google presence and what we&apos;d do to grow it.
          </p>
          <Link href="/contact" style={{
            background: '#fff', color: '#000', padding: '1rem 3rem',
            fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px', display: 'inline-block',
          }}>
            Get My Free Audit
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #0f0f0f', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#2a2a2a', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          © 2026 Black Top Digital &nbsp;·&nbsp; blacktopdigital.ai &nbsp;·&nbsp; axiom@blacktopdigital.ai
        </p>
      </footer>
    </div>
  )
}
