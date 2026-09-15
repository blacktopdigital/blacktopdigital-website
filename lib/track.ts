import { rememberLead } from '@/lib/attribution'

// Reports a lead to the OpenAI ads pixel (loaded in app/layout.tsx) so ChatGPT ads
// can optimize toward people who actually reach out. Call only after a submission succeeds.
// The Lead ID rides along as event_id (no personal details) so OpenAI's conversion can be
// matched to our stored lead record.
export function trackLead(leadId?: string) {
  if (leadId) rememberLead(leadId)
  const oaiq = (window as unknown as { oaiq?: (...args: unknown[]) => void }).oaiq
  oaiq?.('measure', 'lead_created', { type: 'customer_action' }, leadId ? { event_id: leadId } : undefined)
}
