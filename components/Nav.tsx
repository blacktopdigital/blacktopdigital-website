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

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #111',
      padding: '0 2rem', height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <Image src="/robot.png" alt="Black Top Digital" width={36} height={36} style={{ borderRadius: '4px', objectFit: 'cover' }} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Black Top Digital
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            color: '#888', fontSize: '0.85rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#888')}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/contact" style={{
          background: '#fff', color: '#000', padding: '0.45rem 1.2rem',
          fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px',
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Get Started
        </Link>
        <Link href="/portal" style={{ color: '#444', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.05em' }}>
          Portal
        </Link>
      </div>
    </nav>
  )
}
