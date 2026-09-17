// Stage 2 of the lead flow: the three-question qualification shown AFTER the original lead
// has already been saved and texted. This route never creates a lead — it updates the
// existing record by its Lead ID, so both texts and all stored data stay tied to one person.
//
// Safeguards:
//   - Answers must match lib/qualify-questions.ts exactly, so nothing free-typed reaches the SMS.
//   - Only same-origin requests, and only leads created in the last 24h, are accepted.
//   - `qualification.notified_at` makes the qualified-lead text idempotent: a double-tap,
//     refresh or back-navigation re-saves the answers but never sends a second text.

import { getLead, saveLead, type Qualification } from '@/lib/leads'
import { QUESTIONS, canonicalAnswer } from '@/lib/qualify-questions'
import { clean, prettyPhone, sendSms } from '@/lib/sms'

const SMS_LIMIT = 400
const MAX_LEAD_AGE_MS = 24 * 60 * 60 * 1000

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

function centralTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', month: '2-digit', day: '2-digit', year: '2-digit',
    hour: 'numeric', minute: '2-digit',
  }).format(new Date(iso))
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ ok: false }, { status: 403 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const leadId = String(body.leadId ?? '')
  const consent = body.consent === 'yes' ? 'yes' : body.consent === 'no' ? 'no' : null
  const answers = (body.answers ?? {}) as Record<string, unknown>
  if (!consent) return Response.json({ ok: false, error: 'bad consent' }, { status: 400 })
  const picked: Record<string, string> = {}
  for (const q of QUESTIONS) {
    const answer = canonicalAnswer(q.id, answers[q.id])
    if (!answer) return Response.json({ ok: false, error: 'bad answer' }, { status: 400 })
    picked[q.id] = answer
  }

  // getLead validates the Lead ID format and returns null for anything unknown.
  const lead = await getLead(leadId)
  if (!lead) return Response.json({ ok: false, error: 'unknown lead' }, { status: 404 })
  if (Date.now() - new Date(lead.created_at).getTime() > MAX_LEAD_AGE_MS) {
    return Response.json({ ok: false, error: 'lead too old' }, { status: 409 })
  }

  // Already finished and already texted: succeed without doing it twice.
  if (lead.qualification?.notified_at) {
    return Response.json({ ok: true, duplicate: true })
  }

  const now = new Date().toISOString()
  const session = lead.attribution?.session as { id?: unknown } | null | undefined
  const qualification: Qualification = {
    q1: picked.q1,
    q2: picked.q2,
    q3: picked.q3,
    consent,
    consent_at: now,
    page: typeof body.page === 'string' ? body.page.slice(0, 200) : null,
    session_id: typeof session?.id === 'string' ? session.id : null,
    // Consent evidence is only meaningful (and only kept) when they said yes.
    ip: consent === 'yes' ? request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null : null,
    user_agent: consent === 'yes' ? request.headers.get('user-agent')?.slice(0, 300) ?? null : null,
    sms_sent: false,
    notified_at: null,
  }

  let smsSent = false
  if (consent === 'yes') {
    const c = lead.contact
    const phone = String(c.phone ?? '')
    const utm = (lead.attribution?.first_touch as { utm?: Record<string, string>; click_ids?: Record<string, string> } | null) ?? null
    const campaign = [utm?.utm?.utm_source, utm?.utm?.utm_campaign].filter(Boolean).join(' / ')
      || Object.keys(utm?.click_ids ?? {})[0] || ''
    const lines = [
      `BTD QUALIFIED LEAD ${lead.lead_id}`,
      `Business: ${clean(c.business, 60) || 'not given'}`,
      `Name: ${clean(c.name, 60)}`,
      `Phone: ${phone.length === 10 ? prettyPhone(phone) : clean(phone, 20)}`,
      `Q1: ${clean(qualification.q1, 60)}`,
      `Q2: ${clean(qualification.q2, 60)}`,
      `Q3: ${clean(qualification.q3, 60)}`,
      'Permission: YES',
      `Consent: ${centralTime(now)} CT`,
      `Source: ${lead.form_id}`,
    ]
    if (campaign) lines.push(`Campaign: ${clean(campaign, 60)}`)
    smsSent = await sendSms(lines.join('\n').slice(0, SMS_LIMIT))
    qualification.sms_sent = smsSent
    if (smsSent) qualification.notified_at = new Date().toISOString()
  }

  // Only promote an untouched lead, so Weston's own status edits in the admin dashboard win.
  const outcome = consent === 'yes' && lead.outcome.status === 'new'
    ? { ...lead.outcome, status: 'qualified' as const, updated_at: new Date().toISOString() }
    : lead.outcome

  try {
    await saveLead({ ...lead, outcome, qualification })
  } catch (error) {
    console.error('qualification store failed', JSON.stringify({ leadId, qualification }), error)
    // The text already went out, so don't make them redo it; the log holds the answers.
    if (!smsSent) return Response.json({ ok: false, error: 'save failed' }, { status: 502 })
  }

  console.log('qualified', { leadId, consent, smsSent })
  return Response.json({ ok: true })
}
