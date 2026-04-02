'use client'
import { useState } from 'react'
import type { FormEvent } from 'react'

const services = [
  'Google Business Profile Management',
  'Local SEO',
  'Google Ads Management',
  'Google Local Services Ads',
  'Reputation Management',
  'Website Design & Build',
  'Full Growth Package',
  'Not sure — just want to talk',
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // TODO: wire to email/CRM when SendGrid is configured
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 4rem' }}>

        <div style={{ display: 'flex', gap: '6rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* LEFT — copy */}
          <div style={{ flex: '1 1 320px' }}>
            <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Free Audit
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, lineHeight: 1.05, color: '#fff', marginBottom: '1.5rem' }}>
              Let&apos;s See Where<br />
              <span style={{ color: '#333' }}>You Stand on Google.</span>
            </h1>
            <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '3rem' }}>
              Fill out the form and we&apos;ll run a full audit of your Google presence — your Business Profile, local rankings, reviews, and competitors. Free, no strings attached.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { t: 'Response Time', b: 'We respond to every inquiry within 1 business day.' },
                { t: 'No Sales Pressure', b: "The audit is genuinely free. We show you the data — you decide if you want our help." },
                { t: 'Industry Experience', b: 'We specialize in truck repair, diesel service, and heavy equipment businesses.' },
              ].map(item => (
                <div key={item.t} style={{ borderTop: '1px solid #111', paddingTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{item.t}</div>
                  <div style={{ fontSize: '0.83rem', color: '#444', lineHeight: 1.6 }}>{item.b}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid #111', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Us Directly</div>
              <a href="mailto:axiom@blacktopdigital.ai" style={{ color: '#666', fontSize: '0.88rem', textDecoration: 'none' }}>
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
                <p style={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  Expect to hear from us within 1 business day. In the meantime, we&apos;re already pulling your audit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={labelStyle}>First Name *</label>
                    <input required style={inputStyle} placeholder="John" />
                  </div>
                  <div style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={labelStyle}>Last Name *</label>
                    <input required style={inputStyle} placeholder="Smith" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>Business Name *</label>
                  <input required style={inputStyle} placeholder="Smith Truck Repair" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>Business Phone *</label>
                  <input required type="tel" style={inputStyle} placeholder="(555) 000-0000" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>Email *</label>
                  <input required type="email" style={inputStyle} placeholder="john@smithtruckrepair.com" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>City / State *</label>
                  <input required style={inputStyle} placeholder="Fort Smith, AR" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>What are you interested in?</label>
                  <select style={{ ...inputStyle, appearance: 'none' as const }}>
                    <option value="">Select a service...</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={labelStyle}>Anything else we should know?</label>
                  <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' as const }}
                    placeholder="Tell us about your business, your biggest challenge, or any questions you have." />
                </div>

                <button type="submit" disabled={loading} style={{
                  background: loading ? '#111' : '#fff',
                  color: loading ? '#444' : '#000',
                  border: 'none', padding: '1rem',
                  fontWeight: 800, fontSize: '0.85rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  borderRadius: '2px', marginTop: '0.5rem',
                  transition: 'background 0.2s',
                }}>
                  {loading ? 'Sending...' : 'Get My Free Audit →'}
                </button>

                <p style={{ color: '#2a2a2a', fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.5 }}>
                  No spam. No contracts. Just a free look at your Google presence.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #0f0f0f', padding: '2rem', textAlign: 'center', marginTop: '6rem' }}>
        <p style={{ color: '#2a2a2a', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          © 2026 Black Top Digital &nbsp;·&nbsp; blacktopdigital.ai &nbsp;·&nbsp; axiom@blacktopdigital.ai
        </p>
      </footer>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem', color: '#444',
  letterSpacing: '0.08em', textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  background: '#050505', border: '1px solid #1a1a1a',
  color: '#fff', padding: '0.75rem 1rem',
  fontSize: '0.9rem', borderRadius: '2px',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}
