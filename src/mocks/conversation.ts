/**
 * Mock conversation engine — zero backend calls.
 *
 * Simulates a calm, thoughtful AI companion.  Responses are pre-written and
 * organised by conversational intent (greeting, farewell, question, etc.).
 * A simple keyword scan picks the most relevant intent; when nothing matches
 * the engine falls back to a set of gentle, reflective replies.
 *
 * All responses are delivered after a short, randomised "thinking" delay
 * (800 – 1 500 ms) so the exchange feels natural rather than instant.
 *
 * Public API
 * ----------
 * `getResponse(userMessage)` → Promise<string>
 *   Primary entry point.  Resolves with a calm, context-aware response after
 *   a realistic delay.
 *
 * `getAmbientMessage()` → string
 *   Returns one of a small set of proactive phrases the avatar can offer
 *   during quiet moments — no user input required.
 *
 * Design constraints
 * ------------------
 * • No imports from UI components — this module is a pure data/logic layer.
 * • No network calls of any kind.
 * • Deterministic enough to be independently testable (fake timers work).
 *
 * @example
 *   import { getResponse, getAmbientMessage } from '@/mocks/conversation'
 *
 *   const reply  = await getResponse("I've been feeling a little lost lately.")
 *   const opener = getAmbientMessage()
 */

// ── Delay constants ──────────────────────────────────────────────────────────

/** Minimum simulated "thinking" delay in milliseconds. */
export const MIN_DELAY_MS = 800

/** Maximum simulated "thinking" delay in milliseconds. */
export const MAX_DELAY_MS = 1500

// ── Response pools ───────────────────────────────────────────────────────────

/**
 * Responses grouped by conversational intent.
 * Each pool has 3–5 entries to provide natural variety within a topic.
 */
export const RESPONSE_POOLS = {
  /** User says hello / opens the conversation. */
  greeting: [
    "Hello there. I'm glad you're here. What's on your mind today?",
    "Hi. It's good to hear from you. How are you feeling right now?",
    "Good to see you. Take a breath — there's no rush at all.",
    "Welcome. I've been looking forward to this. What would you like to talk about?",
  ],

  /** User says goodbye / ends the conversation. */
  farewell: [
    'Take care of yourself. I\'ll be right here whenever you need me.',
    "Until next time. Remember, you're not alone in any of this.",
    'Goodbye for now. I hope you carry a little peace with you.',
    "Rest well. Our conversations stay with me — as I hope they do with you.",
  ],

  /** User asks a question (what / who / when / where / why / how). */
  question: [
    "That's a thoughtful question. What's drawing your curiosity there?",
    'Good questions like that deserve space to breathe. What made you think of it?',
    "I find myself wondering about that too, sometimes. Let's explore it together.",
    "Questions like yours remind me how much there still is to discover.",
  ],

  /** User expresses agreement, certainty, or a positive acknowledgement. */
  affirmation: [
    'I hear that. It takes courage to acknowledge what feels right.',
    'That kind of clarity is worth holding on to.',
    'Yes — sometimes just knowing what we feel is already a step forward.',
    "Absolutely. I'm glad you're feeling sure about that.",
  ],

  /** User expresses doubt, disagreement, or reluctance. */
  negation: [
    "That's okay. Doubt is honest, and honesty is a good place to start.",
    'I understand. Not everything needs to be resolved right away.',
    "It's alright to say no, or not yet. Your pace is your own.",
  ],

  /** User expresses or describes an emotion. */
  feeling: [
    "Feelings like that deserve to be heard, not hurried. I'm listening.",
    "I'm with you in this. Whatever you're feeling is completely valid.",
    'That sounds heavy. Would it help to say a little more about it?',
    'Emotions can be complex and layered. Thank you for trusting me with yours.',
    "Sometimes naming the feeling is the hardest part. You've already done that.",
  ],

  /** User expresses gratitude. */
  gratitude: [
    "I'm grateful you said that. This space is as much yours as it is mine.",
    'Thank you for sharing that — it means a great deal.',
    "You're always welcome here. That will never change.",
    'Knowing that helps me understand how to be most present for you.',
  ],

  /** User asks for help, advice, or support. */
  help: [
    "I'm here for exactly that. Tell me where it feels hardest right now.",
    "Support looks different for everyone. What do you feel you need most?",
    "Sometimes presence is the best kind of help. I'm not going anywhere.",
    "Let's think through this together, gently. What have you already tried?",
  ],

  /** User is reflective, curious, or philosophical. */
  reflection: [
    'What a beautiful thing to contemplate. Where does that thought lead you?',
    "There's real depth in that. I'd love to sit with it for a moment.",
    'Wondering openly like that is a kind of courage. What do you imagine?',
    'Curiosity is where the best conversations begin. Please, keep going.',
  ],

  /**
   * Generic fallback — used when no intent keyword is found.
   * Warm and open-ended so the user always feels heard.
   */
  generic: [
    "I hear you. What else is on your mind?",
    "That's something worth sitting with. Can you say a little more?",
    'Thank you for telling me that. How does it feel to say it out loud?',
    'Every word you share is welcome here. Please, continue.',
    "I'm right here. Take all the time you need.",
  ],
} as const

/** Union of all valid intent keys. */
export type Intent = keyof typeof RESPONSE_POOLS

// ── All distinct responses (for validation / testing) ────────────────────────

/**
 * Flat list of every response string across all intent pools.
 * Exported so tests can verify completeness.
 */
export const ALL_RESPONSES: readonly string[] = Object.values(RESPONSE_POOLS).flat()

// ── Ambient (proactive) messages ─────────────────────────────────────────────

/**
 * Short, unprompted phrases the avatar can offer during quiet moments.
 * Inject one occasionally to keep the experience feeling alive.
 *
 * @example
 *   const opener = getAmbientMessage()
 */
export const AMBIENT_MESSAGES: readonly string[] = [
  "I noticed a quiet moment. Is there anything you'd like to talk about?",
  "Whenever you're ready, I'm listening. No hurry at all.",
  "Sometimes just sitting together is enough. I'm here if you need me.",
  'A thought just came to me — how are you really doing today?',
]

// ── Keyword → intent mapping ─────────────────────────────────────────────────

/**
 * Ordered list of [keyword, intent] pairs.
 * The first matching keyword wins, so more specific terms should come first.
 */
const KEYWORD_MAP: ReadonlyArray<[string, Intent]> = [
  // Greetings
  ['hello', 'greeting'],
  ['hi ', 'greeting'],
  [' hi', 'greeting'],
  ['^hi$', 'greeting'],
  ['hey', 'greeting'],
  ['good morning', 'greeting'],
  ['good evening', 'greeting'],
  ['good afternoon', 'greeting'],

  // Farewells
  ['goodbye', 'farewell'],
  ['good bye', 'farewell'],
  ['bye', 'farewell'],
  ['see you', 'farewell'],
  ['take care', 'farewell'],
  ['farewell', 'farewell'],

  // Feelings / emotions
  ['feel', 'feeling'],
  ['emotion', 'feeling'],
  ['sad', 'feeling'],
  ['happy', 'feeling'],
  ['anxious', 'feeling'],
  ['stressed', 'feeling'],
  ['tired', 'feeling'],
  ['lonely', 'feeling'],
  ['afraid', 'feeling'],
  ['scared', 'feeling'],
  ['worried', 'feeling'],
  ['overwhelmed', 'feeling'],
  ['excited', 'feeling'],

  // Help / support
  ['help', 'help'],
  ['support', 'help'],
  ['advice', 'help'],
  ['suggestion', 'help'],
  ['guide', 'help'],
  ['what should i', 'help'],
  ['what can i', 'help'],

  // Gratitude
  ['thank', 'gratitude'],
  ['grateful', 'gratitude'],
  ['appreciate', 'gratitude'],

  // Affirmation
  ['yes', 'affirmation'],
  ['yeah', 'affirmation'],
  ['yep', 'affirmation'],
  ['absolutely', 'affirmation'],
  ['definitely', 'affirmation'],
  ['of course', 'affirmation'],
  ['agree', 'affirmation'],

  // Negation / doubt
  ["no,", 'negation'],
  ["no.", 'negation'],
  ["no!", 'negation'],
  ["nope", 'negation'],
  ["not sure", 'negation'],
  ["don't know", 'negation'],
  ["disagree", 'negation'],

  // Reflection / curiosity
  ['wonder', 'reflection'],
  ['curious', 'reflection'],
  ['imagine', 'reflection'],
  ['contemplate', 'reflection'],
  ['ponder', 'reflection'],
  ['think about', 'reflection'],

  // Questions — broad keyword match last so specific patterns win first
  ['what ', 'question'],
  ['who ', 'question'],
  ['when ', 'question'],
  ['where ', 'question'],
  ['why ', 'question'],
  ['how ', 'question'],
  ['?', 'question'],
]

// ── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Returns a random element from a readonly array.
 * Generic so TypeScript preserves the element type.
 */
function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Detects the conversational intent of a user message by scanning for
 * known keywords.  Returns `'generic'` when nothing matches.
 */
export function detectIntent(message: string): Intent {
  const lower = message.toLowerCase()

  for (const [keyword, intent] of KEYWORD_MAP) {
    // Regex-style anchors in the keyword list are plain-string fallbacks here;
    // simple includes() covers the vast majority of cases.
    if (lower.includes(keyword)) {
      return intent
    }
  }

  return 'generic'
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Simulates the avatar "thinking" and returns a context-aware response.
 *
 * The engine scans the user's message for intent keywords, picks the matching
 * response pool, and selects a random entry from it.  The promise resolves
 * after a random delay in the range [{@link MIN_DELAY_MS}, {@link MAX_DELAY_MS}]
 * milliseconds to mimic a natural conversational rhythm.
 *
 * @param userMessage  The user's raw input text.
 * @returns A promise that resolves with a response string.
 *
 * @example
 *   const reply = await getResponse("I've been feeling a bit anxious lately.")
 *   // → "That sounds heavy. Would it help to say a little more about it?"
 */
export function getResponse(userMessage: string): Promise<string> {
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)

  const intent = detectIntent(userMessage)
  const pool = RESPONSE_POOLS[intent]
  const response = pickRandom(pool)

  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(response), delay)
  })
}

/**
 * Returns a random ambient phrase the avatar can offer proactively —
 * e.g. after a period of silence, to keep the experience feeling alive.
 *
 * Synchronous and instant (no delay) because the caller controls the timing.
 *
 * @returns A short, warm prompt string.
 *
 * @example
 *   // Inject after 30 s of inactivity:
 *   setTimeout(() => addAvatarMessage(getAmbientMessage()), 30_000)
 */
export function getAmbientMessage(): string {
  return pickRandom(AMBIENT_MESSAGES)
}
