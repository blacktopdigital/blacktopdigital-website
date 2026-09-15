import Link from 'next/link'
import GrowthGraphic from '@/components/GrowthGraphic'
import ChatWidget, { ChatNowButton } from '@/components/ChatWidget'

const industries = [
  { title: 'Truck & Trailer Repair', desc: 'Breakdowns don’t wait. Be the first shop drivers find.' },
  { title: 'Towing & Roadside', desc: 'Stranded drivers call whoever shows up first on the map.' },
  { title: 'Diesel & Heavy Equipment', desc: 'Fleets and contractors who need their rigs back running.' },
  { title: 'Plumbers', desc: 'Burst pipes and backed-up drains at 2am.' },
  { title: 'Electricians', desc: 'Outages, panel failures, and emergency repairs.' },
  { title: 'HVAC', desc: 'No heat in January. No AC in July.' },
  { title: 'Roofing', desc: 'Storm damage and leaks that can’t wait.' },
  { title: 'Water & Fire Restoration', desc: 'Flooded basements and fire damage cleanup.' },
  { title: 'Locksmiths', desc: 'Lockouts that need someone there now.' },
  { title: 'Garage Door Repair', desc: 'Broken springs and doors stuck shut.' },
  { title: 'Septic & Drain', desc: 'The calls nobody wants to wait on.' },
  { title: 'Auto Repair', desc: 'Local shops going up against dealers and chains.' },
]

const services = [
  { title: 'Google Business Profile', desc: 'Dominate the local map pack. We optimize and manage your GBP so your business shows up first when customers search.' },
  { title: 'Local SEO', desc: 'Rank higher on Google for the searches that matter. Keywords, content, and citations built for your city.' },
  { title: 'Website Design & Build', desc: 'A site built to convert — fast, mobile-first, and engineered to rank. No templates, no shortcuts.' },
  { title: 'Reputation Management', desc: 'Automated review generation and monitoring. More 5-star reviews, fewer surprises.' },
]

function CallButton() {
  return (
    <a href="tel:+14798885621" className="btn btn-secondary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
        <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />
      </svg>
      Call (479) 888-5621
    </a>
  )
}

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
          <p style={{ color: '#aaaaaa', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Black Top Digital · Local Marketing
          </p>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.5rem', color: '#fff' }}>
            Show Up First on Google.<br />
            <span style={{ color: '#aaaaaa' }}>Get Your</span>{' '}
            Phone Ringing.
          </h1>
          <p style={{ color: '#b8b8b8', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '520px' }}>
            We use powerful tools to keep you at the top of Google and ranked above your competitors, so when customers search for what you do, they find you first and call you. Built for truck repair shops, plumbers, electricians, and every local business that runs on phone calls.
          </p>
          <div className="btn-row">
            <ChatNowButton solid />
            <CallButton />
            <Link href="/services" className="btn btn-secondary">View Services</Link>
          </div>
        </div>
        <div style={{ flex: '0 1 400px', maxWidth: '100%', display: 'flex', justifyContent: 'center' }}>
          <GrowthGraphic />
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderTop: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { v: '24/7', l: 'Rank Tracking' }, { v: '100%', l: 'Transparent' },
            { v: '0', l: 'Long-Term Contracts' }, { v: 'Local', l: 'Focused' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{s.v}</div>
              <div style={{ fontSize: '0.7rem', color: '#aaaaaa', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.3rem' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* INDUSTRIES */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#aaaaaa', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Industries We Serve</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '1.25rem' }}>
            Built for the Businesses<br /><span style={{ color: '#9a9a9a' }}>That Answer the Call.</span>
          </h2>
          <p style={{ color: '#b8b8b8', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem', maxWidth: '640px' }}>
            When a truck breaks down or a pipe bursts, people grab their phone and search Google. We make sure the hard-working, emergency service businesses in your town are the ones they call.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: '1px', background: '#0f0f0f' }}>
            {industries.map(i => (
              <div key={i.title} style={{ background: '#000', padding: '1.6rem 1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.45rem' }}>{i.title}</h3>
                <p style={{ color: '#aaaaaa', fontSize: '0.88rem', lineHeight: 1.6 }}>{i.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <p style={{ color: '#b8b8b8', fontSize: '0.95rem' }}>
              Don&apos;t see your trade? No problem. If your customers look for you on Google, we&apos;ll help you get found.
            </p>
            <ChatNowButton />
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section style={{ padding: '6rem 2rem', background: '#030303', borderTop: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#aaaaaa', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>What We Do</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '3rem' }}>
            Everything Your Business Needs<br /><span style={{ color: '#9a9a9a' }}>to Own Google.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1px', background: '#0f0f0f' }}>
            {services.map(s => (
              <div key={s.title} style={{ background: '#000', padding: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ color: '#aaaaaa', fontSize: '0.88rem', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link href="/services" className="btn btn-secondary">See All Services →</Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: '6rem 2rem', borderTop: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#aaaaaa', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Why Black Top Digital</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '3rem' }}>
            We Don&apos;t Just Report Numbers.<br /><span style={{ color: '#9a9a9a' }}>We Move Them.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '2.5rem' }}>
            {[
              { t: 'Industry-Specific', b: "We speak your customers' language. We know your industry, your slow seasons, and your competition." },
              { t: 'Full Transparency', b: "A plain-English report every month showing where you rank and how your reviews are growing. No mystery invoices." },
              { t: 'Always a Step Ahead', b: "We watch your rankings and your competitors around the clock and move fast when something changes, so you stay on top." },
              { t: 'Results or Nothing', b: "We focus on one metric: calls to your business. Not impressions. Not traffic. Calls." },
            ].map(item => (
              <div key={item.t} style={{ borderTop: '1px solid #111', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>{item.t}</h3>
                <p style={{ color: '#aaaaaa', fontSize: '0.87rem', lineHeight: 1.65 }}>{item.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', background: '#030303', borderTop: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ color: '#9a9a9a', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Ready to Grow?</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Your Competitors Are Already<br />on Page One.
          </h2>
          <p style={{ color: '#aaaaaa', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Tell us about your business and we&apos;ll show you exactly what it takes to own your market.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <ChatNowButton solid />
            <CallButton />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #0f0f0f', padding: '2rem 2rem 7rem', textAlign: 'center' }}>
        <p style={{ color: '#9a9a9a', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          © 2026 Black Top Digital &nbsp;·&nbsp; <a href="tel:+14798885621" style={{ color: 'inherit', textDecoration: 'none' }}>(479) 888-5621</a> &nbsp;·&nbsp; axiom@blacktopdigital.ai
        </p>
      </footer>

      <ChatWidget />
    </div>
  )
}
