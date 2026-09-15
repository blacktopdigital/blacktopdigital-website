'use client'

import { useEffect, useRef, useState } from 'react'
import { trackLead } from '@/lib/track'

type Msg = { from: 'bot' | 'user'; text: string }

// Any <ChatNowButton /> on the page opens the widget through this event.
const OPEN_EVENT = 'btd:open-chat'
const MAX_USER_MESSAGES = 15

const GREETING = 'Hey there! Ask me anything about getting more calls from Google: your Business Profile, SEO, reviews, websites, or how we work.'
const FALLBACK_REPLY = 'Sorry, I can’t answer right now. Call or text us at (479) 888-5621, or leave your number below and we’ll reach out.'

const css = `
  @keyframes btdChatPulse {
    0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.6), 0 8px 30px rgba(0,0,0,0.6) }
    70% { box-shadow: 0 0 0 18px rgba(124,58,237,0), 0 8px 30px rgba(0,0,0,0.6) }
    100% { box-shadow: 0 0 0 0 rgba(124,58,237,0), 0 8px 30px rgba(0,0,0,0.6) }
  }
  @keyframes btdTyping { 0%, 80%, 100% { opacity: 0.25 } 40% { opacity: 1 } }
  .btd-chat-dialog { height: min(640px, 100%); }
  @media (max-width: 600px) {
    .btd-chat-overlay { padding: 10px !important; }
    .btd-chat-dialog { height: min(540px, 100%); }
    .btd-chat-header { padding: 0.7rem 0.9rem !important; }
  }
`

const input: React.CSSProperties = {
  width: '100%', background: '#000', border: '1px solid #333', borderRadius: '8px',
  color: '#fff', padding: '0.8rem 0.9rem', fontSize: '1rem', outline: 'none', fontFamily: 'inherit',
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
    <button onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={`btn ${solid ? 'btn-primary' : 'btn-secondary'}`}>
      <ChatIcon size={20} /> Chat Now
    </button>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: GREETING }])
  const [thinking, setThinking] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [draft, setDraft] = useState('')
  const [firstQuestion, setFirstQuestion] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [business, setBusiness] = useState('')
  const [trap, setTrap] = useState('')
  const [error, setError] = useState('')
  const [viewport, setViewport] = useState<{ top: number; height: number } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const userCount = msgs.filter(m => m.from === 'user').length
  const outOfMessages = userCount >= MAX_USER_MESSAGES
  const formVisible = (showForm || outOfMessages) && !submitted

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

  // Fit the overlay to the visible viewport, so a phone keyboard shrinks the chat
  // instead of pushing its header and first message off-screen.
  useEffect(() => {
    if (!open) return
    const bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const vv = window.visualViewport
    const update = () => { if (vv) setViewport({ top: vv.offsetTop, height: vv.height }) }
    update()
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    // Desktop goes straight to typing; phones keep the keyboard down so the greeting is readable.
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus()
    return () => {
      document.body.style.overflow = bodyOverflow
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
    }
  }, [open])

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [msgs, thinking, formVisible, open, viewport?.height])

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
      if (data.showContactForm || !res.ok) setShowForm(true)
    } catch {
      setMsgs(m => [...m, { from: 'bot', text: FALLBACK_REPLY }])
      setShowForm(true)
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
    setSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, business, message: firstQuestion, website: trap }),
      })
      if (!res.ok) throw new Error()
      trackLead()
      setMsgs(m => [...m, { from: 'bot', text: `Got it, ${name.trim().split(' ')[0]}. We’ll reach out soon. Feel free to keep asking questions in the meantime.` }])
      setSubmitted(true)
    } catch {
      setError('Couldn’t send. Call or text us at (479) 888-5621.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <style>{css}</style>

      {open ? (
        <div className="btd-chat-overlay" onClick={() => setOpen(false)} style={{
          position: 'fixed', left: 0, right: 0, top: viewport?.top ?? 0, height: viewport?.height ?? '100%',
          zIndex: 1000, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
          <div className="btd-chat-dialog" role="dialog" aria-modal="true" aria-label="Chat with Black Top Digital" onClick={e => e.stopPropagation()} style={{
            width: 'min(520px, 100%)',
            background: '#0a0a0a', border: '1px solid #333', borderRadius: '14px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
          }}>
            <div className="btd-chat-header" style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <img src="/logo.svg" alt="" width={34} height={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
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

            <div ref={listRef} style={{
              flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '1rem',
              display: 'flex', flexDirection: 'column', gap: '0.7rem',
            }}>
              {msgs.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%',
                  background: m.from === 'user' ? '#fff' : '#1c1c1c', color: m.from === 'user' ? '#000' : '#eee',
                  padding: '0.75rem 0.95rem', borderRadius: '12px', fontSize: '1rem', lineHeight: 1.5,
                  whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
                }}>{m.text}</div>
              ))}
              {thinking && (
                <div aria-label="Typing" style={{
                  alignSelf: 'flex-start', background: '#1c1c1c', color: '#eee', padding: '0.75rem 1rem',
                  borderRadius: '12px', fontSize: '1.2rem', letterSpacing: '0.15em',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ animation: `btdTyping 1.2s ${i * 0.2}s infinite` }}>•</span>
                  ))}
                </div>
              )}
              {/* The callback form lives in the conversation, so the text box below always stays usable. */}
              {formVisible && (
                <form onSubmit={sendContact} style={{
                  flexShrink: 0, background: '#161616', border: '1px solid #333', borderRadius: '12px',
                  padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Leave your info and we&apos;ll reach out</div>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                    aria-label="Your name" autoComplete="name" maxLength={60} style={input} />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number"
                    aria-label="Phone number" type="tel" autoComplete="tel" maxLength={20} style={input} />
                  <input value={business} onChange={e => setBusiness(e.target.value)} placeholder="Business name (optional)"
                    aria-label="Business name" autoComplete="organization" maxLength={80} style={input} />
                  <input value={trap} onChange={e => setTrap(e.target.value)} name="website" tabIndex={-1}
                    autoComplete="off" aria-hidden="true"
                    style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} />
                  {error && <div style={{ color: '#ff8080', fontSize: '0.9rem' }}>{error}</div>}
                  <button type="submit" disabled={sending} style={{
                    background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.9rem',
                    fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    cursor: sending ? 'wait' : 'pointer', opacity: sending ? 0.6 : 1, fontFamily: 'inherit',
                  }}>{sending ? 'Sending...' : 'Submit'}</button>
                </form>
              )}
            </div>

            <div style={{ borderTop: '1px solid #222', padding: '0.85rem' }}>
              {outOfMessages ? (
                <div style={{ color: '#bbb', fontSize: '0.9rem', textAlign: 'center' }}>
                  Let&apos;s pick this up with a person. Call{' '}
                  <a href="tel:+14798885621" style={{ color: '#fff', fontWeight: 700 }}>(479) 888-5621</a>
                  {!submitted && ' or use the form above.'}
                </div>
              ) : (
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)} placeholder="Ask us anything..."
                    aria-label="Your message" maxLength={500} style={input} />
                  <button type="submit" disabled={thinking} style={{
                    background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '0 1.2rem', fontWeight: 800, fontSize: '0.9rem', fontFamily: 'inherit',
                    cursor: thinking ? 'wait' : 'pointer', opacity: thinking ? 0.6 : 1,
                  }}>Send</button>
                </form>
              )}
              {!submitted && !formVisible && userCount > 0 && (
                <button onClick={() => setShowForm(true)} style={linkButton}>
                  Want a callback? Leave your number
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} aria-label="Chat now" style={{
          position: 'fixed', left: '50%', bottom: '20px', transform: 'translateX(-50%)', zIndex: 1000,
          width: 'min(440px, calc(100vw - 32px))', height: '64px',
          borderRadius: '999px', border: 'none', background: '#7C3AED', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem',
          fontFamily: 'inherit', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.08em', textTransform: 'uppercase',
          animation: 'btdChatPulse 2s infinite',
        }}>
          <ChatIcon size={28} />
          Chat Now
          <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: 0, textTransform: 'none', color: 'rgba(255,255,255,0.8)' }}>
            · Ask us anything
          </span>
        </button>
      )}
    </>
  )
}
