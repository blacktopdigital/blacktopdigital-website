// Lead intake for every site form (chat callback, /get-started, /contact):
//   1. assigns a Lead ID, 2. texts Weston via TextBelt, 3. stores the full record (contact details
//   + ad attribution) privately in Vercel Blob so it can later be matched to an outcome and revenue.
// The browser fires the OpenAI "lead_created" event only after this returns ok.
// Env: TEXTBELT_KEY, ALERT_PHONE (comma-separated for multiple phones), BLOB_READ_WRITE_TOKEN.
// TextBelt rejects texts containing URLs on unverified keys, so links and domains are defused.

import { cleanAttribution, newId, saveLead, type LeadRecord } from '@/lib/leads'
import { clean, prettyPhone, sendSms } from '@/lib/sms'

// Stable form IDs. Chat and get-started alerts fit one SMS segment (1 credit); the contact form gets two.
const FORMS = {
  form_chat_callback: { header: 'BTD chat lead', limit: 140 },
  form_get_started: { header: 'BTD get started form', limit: 140 },
  form_contact: { header: 'BTD website form', limit: 300 },
} as const
type FormId = keyof typeof FORMS

// Older page versions sent `source` instead of `formId`.
const LEGACY_SOURCES: Record<string, FormId> = { form: 'form_contact', start: 'form_get_started' }

// Appends "label: tail" only if it fits, trimming the tail to the space left.
function withTail(base: string, label: string, tail: string, limit: number) {
  const room = limit - base.length - label.length - 1
  if (!tail || room < 15) return base
  return `${base}\n${label}${tail.length > room ? `${tail.slice(0, room - 3)}...` : tail}`
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  // Honeypot: bots fill the hidden field. Pretend success and drop it (no lead ID, no record).
  if (body.website) return Response.json({ ok: true })

  const formId: FormId = typeof body.formId === 'string' && body.formId in FORMS
    ? body.formId as FormId
    : LEGACY_SOURCES[String(body.source)] ?? 'form_chat_callback'
  const isContactForm = formId === 'form_contact'

  const name = clean(body.name ?? `${clean(body.firstName, 30)} ${clean(body.lastName, 30)}`, 60)
  const business = clean(body.business, 80)
  const message = clean(body.message, 600)
  const email = clean(body.email, 80).replace('@', ' at ')
  const city = clean(body.city, 60)
  const service = clean(body.service, 60)
  const phone = String(body.phone ?? '').replace(/\D/g, '').slice(-10)
  if (!name || phone.length !== 10) {
    return Response.json({ ok: false, error: 'Name and a 10-digit phone are required.' }, { status: 400 })
  }

  const leadId = newId('BTD')
  const attribution = (cleanAttribution(body.attribution) ?? {}) as Record<string, unknown>
  const lastCta = attribution.last_cta as { id?: unknown } | null | undefined

  // Business first so Weston knows who he's calling before he dials.
  const lines = [`${FORMS[formId].header} ${leadId}`, `Business: ${business || 'not given'}`, `Name: ${name}`, `Phone: ${prettyPhone(phone)}`]
  if (isContactForm) {
    if (email) lines.push(`Email: ${email}`)
    if (city) lines.push(`City: ${city}`)
    if (service) lines.push(`Wants: ${service}`)
  }
  const text = withTail(lines.join('\n'), isContactForm ? 'Notes: ' : 'Asked: ', message, FORMS[formId].limit)
  const smsSent = await sendSms(text)

  const lead: LeadRecord = {
    lead_id: leadId,
    created_at: new Date().toISOString(),
    form_id: formId,
    page: typeof attribution.page === 'string' ? attribution.page : null,
    cta: typeof lastCta?.id === 'string' ? lastCta.id : null,
    contact: Object.fromEntries(Object.entries({ name, phone, business, message, email, city, service }).filter(([, v]) => v)),
    attribution,
    sms_sent: smsSent,
    outcome: { status: 'new', revenue: null, notes: '', updated_at: null },
  }

  let saved = false
  try {
    await saveLead(lead)
    saved = true
  } catch (error) {
    // Keep the full record in the function log so the lead can be recovered by hand.
    console.error('lead store failed', JSON.stringify(lead), error)
  }
  console.log('lead', { leadId, formId, saved, smsSent })

  // The lead counts once it's stored or Weston has been texted; either way it isn't lost.
  const ok = saved || smsSent
  return Response.json(ok ? { ok, leadId } : { ok }, { status: ok ? 200 : 502 })
}
