// First-party ad attribution, kept in the visitor's browser and attached to every lead.
// The first arrival is recorded once and never overwritten; later ad clicks go in a separate
// "last touch" record. Only parameters actually present in the URL are captured.

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
// oppref: ChatGPT/OpenAI Ads click reference (read by OpenAI's pixel SDK, which also keeps it in the
// __oppref cookie). The others are the click IDs Google, Microsoft and Meta ads append; captured only if present.
export const CLICK_ID_KEYS = ['oppref', 'gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid'] as const

const FIRST_TOUCH = 'btd_first_touch'
const LAST_TOUCH = 'btd_last_touch'
const VISITOR_ID = 'btd_visitor_id'
const SESSION = 'btd_session'
const LAST_CTA = 'btd_last_cta'
const LAST_LEAD = 'btd_last_lead_id'

type Touch = {
  ts: string
  landing_page: string
  referrer: string | null
  utm: Record<string, string>
  click_ids: Record<string, string>
}

// Storage can be blocked (private mode, strict settings); attribution must never break the page.
function read<T>(store: () => Storage, key: string): T | null {
  try {
    const value = store().getItem(key)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

function write(store: () => Storage, key: string, value: unknown) {
  try {
    store().setItem(key, JSON.stringify(value))
  } catch {}
}

const local = () => window.localStorage
const session = () => window.sessionStorage

function randomId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function readCookie(name: string) {
  const match = document.cookie.split('; ').find(c => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

function currentTouch(): Touch {
  const url = new URL(window.location.href)
  const pick = (keys: readonly string[]) =>
    Object.fromEntries(keys.map(k => [k, url.searchParams.get(k)]).filter(([, v]) => v)) as Record<string, string>
  const external = document.referrer && !document.referrer.startsWith(window.location.origin)
  return {
    ts: new Date().toISOString(),
    landing_page: url.pathname + url.search,
    referrer: external ? document.referrer : null,
    utm: pick(UTM_KEYS),
    click_ids: pick(CLICK_ID_KEYS),
  }
}

// Call on every page view.
export function recordVisit() {
  if (!read(local, VISITOR_ID)) write(local, VISITOR_ID, randomId())
  const touch = currentTouch()
  if (!read(local, FIRST_TOUCH)) write(local, FIRST_TOUCH, touch)
  const fromAd = Object.keys(touch.utm).length > 0 || Object.keys(touch.click_ids).length > 0
  if (fromAd) write(local, LAST_TOUCH, touch)
  if (!read(session, SESSION)) {
    write(session, SESSION, { id: randomId(), started: touch.ts, landing_page: touch.landing_page, referrer: touch.referrer })
  }
}

// Remembers the last tracked button so a later form submission knows which CTA led to it.
export function recordCta(id: string) {
  write(session, LAST_CTA, { id, page: window.location.pathname, ts: new Date().toISOString() })
}

export function rememberLead(leadId: string) {
  write(local, LAST_LEAD, leadId)
}

// Everything sent with a lead or a contact tap. No personal details live here.
export function getAttribution() {
  return {
    visitor_id: read<string>(local, VISITOR_ID),
    page: window.location.pathname,
    first_touch: read<Touch>(local, FIRST_TOUCH),
    last_touch: read<Touch>(local, LAST_TOUCH),
    session: read(session, SESSION),
    last_cta: read(session, LAST_CTA),
    previous_lead_id: read<string>(local, LAST_LEAD),
    openai_cookies: { oppref: readCookie('__oppref'), obref: readCookie('__obref') },
  }
}
