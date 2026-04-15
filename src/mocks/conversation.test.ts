/**
 * Unit tests for conversation.ts (mock conversation engine).
 *
 * Strategy:
 *   - Verify delay constants are within acceptable bounds.
 *   - Verify ALL_RESPONSES covers at least 20 distinct strings.
 *   - Verify detectIntent() maps keywords to the expected intent.
 *   - Verify getResponse() resolves within the declared delay window.
 *   - Verify getResponse() always returns a string from the correct pool.
 *   - Verify getAmbientMessage() returns a non-empty string.
 *   - Fake timers are used throughout to avoid real delays.
 *
 * This test file has no imports from UI components — the module is pure.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  MIN_DELAY_MS,
  MAX_DELAY_MS,
  RESPONSE_POOLS,
  AMBIENT_MESSAGES,
  ALL_RESPONSES,
  detectIntent,
  getResponse,
  getAmbientMessage,
} from './conversation'

// ── Delay constants ──────────────────────────────────────────────────────────

describe('delay constants', () => {
  it('MIN_DELAY_MS is a positive number', () => {
    expect(MIN_DELAY_MS).toBeGreaterThan(0)
  })

  it('MAX_DELAY_MS is greater than MIN_DELAY_MS', () => {
    expect(MAX_DELAY_MS).toBeGreaterThan(MIN_DELAY_MS)
  })

  it('MAX_DELAY_MS is at most 5 seconds (UX ceiling)', () => {
    expect(MAX_DELAY_MS).toBeLessThanOrEqual(5000)
  })

  it('MIN_DELAY_MS is at least 500 ms (feels natural)', () => {
    expect(MIN_DELAY_MS).toBeGreaterThanOrEqual(500)
  })
})

// ── Response pool completeness ───────────────────────────────────────────────

describe('response pools', () => {
  it('ALL_RESPONSES contains at least 20 distinct strings', () => {
    const unique = new Set(ALL_RESPONSES)
    expect(unique.size).toBeGreaterThanOrEqual(20)
  })

  it('every response is a non-empty, trimmed string', () => {
    for (const r of ALL_RESPONSES) {
      expect(typeof r).toBe('string')
      expect(r.trim().length).toBeGreaterThan(0)
      // Should not have leading/trailing whitespace
      expect(r).toBe(r.trim())
    }
  })

  it('every intent pool has at least 3 responses', () => {
    for (const [_intent, pool] of Object.entries(RESPONSE_POOLS)) {
      expect(pool.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('covers all expected intents', () => {
    const expectedIntents = [
      'greeting',
      'farewell',
      'question',
      'affirmation',
      'negation',
      'feeling',
      'gratitude',
      'help',
      'reflection',
      'generic',
    ]
    for (const intent of expectedIntents) {
      expect(RESPONSE_POOLS).toHaveProperty(intent)
    }
  })

  it('all response strings are unique across the entire pool', () => {
    const seen = new Set<string>()
    for (const response of ALL_RESPONSES) {
      expect(seen.has(response)).toBe(false)
      seen.add(response)
    }
  })
})

// ── AMBIENT_MESSAGES ─────────────────────────────────────────────────────────

describe('AMBIENT_MESSAGES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(AMBIENT_MESSAGES)).toBe(true)
    expect(AMBIENT_MESSAGES.length).toBeGreaterThan(0)
  })

  it('every ambient message is a non-empty string', () => {
    for (const m of AMBIENT_MESSAGES) {
      expect(typeof m).toBe('string')
      expect(m.trim().length).toBeGreaterThan(0)
    }
  })
})

// ── detectIntent ─────────────────────────────────────────────────────────────

describe('detectIntent()', () => {
  it('returns "greeting" for "hello"', () => {
    expect(detectIntent('hello')).toBe('greeting')
  })

  it('returns "greeting" for "hey there"', () => {
    expect(detectIntent('hey there')).toBe('greeting')
  })

  it('returns "greeting" for "good morning!"', () => {
    expect(detectIntent('good morning!')).toBe('greeting')
  })

  it('returns "farewell" for "goodbye"', () => {
    expect(detectIntent('goodbye')).toBe('farewell')
  })

  it('returns "farewell" for "see you later"', () => {
    expect(detectIntent('see you later')).toBe('farewell')
  })

  it('returns "feeling" for "I feel sad"', () => {
    expect(detectIntent('I feel sad')).toBe('feeling')
  })

  it('returns "feeling" for "I\'m feeling anxious"', () => {
    expect(detectIntent("I'm feeling anxious")).toBe('feeling')
  })

  it('returns "feeling" for messages containing emotion words', () => {
    expect(detectIntent('I have been so stressed lately')).toBe('feeling')
    expect(detectIntent('I feel lonely')).toBe('feeling')
    expect(detectIntent("I'm tired all the time")).toBe('feeling')
  })

  it('returns "help" for "I need some help"', () => {
    expect(detectIntent('I need some help')).toBe('help')
  })

  it('returns "help" for "can you give me advice?"', () => {
    expect(detectIntent('can you give me advice?')).toBe('help')
  })

  it('returns "gratitude" for "thank you"', () => {
    expect(detectIntent('thank you')).toBe('gratitude')
  })

  it('returns "gratitude" for "I really appreciate that"', () => {
    expect(detectIntent('I really appreciate that')).toBe('gratitude')
  })

  it('returns "affirmation" for "yes, that\'s right"', () => {
    expect(detectIntent("yes, that's right")).toBe('affirmation')
  })

  it('returns "affirmation" for "absolutely"', () => {
    expect(detectIntent('absolutely')).toBe('affirmation')
  })

  it('returns "negation" for "nope"', () => {
    expect(detectIntent('nope')).toBe('negation')
  })

  it('returns "negation" for "not sure about that"', () => {
    expect(detectIntent('not sure about that')).toBe('negation')
  })

  it('returns "reflection" for "I wonder about that"', () => {
    expect(detectIntent('I wonder about that')).toBe('reflection')
  })

  it('returns "reflection" for "I\'m curious about life"', () => {
    expect(detectIntent("I'm curious about life")).toBe('reflection')
  })

  it('returns "question" for "what do you think?"', () => {
    expect(detectIntent('what do you think?')).toBe('question')
  })

  it('returns "question" for a message ending with "?"', () => {
    expect(detectIntent('Is this going to be okay?')).toBe('question')
  })

  it('returns "generic" when no keyword matches', () => {
    expect(detectIntent('')).toBe('generic')
    expect(detectIntent('   ')).toBe('generic')
    expect(detectIntent('lorem ipsum')).toBe('generic')
  })

  it('is case-insensitive', () => {
    expect(detectIntent('HELLO')).toBe('greeting')
    expect(detectIntent('THANK YOU')).toBe('gratitude')
    expect(detectIntent('I FEEL HAPPY')).toBe('feeling')
  })
})

// ── getResponse ──────────────────────────────────────────────────────────────

describe('getResponse()', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a Promise', () => {
    const result = getResponse('hello')
    expect(result).toBeInstanceOf(Promise)
    vi.runAllTimers()
  })

  it('resolves with a non-empty string', async () => {
    const promise = getResponse('hello')
    vi.runAllTimers()
    const result = await promise
    expect(typeof result).toBe('string')
    expect(result.trim().length).toBeGreaterThan(0)
  })

  it('resolves with a string from the matching intent pool', async () => {
    const promise = getResponse('hello')
    vi.runAllTimers()
    const result = await promise
    expect(RESPONSE_POOLS.greeting).toContain(result)
  })

  it('resolves with a string from the feeling pool for emotion messages', async () => {
    const promise = getResponse('I feel so tired')
    vi.runAllTimers()
    const result = await promise
    expect(RESPONSE_POOLS.feeling).toContain(result)
  })

  it('resolves with a string from the generic pool for unmatched messages', async () => {
    const promise = getResponse('lorem ipsum dolor sit amet')
    vi.runAllTimers()
    const result = await promise
    expect(RESPONSE_POOLS.generic).toContain(result)
  })

  it('resolves with a value that exists in ALL_RESPONSES', async () => {
    const promise = getResponse('I need advice')
    vi.runAllTimers()
    const result = await promise
    expect(ALL_RESPONSES).toContain(result)
  })

  it('does NOT resolve before MIN_DELAY_MS have elapsed', async () => {
    let resolved = false
    const promise = getResponse('hello').then((v) => {
      resolved = true
      return v
    })

    vi.advanceTimersByTime(MIN_DELAY_MS - 1)
    await Promise.resolve()
    expect(resolved).toBe(false)

    vi.runAllTimers()
    await promise
  })

  it('resolves after MAX_DELAY_MS have elapsed', async () => {
    const promise = getResponse('hello')
    vi.advanceTimersByTime(MAX_DELAY_MS)
    const result = await promise
    expect(typeof result).toBe('string')
  })

  it('works with empty and unusual inputs', async () => {
    const inputs = ['', '   ', '🎉', 'a'.repeat(500)]
    for (const input of inputs) {
      const promise = getResponse(input)
      vi.runAllTimers()
      const result = await promise
      expect(typeof result).toBe('string')
      expect(result.trim().length).toBeGreaterThan(0)
    }
  })

  it('different calls can resolve with different values (pool sampling)', async () => {
    const results = new Set<string>()
    // Run many iterations against the greeting pool (4 entries) — after 50
    // draws the probability of all identical is (1/4)^49 ≈ 0.
    for (let i = 0; i < 50; i++) {
      const promise = getResponse('hello')
      vi.runAllTimers()
      results.add(await promise)
    }
    expect(results.size).toBeGreaterThan(1)
  })
})

// ── getAmbientMessage ────────────────────────────────────────────────────────

describe('getAmbientMessage()', () => {
  it('returns a non-empty string', () => {
    const result = getAmbientMessage()
    expect(typeof result).toBe('string')
    expect(result.trim().length).toBeGreaterThan(0)
  })

  it('returns a value from AMBIENT_MESSAGES', () => {
    const result = getAmbientMessage()
    expect(AMBIENT_MESSAGES).toContain(result)
  })

  it('is synchronous (no Promise)', () => {
    const result = getAmbientMessage()
    expect(result).not.toBeInstanceOf(Promise)
  })

  it('returns varied messages over multiple calls', () => {
    const results = new Set<string>()
    for (let i = 0; i < 50; i++) {
      results.add(getAmbientMessage())
    }
    // With 4 ambient messages probability of all identical after 50 draws ≈ 0
    expect(results.size).toBeGreaterThan(1)
  })
})
