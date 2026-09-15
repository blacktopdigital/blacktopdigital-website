// Reports a lead to the OpenAI ads pixel (loaded in app/layout.tsx) so ChatGPT ads
// can optimize toward people who actually reach out. Call only after a submission succeeds.
export function trackLead() {
  const oaiq = (window as unknown as { oaiq?: (...args: unknown[]) => void }).oaiq
  oaiq?.('measure', 'lead_created', { type: 'customer_action' })
}
