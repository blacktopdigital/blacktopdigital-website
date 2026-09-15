'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

// Inline styles can't do media queries: below 1024px the links collapse into a menu button.
const responsiveCss = `
  .btd-nav-toggle { display: none; }
  @media (max-width: 1024px) {
    .btd-nav-links { display: none !important; }
    .btd-nav-toggle { display: flex !important; }
  }
  @media (min-width: 1025px) { .btd-nav-menu { display: none !important; } }
`

const menuLink: React.CSSProperties = {
  color: '#fff', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.08em',
  textTransform: 'uppercase', textDecoration: 'none', padding: '0.9rem 0', borderBottom: '1px solid #1a1a1a',
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <style>{responsiveCss}</style>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #111',
        padding: '0 clamp(1rem, 4vw, 2rem)', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>
        <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minWidth: 0 }}>
          <Image src="/logo.svg" alt="Black Top Digital" width={36} height={36} style={{ objectFit: 'contain', flexShrink: 0 }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Black Top Digital
          </span>
        </Link>

        <div className="btd-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              color: '#d4d4d4', fontSize: '0.85rem', letterSpacing: '0.08em',
              textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#d4d4d4')}
            >
              {l.label}
            </Link>
          ))}
          <a href="tel:+14798885621" data-cta="cta_phone_nav" style={{
            color: '#fff', fontSize: '0.85rem', fontWeight: 700,
            letterSpacing: '0.05em', textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            (479) 888-5621
          </a>
          <Link href="/get-started" data-cta="cta_get_started_nav" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
            Get Started
          </Link>
        </div>

        <button className="btd-nav-toggle" onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} style={{
            background: 'transparent', border: '1px solid #333', borderRadius: '6px', color: '#fff',
            width: '44px', height: '44px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="btd-nav-menu" style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
          background: '#000', borderBottom: '1px solid #222',
          padding: '0.5rem clamp(1rem, 4vw, 2rem) 1.5rem',
          display: 'flex', flexDirection: 'column',
        }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={close} style={menuLink}>{l.label}</Link>
          ))}
          <a href="tel:+14798885621" onClick={close} data-cta="cta_phone_nav_menu" style={{ ...menuLink, fontWeight: 800, borderBottom: 'none' }}>
            Call (479) 888-5621
          </a>
          <Link href="/get-started" onClick={close} data-cta="cta_get_started_nav_menu" className="btn btn-primary" style={{ display: 'block', marginTop: '0.75rem' }}>
            Get Started
          </Link>
        </div>
      )}
    </>
  )
}
