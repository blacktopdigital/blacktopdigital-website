// One phone rule for every form and for the API, so a number that passes in the browser is
// the same number the server stores.
//
// The old check was `digits.length < 10` on the client and `.slice(-10)` on the server, which
// meant 29 digits of nonsense passed both: the client saw "10 or more" and the server quietly
// kept the last 10. Now anything that isn't a real North American number is rejected outright.

// Returns the 10 digits to store, or null if it isn't a usable number.
export function normalisePhone(raw: unknown): string | null {
  let d = String(raw ?? '').replace(/\D/g, '')

  // Accept a leading country code (1), but nothing longer or shorter than a NANP number.
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1)
  if (d.length !== 10) return null

  // NANP: area code and exchange both start 2-9.
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(d)) return null

  // N11 area codes (211, 311, 411, 511, 611, 711, 811, 911) are service codes, not phones.
  if (d[1] === '1' && d[2] === '1') return null

  // Same digit ten times (2222222222) is a placeholder, not a number.
  if (/^(\d)\1{9}$/.test(d)) return null

  return d
}

export const PHONE_ERROR = 'Enter a real 10-digit phone number, like (479) 888-5621.'
