'use client'
import { useState } from 'react'
import type { FormEvent } from 'react'

const services = [
  'Google Business Profile Management',
  'Local SEO',
  'Reputation Management',
  'Website Design & Build',
  'Full Growth Package',
  'Not sure — just want to talk',
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Texts the lead to Weston through the same route as the chat widget.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fields = Object.fromEntries(new FormData(e.currentTarget))
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, source: 'form' }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Couldn’t send. Call or text us at (479) 888-5621.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 4rem' }}>

        <div style={{ display: 'flex', gap: '6rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* LEFT — copy */}
          <div style={{ flex: '1 1 320px' }}>
            <p style={{ color: '#aaaaaa', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Contact Us
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, lineHeight: 1.05, color: '#fff', marginBottom: '1.5rem' }}>
              Let&apos;s Talk About<br />
              <span style={{ color: '#9a9a9a' }}>Your Business.</span>
            </h1>
            <p style={{ color: '#b8b8b8', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '3rem' }}>
              Call or text us at (479) 888-5621, or fill out the form and we&apos;ll reach out shortly. Tell us a little about your business and we&apos;ll show you exactly how we&apos;d get your phone ringing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { t: 'Response Time', b: 'We’ll reach out shortly after you get in touch.' },
                { t: 'No Sales Pressure', b: "We'll show you where you stand on Google and what we'd do about it. You decide what's next." },
                { t: 'Industry Experience', b: 'We know truck repair, the trades, and emergency service businesses inside and out, and we bring that same playbook to local businesses of every kind.' },
              ].map(item => (
                <div key={item.t} style={{ borderTop: '1px solid #111', paddingTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{item.t}</div>
                  <div style={{ fontSize: '0.83rem', color: '#aaaaaa', lineHeight: 1.6 }}>{item.b}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid #111', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#9a9a9a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Call Us</div>
              <a href="tel:+14798885621" style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none' }}>
                (479) 888-5621
              </a>
              <div style={{ fontSize: '0.75rem', color: '#9a9a9a', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '1.5rem 0 0.5rem' }}>Email Us Directly</div>
              <a href="mailto:axiom@blacktopdigital.ai" style={{ color: '#c4c4c4', fontSize: '0.88rem', textDecoration: 'none' }}>
                axiom@blacktopdigital.ai
              </a>
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{ flex: '1 1 400px' }}>
            {submitted ? (
              <div style={{ border: '1px solid #111', padding: '4rem 3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.75rem' }}>Got it — we&apos;ll be in touch.</h2>
                <p style={{ color: '#aaaaaa', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  We&apos;ll reach out shortly. Want to talk now? Call or text (479) 888-5621.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={labelStyle}>First Name *</label>
                    <input required name="firstName" autoComplete="given-name" style={inputStyle} placeholder="John" />
                  </div>
                  <div style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={labelStyle}>Last Name *</label>
                    <input required name="lastName" autoComplete="family-name" style={inputStyle} placeholder="Smith" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>Business Name *</label>
                  <input required name="business" autoComplete="organization" style={inputStyle} placeholder="Smith Truck Repair" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>Business Phone *</label>
                  <input required name="phone" type="tel" autoComplete="tel" style={inputStyle} placeholder="(555) 000-0000" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>Email *</label>
                  <input required name="email" type="email" autoComplete="email" style={inputStyle} placeholder="john@smithtruckrepair.com" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>City / State *</label>
                  <input required name="city" style={inputStyle} placeholder="Fort Smith, AR" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>What are you interested in?</label>
                  <select name="service" style={{ ...inputStyle, appearance: 'none' as const }}>
                    <option value="">Select a service...</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>Anything else we should know?</label>
                  <textarea name="message" rows={4} style={{ ...inputStyle, resize: 'vertical' as const }}
                    placeholder="Tell us about your business, your biggest challenge, or any questions you have." />
                </div>

                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
                {error && <div style={{ color: '#ff8080', fontSize: '0.9rem' }}>{error}</div>}

                <button type="submit" disabled={loading} className="btn btn-primary" style={{
                  width: '100%', marginTop: '0.5rem', opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer',
                }}>
                  {loading ? 'Sending...' : 'Submit'}
                </button>

                <p style={{ color: '#9a9a9a', fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.5 }}>
                  No spam. No contracts. Just a free look at your Google presence.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #0f0f0f', padding: '2rem', textAlign: 'center', marginTop: '6rem' }}>
        <p style={{ color: '#9a9a9a', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          © 2026 Black Top Digital &nbsp;·&nbsp; <a href="tel:+14798885621" style={{ color: 'inherit', textDecoration: 'none' }}>(479) 888-5621</a> &nbsp;·&nbsp; axiom@blacktopdigital.ai
        </p>
      </footer>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem', color: '#aaaaaa',
  letterSpacing: '0.08em', textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  background: '#050505', border: '1px solid #1a1a1a',
  color: '#fff', padding: '0.75rem 1rem',
  fontSize: '0.9rem', borderRadius: '2px',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}
