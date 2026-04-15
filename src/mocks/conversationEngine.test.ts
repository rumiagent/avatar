/**
 * Unit tests for conversationEngine (mock).
 *
 * Strategy:
 *   - Verify getInitialGreeting() returns the expected constant.
 *   - Verify getMockResponse() resolves with a string from the response pool.
 *   - Verify the response pool covers edge cases (non-empty, all strings).
 *   - Verify the delay constants are within acceptable bounds.
 *   - Fake timers are used to avoid real delays.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getInitialGreeting,
  getMockResponse,
  INITIAL_GREETING,
  MOCK_RESPONSES,
  MIN_RESPONSE_DELAY_MS,
  MAX_RESPONSE_DELAY_MS,
} from './conversationEngine'

describe('conversationEngine', () => {
  // ── Delay constants ────────────────────────────────────────────────────

  it('MIN_RESPONSE_DELAY_MS is a positive number', () => {
    expect(MIN_RESPONSE_DELAY_MS).toBeGreaterThan(0)
  })

  it('MAX_RESPONSE_DELAY_MS is greater than MIN_RESPONSE_DELAY_MS', () => {
    expect(MAX_RESPONSE_DELAY_MS).toBeGreaterThan(MIN_RESPONSE_DELAY_MS)
  })

  it('MAX_RESPONSE_DELAY_MS is at most 5 seconds (reasonable UX ceiling)', () => {
    expect(MAX_RESPONSE_DELAY_MS).toBeLessThanOrEqual(5000)
  })

  // ── MOCK_RESPONSES pool ────────────────────────────────────────────────

  it('MOCK_RESPONSES is a non-empty array', () => {
    expect(Array.isArray(MOCK_RESPONSES)).toBe(true)
    expect(MOCK_RESPONSES.length).toBeGreaterThan(0)
  })

  it('every entry in MOCK_RESPONSES is a non-empty string', () => {
    for (const r of MOCK_RESPONSES) {
      expect(typeof r).toBe('string')
      expect(r.trim().length).toBeGreaterThan(0)
    }
  })

  // ── getInitialGreeting ─────────────────────────────────────────────────

  it('returns the INITIAL_GREETING constant', () => {
    expect(getInitialGreeting()).toBe(INITIAL_GREETING)
  })

  it('INITIAL_GREETING is a non-empty string', () => {
    expect(typeof INITIAL_GREETING).toBe('string')
    expect(INITIAL_GREETING.trim().length).toBeGreaterThan(0)
  })

  it('returns the same value on successive calls (deterministic)', () => {
    expect(getInitialGreeting()).toBe(getInitialGreeting())
  })

  // ── getMockResponse ────────────────────────────────────────────────────

  describe('getMockResponse()', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns a Promise', () => {
      const result = getMockResponse('hello')
      expect(result).toBeInstanceOf(Promise)
      // Advance timers so the promise settles and we avoid open handles.
      vi.runAllTimers()
    })

    it('resolves with a string', async () => {
      const promise = getMockResponse('hello')
      vi.runAllTimers()
      const result = await promise
      expect(typeof result).toBe('string')
    })

    it('resolves with a non-empty string', async () => {
      const promise = getMockResponse('hello')
      vi.runAllTimers()
      const result = await promise
      expect(result.trim().length).toBeGreaterThan(0)
    })

    it('resolves with a value drawn from MOCK_RESPONSES', async () => {
      const promise = getMockResponse('hello')
      vi.runAllTimers()
      const result = await promise
      expect(MOCK_RESPONSES).toContain(result)
    })

    it('does NOT resolve before MIN_RESPONSE_DELAY_MS have elapsed', async () => {
      let resolved = false
      const promise = getMockResponse('test').then((v) => {
        resolved = true
        return v
      })

      vi.advanceTimersByTime(MIN_RESPONSE_DELAY_MS - 1)
      // Flush micro-task queue without advancing macro-timers further.
      await Promise.resolve()
      expect(resolved).toBe(false)

      vi.runAllTimers()
      await promise
    })

    it('resolves after MAX_RESPONSE_DELAY_MS have elapsed', async () => {
      const promise = getMockResponse('test')
      vi.advanceTimersByTime(MAX_RESPONSE_DELAY_MS)
      const result = await promise
      expect(typeof result).toBe('string')
    })

    it('different calls can resolve with different values (pool sampling)', async () => {
      // Run many iterations; with a 12-item pool the chance of all identical
      // results is (1/12)^49 ≈ 0, so this is a practical liveness check.
      const results = new Set<string>()
      for (let i = 0; i < 50; i++) {
        const promise = getMockResponse(`msg ${i}`)
        vi.runAllTimers()
        results.add(await promise)
      }
      expect(results.size).toBeGreaterThan(1)
    })

    it('works regardless of the user message content', async () => {
      const inputs = ['', '   ', 'hello', 'a'.repeat(500), '🎉']
      for (const input of inputs) {
        const promise = getMockResponse(input)
        vi.runAllTimers()
        const result = await promise
        expect(typeof result).toBe('string')
      }
    })
  })
})
