'use client'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { trackLead } from '@/lib/track'
import { getAttribution } from '@/lib/attribution'
import { PHONE_ERROR, normalisePhone } from '@/lib/phone'
import QualifyFlow from '@/components/QualifyFlow'

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem', color: '#aaaaaa',
  letterSpacing: '0.08em', textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  background: '#050505', border: '1px solid #333',
  color: '#fff', padding: '0.85rem 1rem',
  fontSize: '1rem', borderRadius: '2px',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

// Short "Get Started" form: texts Weston through the same route as the chat widget.
export default function GetStartedForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [business, setBusiness] = useState('')
  const [trap, setTrap] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [leadId, setLeadId] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Enter your name.')
      return
    }
    if (!normalisePhone(phone)) {
      setError(PHONE_ERROR)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, business, website: trap, formId: 'form_get_started', attribution: getAttribution() }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json().catch(() => ({}))
      // The lead is already stored and texted at this point; nothing below can undo that.
      trackLead(data.leadId)
      setLeadId(typeof data.leadId === 'string' ? data.leadId : '')
      setSubmitted(true)
    } catch {
      setError('Couldn’t send. Call or text us at (479) 888-5621.')
    } finally {
      setLoading(false)
    }
  }

  // Lead is in. Roll straight into the three-question flow, which updates this same lead.
  // Without a Lead ID (honeypot, or the store and SMS both hiccuped) fall back to the plain
  // thank-you, so a bot never reaches the flow and a real person never sees a broken one.
  if (submitted && leadId) {
    return <QualifyFlow leadId={leadId} firstName={name.trim().split(' ')[0]} />
  }

  if (submitted) {
    return (
      <div style={{ border: '1px solid #222', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>✓</div>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.75rem' }}>
          Got it, {name.trim().split(' ')[0]}. We&apos;ll be in touch soon.
        </h2>
        <p style={{ color: '#b8b8b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Need us sooner? Call or text{' '}
          <a href="tel:+14798885621" data-cta="cta_phone_get_started_success" style={{ color: '#fff', fontWeight: 700, textDecoration: 'none' }}>(479) 888-5621</a>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label htmlFor="gs-name" style={labelStyle}>Your Name</label>
        <input id="gs-name" value={name} onChange={e => setName(e.target.value)} autoComplete="name"
          maxLength={60} placeholder="John Smith" style={inputStyle} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label htmlFor="gs-phone" style={labelStyle}>Phone Number</label>
        <input id="gs-phone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" autoComplete="tel"
          maxLength={20} placeholder="(555) 000-0000" style={inputStyle} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label htmlFor="gs-business" style={labelStyle}>Business Name <span style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <input id="gs-business" value={business} onChange={e => setBusiness(e.target.value)} autoComplete="organization"
          maxLength={80} placeholder="Smith Truck Repair" style={inputStyle} />
      </div>
      <input value={trap} onChange={e => setTrap(e.target.value)} name="website" tabIndex={-1} autoComplete="off"
        aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
      {error && <div style={{ color: '#ff8080', fontSize: '0.9rem' }}>{error}</div>}
      <button type="submit" disabled={loading} className="btn btn-primary" style={{
        width: '100%', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1,
      }}>
        {loading ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}
