import type { Metadata } from 'next'
import GetStartedForm from '@/components/GetStartedForm'

export const metadata: Metadata = {
  title: 'Get Started | Black Top Digital',
  description: 'Tell us about your business and we will show you how we can get you to the top of Google and get your phone ringing.',
}

export default function GetStarted() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '6rem clamp(1rem, 4vw, 2rem) 4rem' }}>
        <p style={{ color: '#aaaaaa', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Get Started
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.08, color: '#fff', marginBottom: '1.25rem' }}>
          Tell Us About You.<br />
          <span style={{ color: '#9a9a9a' }}>We&apos;ll Show You How We Can Help.</span>
        </h1>
        <p style={{ color: '#b8b8b8', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
          Leave your name and number and we&apos;ll reach out shortly. No pressure, and no long-term contracts.
        </p>

        <GetStartedForm />

        <p style={{ color: '#b8b8b8', fontSize: '0.95rem', marginTop: '2rem', textAlign: 'center' }}>
          Rather talk now? Call or text{' '}
          <a href="tel:+14798885621" style={{ color: '#fff', fontWeight: 700, textDecoration: 'none' }}>(479) 888-5621</a>
        </p>
      </div>

      <footer style={{ borderTop: '1px solid #0f0f0f', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#9a9a9a', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          © 2026 Black Top Digital &nbsp;·&nbsp; <a href="tel:+14798885621" style={{ color: 'inherit', textDecoration: 'none' }}>(479) 888-5621</a> &nbsp;·&nbsp; axiom@blacktopdigital.ai
        </p>
      </footer>
    </div>
  )
}
