// Home-page chat widget → texts Weston via TextBelt.
// Env: TEXTBELT_KEY, ALERT_PHONE (comma-separated for multiple phones).
// TextBelt rejects texts containing URLs on unverified keys, so links are stripped.

const TEXTBELT_URL = 'https://textbelt.com/text'

// Plain ASCII keeps the text in one cheap SMS segment (curly quotes or emoji force Unicode billing).
function clean(value: unknown, max: number) {
  return String(value ?? '')
    .replace(/https?:\/\/\S+|www\.\S+/gi, '[link]')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  // Honeypot: bots fill the hidden field. Pretend success and drop it.
  if (body.website) return Response.json({ ok: true })

  const name = clean(body.name, 60)
  const business = clean(body.business, 80)
  const message = clean(body.message, 400)
  const phone = String(body.phone ?? '').replace(/\D/g, '').slice(-10)
  if (!name || phone.length !== 10) {
    return Response.json({ ok: false, error: 'Name and a 10-digit phone are required.' }, { status: 400 })
  }

  const prettyPhone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
  // Business first so Weston knows who he's calling before he dials.
  // Stay under ~140 chars: one TextBelt credit per text.
  const base = [
    'BTD chat lead',
    `Business: ${business || 'not given'}`,
    `Name: ${name}`,
    `Phone: ${prettyPhone}`,
  ].join('\n')
  const room = 140 - base.length - '\nAsked: '.length
  const asked = message.length > room ? `${message.slice(0, room - 3)}...` : message
  const text = message && room > 15 ? `${base}\nAsked: ${asked}` : base

  console.log('chat lead', { name, business, phone, message })

  const key = process.env.TEXTBELT_KEY
  const alertPhones = (process.env.ALERT_PHONE ?? '').split(',').map(p => p.trim()).filter(Boolean)
  if (!key || alertPhones.length === 0) {
    console.error('TEXTBELT_KEY or ALERT_PHONE is not set')
    return Response.json({ ok: false }, { status: 500 })
  }

  const results = await Promise.all(alertPhones.map(to =>
    fetch(TEXTBELT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: to, message: text, key }),
    })
      .then(r => r.json())
      .catch(err => ({ success: false, error: String(err) })),
  ))

  const sent = results.some(r => r.success)
  if (!sent) console.error('TextBelt failed', results)
  return Response.json({ ok: sent }, { status: sent ? 200 : 502 })
}
