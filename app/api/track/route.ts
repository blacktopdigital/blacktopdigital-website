// Logs contact intent that leaves the site (phone and email taps) with the visitor's ad attribution.
// These are NOT confirmed leads: tapping a phone number doesn't prove a call happened.

import { cleanAttribution, newId, saveContactEvent } from '@/lib/leads'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const cta = typeof body.cta === 'string' && /^cta_(phone|email)_[a-z0-9_]{2,60}$/.test(body.cta) ? body.cta : null
  if (!cta) return Response.json({ ok: false }, { status: 400 })

  const attribution = (cleanAttribution(body.attribution) ?? {}) as Record<string, unknown>
  try {
    await saveContactEvent({
      event_id: newId('EVT'),
      type: 'cta_click',
      cta,
      page: typeof attribution.page === 'string' ? attribution.page : null,
      created_at: new Date().toISOString(),
      attribution,
    })
  } catch (error) {
    console.error('contact event store failed', cta, error)
    return Response.json({ ok: false }, { status: 500 })
  }
  return Response.json({ ok: true })
}
