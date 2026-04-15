/**
 * Mocked conversation engine — zero backend calls.
 *
 * Simulates a calm, thoughtful AI companion.  All responses are pre-written;
 * the engine picks one at random and delivers it after a realistic "thinking"
 * delay (800 ms – 2 s).
 *
 * This module is a placeholder until issue #7 implements the real engine.
 *
 * Public API
 * ----------
 * `getInitialGreeting()` → string          Greeting shown on first load.
 * `getMockResponse(userMessage)` → Promise<string>  Async response generator.
 *
 * @example
 *   const greeting = getInitialGreeting()
 *   const reply    = await getMockResponse("Tell me about yourself.")
 */

/** Minimum thinking delay in milliseconds. */
export const MIN_RESPONSE_DELAY_MS = 800

/** Maximum thinking delay in milliseconds. */
export const MAX_RESPONSE_DELAY_MS = 2000

/**
 * First message the avatar shows on load.
 * Welcoming and unhurried — sets the conversational tone.
 */
export const INITIAL_GREETING =
  "Hello! I'm here whenever you're ready to talk. Take your time."

/**
 * Pool of avatar responses.
 * Written in a calm, attentive voice that reflects the avatar's character.
 */
export const MOCK_RESPONSES: readonly string[] = [
  "That's a lovely thought. Tell me more — I'm all ears.",
  "I hear you. What else is on your mind?",
  "Thank you for sharing that with me. How does it make you feel?",
  "Every word you share matters. I'm right here with you.",
  'That sounds meaningful. I\'d love to understand it better.',
  "You have such a thoughtful perspective. What brought you to that view?",
  'Sometimes the quietest moments carry the most weight. I understand.',
  "I appreciate you opening up. What would feel most helpful right now?",
  "Let's explore that together. There's no rush.",
  "That resonates with me. Please, go on.",
  'Your thoughts are always welcome here — whenever, however.',
  "Sometimes just saying something aloud helps. I'm glad you did.",
]

/**
 * Returns the opening greeting shown in the chat feed on first load.
 * Deterministic — always the same string (no randomness needed here).
 */
export function getInitialGreeting(): string {
  return INITIAL_GREETING
}

/**
 * Simulates the avatar "thinking" and returns a response.
 *
 * @param _userMessage  The user's message text (reserved for future semantic
 *                      matching; currently unused for random selection).
 * @returns A promise that resolves with a response string after a realistic
 *          delay of {@link MIN_RESPONSE_DELAY_MS}–{@link MAX_RESPONSE_DELAY_MS} ms.
 */
export function getMockResponse(_userMessage: string): Promise<string> {
  const delay =
    MIN_RESPONSE_DELAY_MS + Math.random() * (MAX_RESPONSE_DELAY_MS - MIN_RESPONSE_DELAY_MS)

  const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]

  return new Promise((resolve) => {
    setTimeout(() => resolve(response), delay)
  })
}
