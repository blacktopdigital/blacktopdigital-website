'use client'

import { useEffect, useRef, useState } from 'react'

type Msg = { from: 'bot' | 'user'; text: string }
type Step = 'message' | 'contact' | 'sending' | 'done'

const GREETING = 'Hey there. Got a question about getting more calls from Google? Send us a message.'
const ASK_CONTACT = 'Thanks! Want more info? Leave your name and number and we’ll reach out shortly.'

const input: React.CSSProperties = {
  width: '100%', background: '#000', border: '1px solid #222', borderRadius: '6px',
  color: '#fff', padding: '0.7rem 0.8rem', fontSize: '0.9rem', outline: 'none',
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: GREETING }])
  const [step, setStep] = useState<Step>('message')
  const [draft, setDraft] = useState('')
  const [question, setQuestion] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [business, setBusiness] = useState('')
  const [trap, setTrap] = useState('')
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setTeaser(true), 6000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, step, open])

  function toggle() {
    setOpen(o => !o)
    setTeaser(false)
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setQuestion(text)
    setDraft('')
    setMsgs(m => [...m, { from: 'user', text }, { from: 'bot', text: ASK_CONTACT }])
    setStep('contact')
  }

  async function sendContact(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Enter your name and a 10-digit phone number.')
      return
    }
    setError('')
    setStep('sending')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, business, message: question, website: trap }),
      })
      if (!res.ok) throw new Error()
      setMsgs(m => [...m, { from: 'bot', text: `Got it, ${name.trim().split(' ')[0]}. We’ll be in touch soon.` }])
      setStep('done')
    } catch {
      setError('Couldn’t send. Email us at axiom@blacktopdigital.ai.')
      setStep('contact')
    }
  }

  return (
    <>
      {open && (
        <div role="dialog" aria-label="Chat with Black Top Digital" style={{
          position: 'fixed', right: '16px', bottom: '92px', zIndex: 1000,
          width: 'min(360px, calc(100vw - 32px))', height: 'min(500px, calc(100vh - 120px))',
          background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        }}>
          <div style={{ padding: '1rem 1.1rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <img src="/logo.svg" alt="" width={30} height={30} />
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.92rem' }}>Black Top Digital</div>
              <div style={{ color: '#555', fontSize: '0.75rem' }}>We usually reply the same day</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%',
                background: m.from === 'user' ? '#fff' : '#161616', color: m.from === 'user' ? '#000' : '#ccc',
                padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.88rem', lineHeight: 1.5,
                whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
              }}>{m.text}</div>
            ))}
            <div ref={endRef} />
          </div>

          <div style={{ borderTop: '1px solid #1a1a1a', padding: '0.8rem' }}>
            {step === 'message' && (
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type your message..."
                  aria-label="Your message" maxLength={400} autoFocus style={input} />
                <button type="submit" style={{
                  background: '#fff', color: '#000', border: 'none', borderRadius: '6px',
                  padding: '0 1rem', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                }}>Send</button>
              </form>
            )}
            {(step === 'contact' || step === 'sending') && (
              <form onSubmit={sendContact} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                  aria-label="Your name" autoComplete="name" maxLength={60} autoFocus style={input} />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number"
                  aria-label="Phone number" type="tel" autoComplete="tel" maxLength={20} style={input} />
                <input value={business} onChange={e => setBusiness(e.target.value)} placeholder="Business name (optional)"
                  aria-label="Business name" autoComplete="organization" maxLength={80} style={input} />
                <input value={trap} onChange={e => setTrap(e.target.value)} name="website" tabIndex={-1}
                  autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
                {error && <div style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{error}</div>}
                <button type="submit" disabled={step === 'sending'} style={{
                  background: '#fff', color: '#000', border: 'none', borderRadius: '6px', padding: '0.8rem',
                  fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: step === 'sending' ? 'wait' : 'pointer', opacity: step === 'sending' ? 0.6 : 1,
                }}>{step === 'sending' ? 'Sending...' : 'Get More Info'}</button>
              </form>
            )}
            {step === 'done' && (
              <div style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', padding: '0.4rem' }}>
                Message sent. We&apos;ll reach out soon.
              </div>
            )}
          </div>
        </div>
      )}

      {teaser && !open && (
        <button onClick={toggle} style={{
          position: 'fixed', right: '88px', bottom: '34px', zIndex: 1000,
          background: '#fff', color: '#000', border: 'none', borderRadius: '8px',
          padding: '0.55rem 0.85rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>Questions? Message us</button>
      )}

      <button onClick={toggle} aria-label={open ? 'Close chat' : 'Open chat'} style={{
        position: 'fixed', right: '16px', bottom: '20px', zIndex: 1000,
        width: '60px', height: '60px', borderRadius: '50%', border: 'none',
        background: '#fff', color: '#000', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
      }}>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
        )}
      </button>
    </>
  )
}
