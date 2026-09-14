import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | Black Top Digital',
  description: 'AI-powered local SEO, Google Ads, Google Business Profile optimization, and website design for local businesses. Custom plans built around your market.',
}

const packages = [
  {
    name: 'Google Business Profile Management',    desc: 'Your GBP is your most powerful free marketing tool — and most businesses waste it.',
    includes: [
      'Full GBP audit and optimization',
      'Weekly keyword-optimized posts',
      'Photo uploads and management',
      'Q&A management',
      'Review monitoring and alerts',
      'Monthly performance report',
    ],
  },
  {
    name: 'Local SEO',    desc: 'Rank for the searches that bring customers to your door — not just traffic to your site.',
    includes: [
      'Keyword research for your market',
      'On-page optimization (all pages)',
      'Local citation building and cleanup',
      'Monthly blog / location page content',
      'Google Search Console monitoring',
      'Ranking progress report',
    ],
  },
  {
    name: 'Google Ads Management',    desc: 'Pay-per-click campaigns built to generate calls, not just burn budget.',
    includes: [
      'Campaign strategy and setup',
      'Keyword targeting and negative lists',
      'Ad copy creation and A/B testing',
      'Bid management and optimization',
      'Call tracking integration',
      'Weekly performance review',
    ],
  },
  {
    name: 'Google Local Services Ads',    desc: 'Show up above all other ads as a Google Guaranteed business. Pay per lead only.',
    includes: [
      'LSA account setup and verification',
      'Google Guarantee badge setup',
      'Budget and bid management',
      'Lead quality monitoring',
      'Dispute management for bad leads',
      'Monthly lead report',
    ],
  },
  {
    name: 'Reputation Management',    desc: 'More 5-star reviews, automated — and zero bad surprises.',
    includes: [
      'Automated review request system',
      'Google and Facebook monitoring',
      'Review response templates',
      'Monthly reputation score report',
      'Competitor review analysis',
      'Negative review alert system',
    ],
  },
  {
    name: 'Website Design & Build',    desc: 'A fast, mobile-first website built to rank and convert. No page builders, no templates.',
    includes: [
      'Custom design (no templates)',
      'Mobile-first, fast-loading build',
      'On-page SEO from day one',
      'Contact form + call tracking',
      'Google Analytics setup',
      '30 days of post-launch support',
    ],
  },
]

export default function Services() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem' }}>
        <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Services</p>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
          Custom Plans Built for Your Market.
        </h1>
        <p style={{ color: '#555', fontSize: '1rem', marginBottom: '4rem', maxWidth: '500px', lineHeight: 1.7 }}>
          Every market is different, so every plan is quoted to fit yours. No long-term contracts. Every service includes a monthly report and direct access to your account manager.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1px', background: '#0f0f0f' }}>
          {packages.map(p => (
            <div key={p.name} style={{ background: '#000', padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>{p.name}</h2>
              <p style={{ color: '#444', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                {p.includes.map(item => (
                  <li key={item} style={{ color: '#555', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px solid #0a0a0a', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#333' }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact" style={{
                display: 'block', textAlign: 'center', border: '1px solid #1a1a1a',
                color: '#666', padding: '0.75rem', fontSize: '0.8rem',
                letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px',
              }}>Get Started →</Link>
            </div>
          ))}
        </div>

        {/* Full Package */}
        <div style={{ marginTop: '1px', background: '#050505', border: '1px solid #1a1a1a', padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>All-In-One</p>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>Full Growth Package</h2>
          <p style={{ color: '#555', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            GBP Management + Local SEO + Google Ads + Reputation Management. Everything working together. Maximum results.
          </p>
          <Link href="/contact" style={{
            background: '#fff', color: '#000', padding: '1rem 3rem',
            fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px', display: 'inline-block',
          }}>Get a Custom Quote →</Link>
        </div>
      </div>
    </div>
  )
}
