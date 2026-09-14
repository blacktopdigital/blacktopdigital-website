'use client'

import { useEffect, useRef, useState } from 'react'

type Msg = { from: 'bot' | 'user'; text: string }
type Step = 'chat' | 'contact' | 'sending'

// Any <ChatNowButton /> on the page opens the widget through this event.
const OPEN_EVENT = 'btd:open-chat'
const MAX_USER_MESSAGES = 15

const GREETING = 'Hey there! Ask me anything about getting more calls from Google: your Business Profile, SEO, reviews, websites, or how we work.'
const FALLBACK_REPLY = 'Sorry, I can’t answer right now. Call or text us at (479) 888-5621, or leave your number below and we’ll reach out.'

const input: React.CSSProperties = {
  width: '100%', background: '#000', border: '1px solid #333', borderRadius: '8px',
  color: '#fff', padding: '0.85rem 0.9rem', fontSize: '1rem', outline: 'none', fontFamily: 'inherit',
}

const linkButton: React.CSSProperties = {
  background: 'none', border: 'none', color: '#ccc', fontSize: '0.85rem', cursor: 'pointer',
  textDecoration: 'underline', padding: '0.5rem 0 0', fontFamily: 'inherit',
}

function ChatIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  )
}

export function ChatNowButton({ solid = false }: { solid?: boolean }) {
  return (
    <button onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} style={{
      border: '2px solid #fff', background: solid ? '#fff' : 'transparent', color: solid ? '#000' : '#fff',
      padding: '0.8rem 1.8rem',
      fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
      borderRadius: '2px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
      fontFamily: 'inherit',
    }}>
      <ChatIcon size={20} /> Chat Now
    </button>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: GREETING }])
  const [step, setStep] = useState<Step>('chat')
  const [thinking, setThinking] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [draft, setDraft] = useState('')
  const [firstQuestion, setFirstQuestion] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [business, setBusiness] = useState('')
  const [trap, setTrap] = useState('')
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const userCount = msgs.filter(m => m.from === 'user').length
  const outOfMessages = userCount >= MAX_USER_MESSAGES

  useEffect(() => {
    const openChat = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, openChat)
    return () => window.removeEventListener(OPEN_EVENT, openChat)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, step, open, thinking])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || thinking || outOfMessages) return
    const next: Msg[] = [...msgs, { from: 'user', text }]
    setMsgs(next)
    setDraft('')
    setThinking(true)
    if (!firstQuestion) setFirstQuestion(text)
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.slice(1).map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      setMsgs(m => [...m, { from: 'bot', text: data.reply || FALLBACK_REPLY }])
      if ((data.showContactForm || !res.ok) && !submitted) setStep('contact')
    } catch {
      setMsgs(m => [...m, { from: 'bot', text: FALLBACK_REPLY }])
      if (!submitted) setStep('contact')
    } finally {
      setThinking(false)
    }
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
        body: JSON.stringify({ name, phone, business, message: firstQuestion, website: trap }),
      })
      if (!res.ok) throw new Error()
      setMsgs(m => [...m, { from: 'bot', text: `Got it, ${name.trim().split(' ')[0]}. We’ll reach out soon. Feel free to keep asking questions in the meantime.` }])
      setSubmitted(true)
      setStep('chat')
    } catch {
      setError('Couldn’t send. Call or text us at (479) 888-5621.')
      setStep('contact')
    }
  }

  return (
    <>
      <style>{`@keyframes btdChatPulse {
        0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.55), 0 8px 30px rgba(0,0,0,0.6) }
        70% { box-shadow: 0 0 0 18px rgba(255,255,255,0), 0 8px 30px rgba(0,0,0,0.6) }
        100% { box-shadow: 0 0 0 0 rgba(255,255,255,0), 0 8px 30px rgba(0,0,0,0.6) }
      }
      @keyframes btdTyping { 0%, 80%, 100% { opacity: 0.25 } 40% { opacity: 1 } }`}</style>

      {open ? (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
          <div role="dialog" aria-modal="true" aria-label="Chat with Black Top Digital" onClick={e => e.stopPropagation()} style={{
            width: 'min(520px, 100%)', height: 'min(640px, 100%)',
            background: '#0a0a0a', border: '1px solid #333', borderRadius: '14px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
          }}>
            <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <img src="/logo.svg" alt="" width={38} height={38} />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>Black Top Digital</div>
                <div style={{ color: '#bbb', fontSize: '0.85rem' }}>
                  Ask us anything · Or call{' '}
                  <a href="tel:+14798885621" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}>(479) 888-5621</a>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" style={{
                background: 'transparent', border: 'none', color: '#ddd', cursor: 'pointer', padding: '0.4rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {msgs.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%',
                  background: m.from === 'user' ? '#fff' : '#1c1c1c', color: m.from === 'user' ? '#000' : '#eee',
                  padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '1rem', lineHeight: 1.5,
                  whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
                }}>{m.text}</div>
              ))}
              {thinking && (
                <div aria-label="Typing" style={{
                  alignSelf: 'flex-start', background: '#1c1c1c', color: '#eee', padding: '0.8rem 1rem',
                  borderRadius: '12px', fontSize: '1.2rem', letterSpacing: '0.15em',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ animation: `btdTyping 1.2s ${i * 0.2}s infinite` }}>•</span>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div style={{ borderTop: '1px solid #222', padding: '1rem' }}>
              {step === 'chat' && (
                <>
                  {outOfMessages ? (
                    <div style={{ color: '#bbb', fontSize: '0.9rem', textAlign: 'center' }}>
                      Let&apos;s pick this up with a person. Call{' '}
                      <a href="tel:+14798885621" style={{ color: '#fff', fontWeight: 700 }}>(479) 888-5621</a>
                      {!submitted && ' or leave your number.'}
                    </div>
                  ) : (
                    <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Ask us anything..."
                        aria-label="Your message" maxLength={500} autoFocus style={input} />
                      <button type="submit" disabled={thinking} style={{
                        background: '#fff', color: '#000', border: 'none', borderRadius: '8px',
                        padding: '0 1.3rem', fontWeight: 800, fontSize: '0.9rem', fontFamily: 'inherit',
                        cursor: thinking ? 'wait' : 'pointer', opacity: thinking ? 0.6 : 1,
                      }}>Send</button>
                    </form>
                  )}
                  {!submitted && userCount > 0 && (
                    <button onClick={() => setStep('contact')} style={linkButton}>
                      Want a callback? Leave your number
                    </button>
                  )}
                </>
              )}
              {(step === 'contact' || step === 'sending') && (
                <form onSubmit={sendContact} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                    aria-label="Your name" autoComplete="name" maxLength={60} autoFocus style={input} />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number"
                    aria-label="Phone number" type="tel" autoComplete="tel" maxLength={20} style={input} />
                  <input value={business} onChange={e => setBusiness(e.target.value)} placeholder="Business name (optional)"
                    aria-label="Business name" autoComplete="organization" maxLength={80} style={input} />
                  <input value={trap} onChange={e => setTrap(e.target.value)} name="website" tabIndex={-1}
                    autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
                  {error && <div style={{ color: '#ff8080', fontSize: '0.9rem' }}>{error}</div>}
                  <button type="submit" disabled={step === 'sending'} style={{
                    background: '#fff', color: '#000', border: 'none', borderRadius: '8px', padding: '0.95rem',
                    fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    cursor: step === 'sending' ? 'wait' : 'pointer', opacity: step === 'sending' ? 0.6 : 1, fontFamily: 'inherit',
                  }}>{step === 'sending' ? 'Sending...' : 'Get a Callback'}</button>
                  {!outOfMessages && (
                    <button type="button" onClick={() => setStep('chat')} style={{ ...linkButton, alignSelf: 'center' }}>
                      Back to chat
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} aria-label="Chat now" style={{
          position: 'fixed', left: '50%', bottom: '20px', transform: 'translateX(-50%)', zIndex: 1000,
          width: 'min(440px, calc(100vw - 32px))', height: '64px',
          borderRadius: '999px', border: 'none', background: '#fff', color: '#000', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem',
          fontFamily: 'inherit', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.08em', textTransform: 'uppercase',
          animation: 'btdChatPulse 2s infinite',
        }}>
          <ChatIcon size={28} />
          Chat Now
          <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: 0, textTransform: 'none', color: '#444' }}>
            · Ask us anything
          </span>
        </button>
      )}
    </>
  )
}
