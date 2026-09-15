'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getAttribution, recordCta, recordVisit } from '@/lib/attribution'

// Records ad attribution on every page view and remembers clicks on elements marked with
// data-cta="...". Phone and email taps leave the site, so they're logged server-side as
// contact intent (they are not confirmed leads).
export default function AttributionTracker() {
  const pathname = usePathname()

  useEffect(() => {
    recordVisit()
  }, [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest?.('[data-cta]') as HTMLElement | null
      const id = el?.dataset.cta
      if (!id) return
      recordCta(id)
      if (!id.startsWith('cta_phone') && !id.startsWith('cta_email')) return
      const body = JSON.stringify({ cta: id, attribution: getAttribution() })
      const queued = navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))
      if (!queued) {
        fetch('/api/track', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {})
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
