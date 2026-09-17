// TextBelt alerts to Weston. Moved here verbatim from app/api/chat/route.ts so the lead
// route and the qualification route share one implementation.
// Env: TEXTBELT_KEY, ALERT_PHONE (comma-separated for multiple phones).
// TextBelt rejects texts containing URLs on unverified keys, so links and domains are defused.

const TEXTBELT_URL = 'https://textbelt.com/text'

// Plain ASCII keeps the text in cheap GSM segments (curly quotes or emoji force Unicode billing).
export function clean(value: unknown, max: number) {
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

export async function sendSms(text: string) {
  const key = process.env.TEXTBELT_KEY
  const alertPhones = (process.env.ALERT_PHONE ?? '').split(',').map(p => p.trim()).filter(Boolean)
  if (!key || alertPhones.length === 0) {
    console.error('TEXTBELT_KEY or ALERT_PHONE is not set')
    return false
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
  return sent
}

export function prettyPhone(digits: string) {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
