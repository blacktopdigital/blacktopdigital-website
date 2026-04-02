import Image from 'next/image'
import Link from 'next/link'

const services = [
  { title: 'Google Business Profile', desc: 'Dominate the local map pack. We optimize and manage your GBP so your business shows up first when customers search.', price: '$299/mo' },
  { title: 'Local SEO', desc: 'Rank higher on Google for the searches that matter. Keywords, content, and citations built for your city.', price: '$599/mo' },
  { title: 'Google Ads Management', desc: 'Every dollar tracked. We build and manage campaigns that drive calls — not just clicks.', price: '$499/mo + spend' },
  { title: 'Google Local Services Ads', desc: 'Show up at the very top of Google as a verified local business. Pay per lead, not per click.', price: '$399/mo' },
  { title: 'Website Design & Build', desc: 'A site built to convert — fast, mobile-first, and engineered to rank. No templates, no shortcuts.', price: '$1,500 one-time' },
  { title: 'Reputation Management', desc: 'Automated review generation and monitoring. More 5-star reviews, fewer surprises.', price: '$199/mo' },
]

export default function Home() {
  return (
    <div style={{ background: '#000' }}>

      {/* HERO */}
      <section style={{
        minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center',
        padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto',
        gap: '4rem', flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 400px' }}>
          <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Black Top Digital · AI-Powered Marketing
          </p>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.5rem', color: '#fff' }}>
            AI-Powered Local Marketing<br />
            <span style={{ color: '#444' }}>That Gets Your</span>{' '}
            Phone Ringing.
          </h1>
          <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '500px' }}>
            We use artificial intelligence to dominate Google rankings, optimize your Business Profile, and run ads that actually convert — for local businesses ready to grow.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{
              background: '#fff', color: '#000', padding: '0.9rem 2rem',
              fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px',
              display: 'inline-block',
            }}>
              Get a Free Audit
            </Link>
            <Link href="/services" style={{
              border: '1px solid #2a2a2a', color: '#aaa', padding: '0.9rem 2rem',
              fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px',
              display: 'inline-block',
            }}>
              View Services
            </Link>
          </div>
        </div>
        <div style={{ flex: '0 0 400px', display: 'flex', justifyContent: 'center' }}>
          <Image src="/robot-black-bg.png" alt="Black Top Digital AI" width={400} height={400}
            style={{ objectFit: 'contain', width: '100%', height: 'auto' }} priority />
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderTop: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { v: 'AI', l: 'Powered' }, { v: '24/7', l: 'Monitoring' },
            { v: '100%', l: 'Transparent' }, { v: 'Local', l: 'Focused' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{s.v}</div>
              <div style={{ fontSize: '0.7rem', color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.3rem' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES GRID */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>What We Do</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '3rem' }}>
            Everything Your Business Needs<br /><span style={{ color: '#333' }}>to Own Google.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: '#0f0f0f' }}>
            {services.map(s => (
              <div key={s.title} style={{ background: '#000', padding: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>{s.desc}</p>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#666' }}>From {s.price}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link href="/services" style={{
              border: '1px solid #1a1a1a', color: '#777', padding: '0.85rem 2.5rem',
              fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px', display: 'inline-block',
            }}>See Full Pricing →</Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: '6rem 2rem', background: '#030303', borderTop: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Why Black Top Digital</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '3rem' }}>
            We Don&apos;t Just Report Numbers.<br /><span style={{ color: '#333' }}>We Move Them.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2.5rem' }}>
            {[
              { t: 'Industry-Specific', b: "We speak your customers' language. We know your industry, your slow seasons, and your competition." },
              { t: 'Full Transparency', b: "Every campaign, keyword, and dollar visible in your portal at all times. No mystery invoices." },
              { t: 'AI-Powered Speed', b: "Our AI runs audits, generates content, and monitors rankings 24/7 — faster than any human team." },
              { t: 'Results or Nothing', b: "We focus on one metric: calls to your business. Not impressions. Not traffic. Calls." },
            ].map(item => (
              <div key={item.t} style={{ borderTop: '1px solid #111', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>{item.t}</h3>
                <p style={{ color: '#444', fontSize: '0.87rem', lineHeight: 1.65 }}>{item.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ color: '#333', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Ready to Grow?</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Your Competitors Are Already<br />on Page One.
          </h2>
          <p style={{ color: '#444', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Get a free audit and see exactly where you stand — and what it will take to dominate your market.
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
