// The three qualification questions, shared by the client flow and the API route.
// The server validates submitted answers against these exact strings, so the two can never
// drift and nothing free-typed can reach the SMS.

export const QUESTIONS = [
  {
    id: 'q1',
    progress: '1 of 3',
    question: 'What would help your business most right now?',
    button: 'NEXT',
    options: [
      'Rank higher on Google',
      'Get more calls and customers',
      'Improve my website',
      'All of the above',
    ],
  },
  {
    id: 'q2',
    progress: '2 of 3',
    question: 'What’s the biggest problem you’re having right now?',
    button: 'NEXT',
    options: [
      'My competitors rank above me',
      'My business is difficult to find online',
      'My website isn’t bringing me customers',
      'I’m not sure what needs fixing',
    ],
  },
  {
    id: 'q3',
    progress: '3 of 3',
    question: 'How soon would you like to start seeing better results?',
    button: 'CONTINUE',
    options: [
      'As soon as possible',
      'Within the next 30 days',
      'Within the next few months',
      'I’m just checking out my options',
    ],
  },
] as const

export type QuestionId = (typeof QUESTIONS)[number]['id']

// Several options contain a typographic apostrophe. Compare with quotes normalised so a
// client that sends a straight ' still matches, then store the canonical string either way —
// that keeps whatever reaches the SMS to this fixed list.
const normalise = (s: string) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim()

export function canonicalAnswer(id: QuestionId, value: unknown): string | null {
  if (typeof value !== 'string') return null
  const q = QUESTIONS.find(q => q.id === id)
  if (!q) return null
  const target = normalise(value)
  return (q.options as readonly string[]).find(o => normalise(o) === target) ?? null
}
