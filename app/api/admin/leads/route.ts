// Password-protected lead dashboard (HTTP Basic auth, env ADMIN_USER / ADMIN_PASSWORD).
//   GET  /api/admin/leads              HTML: every lead with its source, attribution and outcome editor
//   GET  /api/admin/leads?format=csv   spreadsheet export for ROI math (join with ad spend)
//   GET  /api/admin/leads?format=json  raw lead records + contact taps
//   POST /api/admin/leads              set an outcome: lead_id, status, revenue, notes (form or JSON)

import {
  getLead, isAdmin, listContactEvents, listLeads, OUTCOME_STATUSES, saveLead,
  type LeadRecord, type OutcomeStatus,
} from '@/lib/leads'

type Touch = {
  landing_page?: string
  referrer?: string | null
  utm?: Record<string, string>
  click_ids?: Record<string, string>
} | null | undefined

type Attribution = {
  visitor_id?: string | null
  first_touch?: Touch
  last_touch?: Touch
  session?: { landing_page?: string } | null
  openai_cookies?: { oppref?: string | null; obref?: string | null }
}

const unauthorized = () =>
  new Response('Login required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="BTD leads"' } })

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const central = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'short', timeStyle: 'short' }) : ''

// Where a visit came from, preferring ad click IDs over UTM tags over the referrer.
function sourceOf(touch: Touch, oppref?: string | null) {
  if (touch?.click_ids?.oppref || oppref) return 'ChatGPT ads'
  if (touch?.utm?.utm_source) return touch.utm.utm_source
  if (touch?.click_ids?.gclid || touch?.click_ids?.gbraid || touch?.click_ids?.wbraid) return 'Google ads'
  if (touch?.click_ids?.msclkid) return 'Microsoft ads'
  if (touch?.click_ids?.fbclid) return 'Meta'
  if (touch?.referrer) {
    try { return new URL(touch.referrer).hostname } catch { return 'referral' }
  }
  return touch ? 'direct' : ''
}

function row(lead: LeadRecord) {
  const a = lead.attribution as Attribution
  const first = a.first_touch
  const last = a.last_touch
  return {
    lead_id: lead.lead_id,
    created_at: lead.created_at,
    form_id: lead.form_id,
    cta: lead.cta ?? '',
    page: lead.page ?? '',
    status: lead.outcome.status,
    revenue: lead.outcome.revenue ?? '',
    notes: lead.outcome.notes,
    name: lead.contact.name ?? '',
    phone: lead.contact.phone ?? '',
    business: lead.contact.business ?? '',
    first_source: sourceOf(first),
    first_landing_page: first?.landing_page ?? '',
    first_referrer: first?.referrer ?? '',
    first_utm_source: first?.utm?.utm_source ?? '',
    first_utm_medium: first?.utm?.utm_medium ?? '',
    first_utm_campaign: first?.utm?.utm_campaign ?? '',
    first_utm_content: first?.utm?.utm_content ?? '',
    first_utm_term: first?.utm?.utm_term ?? '',
    first_oppref: first?.click_ids?.oppref ?? '',
    first_gclid: first?.click_ids?.gclid ?? '',
    last_ad_source: last ? sourceOf(last) : '',
    last_landing_page: last?.landing_page ?? '',
    last_utm_source: last?.utm?.utm_source ?? '',
    last_utm_medium: last?.utm?.utm_medium ?? '',
    last_utm_campaign: last?.utm?.utm_campaign ?? '',
    last_utm_content: last?.utm?.utm_content ?? '',
    last_utm_term: last?.utm?.utm_term ?? '',
    last_oppref: last?.click_ids?.oppref ?? '',
    oppref_cookie: a.openai_cookies?.oppref ?? '',
    session_landing_page: a.session?.landing_page ?? '',
    visitor_id: a.visitor_id ?? '',
    sms_sent: lead.sms_sent,
  }
}

function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return ''
  const cols = Object.keys(rows[0])
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...rows.map(r => cols.map(c => cell(r[c])).join(','))].join('\n')
}

function page(leads: LeadRecord[], taps: Awaited<ReturnType<typeof listContactEvents>>) {
  const rows = leads.map(row)
  const count = (s: OutcomeStatus) => leads.filter(l => l.outcome.status === s).length
  const revenue = leads.filter(l => l.outcome.status === 'closed_won').reduce((sum, l) => sum + (l.outcome.revenue ?? 0), 0)
  const bySource = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.first_source || 'unknown']: (acc[r.first_source || 'unknown'] ?? 0) + 1 }), {})

  const leadRows = rows.map(r => `
    <tr>
      <td><b>${esc(r.lead_id)}</b><br><small>${esc(central(r.created_at))}</small></td>
      <td>${esc(r.name)}<br><small>${esc(r.business)}</small><br><small>${esc(r.phone)}</small></td>
      <td>${esc(r.form_id)}<br><small>via ${esc(r.cta || 'no button')}</small><br><small>on ${esc(r.page)}</small></td>
      <td>${esc(r.first_source)}<br><small>${esc(r.first_utm_campaign)}</small><br><small>landed ${esc(r.first_landing_page)}</small></td>
      <td>${esc(r.last_ad_source || '—')}<br><small>${esc(r.last_utm_campaign)}</small></td>
      <td>
        <form method="post">
          <input type="hidden" name="lead_id" value="${esc(r.lead_id)}">
          <select name="status">${OUTCOME_STATUSES.map(s => `<option${s === r.status ? ' selected' : ''}>${s}</option>`).join('')}</select>
          <input name="revenue" placeholder="$" value="${esc(r.revenue)}" size="6">
          <input name="notes" placeholder="notes" value="${esc(r.notes)}" size="14">
          <button>Save</button>
        </form>
      </td>
    </tr>`).join('')

  const tapRows = taps.slice(0, 100).map(t => {
    const a = t.attribution as Attribution
    return `<tr><td>${esc(central(t.created_at))}</td><td>${esc(t.cta)}</td><td>${esc(t.page)}</td><td>${esc(sourceOf(a.first_touch))}</td><td>${esc(a.last_touch ? sourceOf(a.last_touch) : '—')}</td></tr>`
  }).join('')

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BTD Leads</title>
<style>
  body{font-family:system-ui,sans-serif;background:#0a0a0a;color:#eee;margin:0;padding:16px}
  h1{margin:0 0 4px} a{color:#c4b5fd} small{color:#aaa}
  .stats{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
  .stat{background:#161616;border:1px solid #2a2a2a;border-radius:8px;padding:8px 12px}
  .wrap{overflow-x:auto} table{border-collapse:collapse;width:100%;font-size:14px}
  td,th{border-bottom:1px solid #222;padding:8px;text-align:left;vertical-align:top}
  input,select,button{background:#000;color:#fff;border:1px solid #444;border-radius:4px;padding:4px}
  button{background:#fff;color:#000;font-weight:700;cursor:pointer}
</style></head><body>
<h1>Black Top Digital leads</h1>
<small>Times in Central. First source = how they first found the site. Last ad click = most recent ad that brought them back.
<a href="?format=csv">Download CSV</a> · <a href="?format=json">JSON</a></small>
<div class="stats">
  <div class="stat">Leads <b>${leads.length}</b></div>
  ${OUTCOME_STATUSES.map(s => `<div class="stat">${s} <b>${count(s)}</b></div>`).join('')}
  <div class="stat">Closed revenue <b>$${revenue.toLocaleString('en-US')}</b></div>
  ${Object.entries(bySource).map(([s, n]) => `<div class="stat">${esc(s)} <b>${n}</b></div>`).join('')}
</div>
<div class="wrap"><table>
  <tr><th>Lead</th><th>Contact</th><th>Form / button</th><th>First source</th><th>Last ad click</th><th>Outcome</th></tr>
  ${leadRows || '<tr><td colspan="6">No leads yet.</td></tr>'}
</table></div>
<h2>Phone &amp; email taps <small>(contact intent, not confirmed leads)</small></h2>
<div class="wrap"><table>
  <tr><th>When</th><th>Button</th><th>Page</th><th>First source</th><th>Last ad click</th></tr>
  ${tapRows || '<tr><td colspan="5">None yet.</td></tr>'}
</table></div>
</body></html>`
}

export async function GET(request: Request) {
  if (!isAdmin(request)) return unauthorized()
  const format = new URL(request.url).searchParams.get('format')
  const leads = await listLeads()

  if (format === 'csv') {
    return new Response(toCsv(leads.map(row)), {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="btd-leads.csv"' },
    })
  }
  const taps = await listContactEvents()
  if (format === 'json') return Response.json({ leads, contact_taps: taps })
  return new Response(page(leads, taps), { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return unauthorized()
  const isForm = (request.headers.get('content-type') ?? '').includes('form')
  const input: Record<string, unknown> = isForm
    ? Object.fromEntries(await request.formData())
    : await request.json().catch(() => ({}))

  const lead = await getLead(String(input.lead_id ?? ''))
  if (!lead) return Response.json({ ok: false, error: 'Lead not found' }, { status: 404 })

  const status = String(input.status ?? lead.outcome.status) as OutcomeStatus
  if (!OUTCOME_STATUSES.includes(status)) return Response.json({ ok: false, error: 'Unknown status' }, { status: 400 })
  const rawRevenue = String(input.revenue ?? '').replace(/[$,\s]/g, '')
  const revenue = rawRevenue === '' ? null : Number(rawRevenue)
  if (revenue !== null && !Number.isFinite(revenue)) return Response.json({ ok: false, error: 'Revenue must be a number' }, { status: 400 })

  lead.outcome = {
    status,
    revenue,
    notes: String(input.notes ?? lead.outcome.notes).slice(0, 500),
    updated_at: new Date().toISOString(),
  }
  await saveLead(lead)

  if (isForm) return Response.redirect(new URL(request.url).toString(), 303)
  return Response.json({ ok: true, lead_id: lead.lead_id, outcome: lead.outcome })
}
