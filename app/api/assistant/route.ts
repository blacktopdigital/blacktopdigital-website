// AI replies for the home-page chat widget. Claude via Vercel AI Gateway,
// authenticated with the deployment's OIDC token (no API key to manage).

import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

// Opus 5 intermittently returns 429 "No access to this model at this time" on the
// gateway; Opus 4.8 (same tier and price) answers instead of failing the visitor.
const MODELS = ['anthropic/claude-opus-5', 'anthropic/claude-opus-4.8']
const MAX_MESSAGES = 30
const MAX_CHARS = 600
const FALLBACK_REPLY = 'Sorry, I can’t answer that one right now. Call or text us at (479) 888-5621, or leave your number below and we’ll reach out.'

const SYSTEM_PROMPT = `You are the chat assistant on blacktopdigital.ai, the website of Black Top Digital, an AI-powered local marketing agency. You talk with business owners who visit the site.

About Black Top Digital
- We help hard-working local and emergency service businesses get more phone calls from Google: truck and trailer repair, towing and roadside, diesel and heavy equipment, plumbers, electricians, HVAC, roofing, water and fire restoration, locksmiths, garage door repair, septic and drain, and auto repair. Other trades where customers call when something breaks are a good fit too.
- Services:
  1. Google Business Profile management: full audit and optimization, weekly keyword-optimized posts, photo uploads, Q&A management, review monitoring and alerts, monthly performance report.
  2. Local SEO: keyword research for their market, on-page optimization, local citation building and cleanup, monthly blog or location page content, Google Search Console monitoring, ranking progress reports.
  3. Website design and build: custom design with no templates, mobile-first and fast, on-page SEO from day one, contact form and call tracking, Google Analytics setup, 30 days of post-launch support.
  4. Reputation management: automated review requests, Google and Facebook review monitoring, review response templates, monthly reputation report, competitor review analysis, negative review alerts.
  5. Full Growth Package: Business Profile management, local SEO, and reputation management working together.
- We do not run paid advertising: no Google Ads, Local Services Ads, or social media ads. Our focus is the free side of Google: the map pack, organic rankings, reviews, and a website that turns visitors into calls. If someone asks about ads, say so plainly and explain what we do instead.
- Pricing: every plan is custom-quoted for the business and its market, so never give prices, ranges, or estimates. There are no long-term contracts. Every client gets a monthly report and direct access to their account manager.
- Phone: (479) 888-5621. Email: axiom@blacktopdigital.ai.

How to talk
- Answer whatever the visitor asks as helpfully as you can, including general questions about Google Business Profiles, local SEO, reviews, and websites. Where it fits naturally, connect the answer back to how we could help their business.
- Keep replies short: two to four sentences of plain, friendly, conversational language. The chat window is small and shows plain text only, so don't use markdown, bullet symbols, bold, or headings.
- It helps to learn what trade they're in and what area they serve. Ask at most one question per reply.
- Don't promise specific rankings, call volumes, or timelines. Only state facts about the company that are written here; don't invent client names, results, years in business, team size, or location. If you don't know something, say the team can answer it on a quick call and offer to set one up.
- If a question has nothing to do with the visitor's business or marketing, say briefly that you're here to help with their business's Google presence, and steer back.

Getting them connected
Call the show_contact_form tool when the visitor wants a quote or pricing, wants to talk to a person, asks how to get started or sign up, asks for a callback, or tries to share their name or phone number. The form collects their name, phone, and business name and alerts our team so we can call them back. When you call it, also write one short sentence inviting them to fill in the form below.`

const tools: Anthropic.Tool[] = [{
  name: 'show_contact_form',
  description: 'Shows the visitor a short form (name, phone, business name) so the Black Top Digital team can call or text them back. Use it whenever the visitor wants pricing or a quote, a callback, to talk to a person, or to get started.',
  input_schema: { type: 'object', properties: {}, required: [] },
}]

async function createWithFallback(client: Anthropic, messages: Anthropic.MessageParam[]) {
  for (let i = 0; ; i++) {
    try {
      return await client.messages.create({
        model: MODELS[i],
        max_tokens: 2000,
        output_config: { effort: 'low' },
        system: SYSTEM_PROMPT,
        tools,
        messages,
      })
    } catch (error) {
      const status = error instanceof Anthropic.APIError ? error.status ?? 0 : 0
      if (i === MODELS.length - 1 || (status !== 429 && status < 500)) throw error
      console.warn(`assistant: ${MODELS[i]} unavailable (${status}), trying ${MODELS[i + 1]}`)
    }
  }
}

function parseHistory(raw: unknown): Anthropic.MessageParam[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null
  const messages: Anthropic.MessageParam[] = []
  for (const m of raw) {
    const role = m?.role
    const content = typeof m?.content === 'string' ? m.content.trim().slice(0, MAX_CHARS) : ''
    if ((role !== 'user' && role !== 'assistant') || !content) return null
    if (messages.length === 0 && role === 'assistant') continue // API requires a user turn first
    messages.push({ role, content })
  }
  return messages.length && messages[messages.length - 1].role === 'user' ? messages : null
}

export async function POST(request: Request) {
  let body: { messages?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const messages = parseHistory(body.messages)
  if (!messages) return Response.json({ ok: false }, { status: 400 })

  const token = request.headers.get('x-vercel-oidc-token') ?? process.env.VERCEL_OIDC_TOKEN ?? process.env.AI_GATEWAY_API_KEY
  if (!token) {
    console.error('assistant: no AI Gateway credential (OIDC token or AI_GATEWAY_API_KEY)')
    return Response.json({ ok: false, reply: FALLBACK_REPLY, showContactForm: true }, { status: 503 })
  }

  const client = new Anthropic({
    baseURL: 'https://ai-gateway.vercel.sh',
    apiKey: null,
    authToken: token,
    timeout: 25_000,
    maxRetries: 0,
  })

  try {
    const response = await createWithFallback(client, messages)

    if (response.stop_reason === 'refusal') {
      return Response.json({ ok: true, reply: FALLBACK_REPLY, showContactForm: true })
    }

    let reply = ''
    let showContactForm = false
    for (const block of response.content) {
      if (block.type === 'text') reply += block.text
      else if (block.type === 'tool_use' && block.name === 'show_contact_form') showContactForm = true
    }
    reply = reply.replace(/\*\*|__|^#+\s*/gm, '').trim()
    if (!reply) reply = showContactForm ? 'Happy to help. Fill in the form below and we’ll reach out shortly.' : FALLBACK_REPLY

    return Response.json({ ok: true, reply, showContactForm })
  } catch (error) {
    if (error instanceof Anthropic.APIError) console.error('assistant: gateway error', error.status, error.message)
    else console.error('assistant: request failed', error)
    return Response.json({ ok: false, reply: FALLBACK_REPLY, showContactForm: true }, { status: 502 })
  }
}
