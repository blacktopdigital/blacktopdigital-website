'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/lib/qualify-questions'
import { trackQualified } from '@/lib/track'

// Stage 2, shown only AFTER the original lead is already saved and texted. It updates that
// same lead by its Lead ID — it never creates a second one, and the Lead ID stays in component
// state so it is never put in the URL.

const SERVICES_PATH = '/services'

const card: React.CSSProperties = { border: '1px solid #222', padding: 'clamp(1.25rem, 5vw, 2rem)' }

const optionBase: React.CSSProperties = {
  display: 'block', width: '100%', textAlign: 'left',
  background: '#050505', border: '1px solid #333', color: '#fff',
  padding: '1.05rem 1.1rem', fontSize: '1rem', lineHeight: 1.35,
  borderRadius: '2px', cursor: 'pointer', fontFamily: 'inherit',
  minHeight: '56px', // comfortable touch target
}

const progressStyle: React.CSSProperties = {
  fontSize: '0.75rem', color: '#aaaaaa', letterSpacing: '0.2em', textTransform: 'uppercase',
}

type Props = { leadId: string; firstName: string }

export default function QualifyFlow({ leadId, firstName }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0,1,2 = questions; 3 = permission; 4 = done
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [justPicked, setJustPicked] = useState('') // shows the tap landing before advancing
  const [consent, setConsent] = useState<'yes' | 'no' | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const submitted = useRef(false) // blocks a second submit even before React re-renders

  async function submit(choice: 'yes' | 'no') {
    if (saving || submitted.current) return
    submitted.current = true
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, answers, consent: choice, page: window.location.pathname }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error()
      if (choice === 'yes' && !data.duplicate) trackQualified(leadId)
      setConsent(choice)
      setStep(4)
    } catch {
      submitted.current = false // let them try again
      setError('Couldn’t save that. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  // ---- Final confirmation -------------------------------------------------
  if (step === 4) {
    return (
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>✓</div>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.75rem' }}>
          {consent === 'yes' ? 'Great! We’ll reach out shortly.' : 'All set — thanks, ' + firstName + '.'}
        </h2>
        <p style={{ color: '#b8b8b8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
          {consent === 'yes'
            ? 'We’ve got everything we need for now.'
            : 'We won’t call or text. If you change your mind, reach us any time at (479) 888-5621.'}
        </p>
        <button onClick={() => router.push(SERVICES_PATH)} className="btn btn-primary" style={{ width: '100%', cursor: 'pointer' }}>
          OK
        </button>
      </div>
    )
  }

  // ---- Contact permission -------------------------------------------------
  if (step === 3) {
    return (
      <div style={card}>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.15rem, 4vw, 1.4rem)', lineHeight: 1.3, marginBottom: '0.9rem' }}>
          Great news — this is exactly what we help businesses with!
        </h2>
        <p style={{ color: '#b8b8b8', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
          Is it okay if we call or text you to talk about how we can help?
        </p>
        {error && <div role="alert" style={{ color: '#ff8080', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}
        <button onClick={() => submit('yes')} disabled={saving} className="btn btn-primary"
          style={{ width: '100%', cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving...' : 'YES — CALL OR TEXT ME'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '1.1rem' }}>
          <button onClick={() => submit('no')} disabled={saving}
            style={{
              background: 'none', border: 'none', color: '#9a9a9a', fontSize: '0.9rem',
              textDecoration: 'underline', cursor: saving ? 'wait' : 'pointer', fontFamily: 'inherit', padding: '0.5rem',
            }}>
            Not right now
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button onClick={() => setStep(2)} disabled={saving} style={backStyle}>← Back</button>
        </div>
      </div>
    )
  }

  // ---- Questions ----------------------------------------------------------
  const q = QUESTIONS[step]
  const selected = answers[q.id]

  // Tapping an answer IS the answer: record it, let the highlight land for a beat so the tap
  // visibly registers, then move on. No second tap on a Next button.
  function choose(option: string) {
    if (justPicked) return
    setAnswers(a => ({ ...a, [q.id]: option }))
    setJustPicked(option)
    setTimeout(() => {
      setJustPicked('')
      setStep(s => s + 1)
    }, 180)
  }

  return (
    <div style={card}>
      <p style={{ ...progressStyle, marginBottom: '1rem' }}>{q.progress}</p>
      <h2 id={`${q.id}-label`} style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.15rem, 4vw, 1.4rem)', lineHeight: 1.3, marginBottom: '1.5rem' }}>
        {q.question}
      </h2>

      <div role="radiogroup" aria-labelledby={`${q.id}-label`} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {q.options.map(option => {
          const isOn = justPicked ? justPicked === option : selected === option
          return (
            <button key={option} type="button" role="radio" aria-checked={isOn}
              onClick={() => choose(option)}
              style={{
                ...optionBase,
                borderColor: isOn ? '#fff' : '#333',
                background: isOn ? '#1e1e1e' : '#050505',
                fontWeight: isOn ? 700 : 400,
              }}>
              {option}
            </button>
          )
        })}
      </div>

      {step > 0 && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={() => setStep(step - 1)} style={backStyle}>← Back</button>
        </div>
      )}
    </div>
  )
}

const backStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: '#9a9a9a', fontSize: '0.85rem',
  cursor: 'pointer', fontFamily: 'inherit', padding: '0.5rem',
}
