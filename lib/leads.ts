// Server-side lead store: one private JSON file per lead (and per contact tap) in the
// "btd-leads" Vercel Blob store. Records hold contact details, so they stay private and are
// never sent to ad platforms. Env: BLOB_READ_WRITE_TOKEN (added when the store was linked).
import { get, list, put } from '@vercel/blob'

export const OUTCOME_STATUSES = ['new', 'qualified', 'junk', 'closed_won', 'closed_lost'] as const
export type OutcomeStatus = (typeof OUTCOME_STATUSES)[number]

export type Outcome = {
  status: OutcomeStatus
  revenue: number | null
  notes: string
  updated_at: string | null
}

export type LeadRecord = {
  lead_id: string
  created_at: string
  form_id: string
  page: string | null
  cta: string | null
  contact: Record<string, string>
  attribution: Record<string, unknown>
  sms_sent: boolean
  outcome: Outcome
}

export type ContactEvent = {
  event_id: string
  type: 'cta_click'
  cta: string
  page: string | null
  created_at: string
  attribution: Record<string, unknown>
}

export const LEAD_ID_PATTERN = /^BTD-\d{6}-[A-Z2-9]{6}$/

// Readable and unique enough to never collide: BTD-<Central date>-<6 random chars>, e.g. BTD-260915-7K3QXP.
export function newId(prefix: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', year: '2-digit', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date())
  const part = (type: string) => parts.find(p => p.type === type)?.value ?? '00'
  const alphabet = 'ABCDEFGHJKMNPQRSTVWXYZ23456789'
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(6)), b => alphabet[b % alphabet.length]).join('')
  return `${prefix}-${part('year')}${part('month')}${part('day')}-${rand}`
}

// Client-supplied attribution: keep only plain values, bounded in size and depth.
export function cleanAttribution(raw: unknown, depth = 0): unknown {
  if (raw == null) return null
  if (typeof raw === 'string') return raw.slice(0, 500)
  if (typeof raw === 'number' || typeof raw === 'boolean') return raw
  if (typeof raw !== 'object' || Array.isArray(raw) || depth >= 3) return null
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(raw).slice(0, 30)) {
    if (/^[a-z0-9_]{1,40}$/i.test(key)) out[key] = cleanAttribution(value, depth + 1)
  }
  return out
}

async function writeJson(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json',
  })
}

async function readJson<T>(pathname: string): Promise<T | null> {
  const res = await get(pathname, { access: 'private', useCache: false })
  if (!res?.stream) return null
  return JSON.parse(await new Response(res.stream).text()) as T
}

async function readAll<T>(prefix: string): Promise<T[]> {
  const items: T[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix, limit: 1000, cursor })
    const batch = await Promise.all(page.blobs.map(b => readJson<T>(b.pathname).catch(() => null)))
    items.push(...batch.filter((x): x is Awaited<T> => x != null) as T[])
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return items
}

export const saveLead = (lead: LeadRecord) => writeJson(`leads/${lead.lead_id}.json`, lead)
export const saveContactEvent = (event: ContactEvent) => writeJson(`events/${event.event_id}.json`, event)

export async function getLead(leadId: string) {
  return LEAD_ID_PATTERN.test(leadId) ? readJson<LeadRecord>(`leads/${leadId}.json`) : null
}

export async function listLeads() {
  const leads = await readAll<LeadRecord>('leads/')
  return leads.sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function listContactEvents() {
  const events = await readAll<ContactEvent>('events/')
  return events.sort((a, b) => b.created_at.localeCompare(a.created_at))
}

// HTTP Basic auth for the admin page. Env: ADMIN_USER, ADMIN_PASSWORD.
export function isAdmin(request: Request) {
  const user = process.env.ADMIN_USER
  const pass = process.env.ADMIN_PASSWORD
  if (!user || !pass) return false
  const [scheme, encoded] = (request.headers.get('authorization') ?? '').split(' ')
  if (scheme !== 'Basic' || !encoded) return false
  const [u, ...rest] = atob(encoded).split(':')
  return u === user && rest.join(':') === pass
}
