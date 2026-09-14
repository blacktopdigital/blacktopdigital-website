// Chat widget + contact page form → texts Weston via TextBelt.
// Env: TEXTBELT_KEY, ALERT_PHONE (comma-separated for multiple phones).
// TextBelt rejects texts containing URLs on unverified keys, so links and domains are defused.

const TEXTBELT_URL = 'https://textbelt.com/text'
// Chat leads fit one SMS segment (1 credit); the fuller contact form gets two (2 credits).
const SMS_LIMIT = { chat: 140, form: 300 }

// Plain ASCII keeps the text in cheap GSM segments (curly quotes or emoji force Unicode billing).
function clean(value: unknown, max: number) {
  return String(value ?? '')
    .replace(/https?:\/\/\S+|www\.\S+/gi, '[link]')
    .replace(/\b([a-z0-9-]+)\.(com|net|org|biz|info|us|co|io|ai)\b/gi, '$1 dot $2')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

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

  // Honeypot: bots fill the hidden field. Pretend success and drop it.
  if (body.website) return Response.json({ ok: true })

  const isForm = body.source === 'form'
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

  // Business first so Weston knows who he's calling before he dials.
  const prettyPhone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
  const lines = [
    isForm ? 'BTD website form' : 'BTD chat lead',
    `Business: ${business || 'not given'}`,
    `Name: ${name}`,
    `Phone: ${prettyPhone}`,
  ]
  if (isForm) {
    if (email) lines.push(`Email: ${email}`)
    if (city) lines.push(`City: ${city}`)
    if (service) lines.push(`Wants: ${service}`)
  }
  const text = isForm
    ? withTail(lines.join('\n'), 'Notes: ', message, SMS_LIMIT.form)
    : withTail(lines.join('\n'), 'Asked: ', message, SMS_LIMIT.chat)

  console.log(isForm ? 'form lead' : 'chat lead', { name, business, phone, email, city, service, message })

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
