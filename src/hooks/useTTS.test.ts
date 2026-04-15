/**
 * Tests for the useTTS hook.
 *
 * Strategy:
 *   • Pure utility functions (chunkText, selectVoice) are tested directly.
 *   • The hook itself is tested via @testing-library/react renderHook with a
 *     fully mocked SpeechSynthesis / SpeechSynthesisUtterance environment.
 *   • We verify the public API: speak(), stop(), isSpeaking, isSupported.
 *   • Edge cases: unsupported browser, empty text, long text chunking, stop
 *     mid-speech, tab-visibility events, utterance errors.
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { chunkText, selectVoice, TTS_RATE, TTS_PITCH, TTS_CHUNK_MAX_CHARS, useTTS } from './useTTS'

// ── Mocks ─────────────────────────────────────────────────────────────────────

/** Capture utterances passed to speechSynthesis.speak() */
let lastUtterance: MockUtterance | null = null
const speakMock = vi.fn((utterance: MockUtterance) => {
  lastUtterance = utterance
})
const cancelMock = vi.fn()
const pauseMock = vi.fn()
const resumeMock = vi.fn()
const getVoicesMock = vi.fn<() => SpeechSynthesisVoice[]>(() => [])

/** Minimal SpeechSynthesisUtterance stand-in */
class MockUtterance {
  text: string
  rate = 1
  pitch = 1
  volume = 1
  voice: SpeechSynthesisVoice | null = null
  onstart: (() => void) | null = null
  onend: ((event?: SpeechSynthesisEvent) => void) | null = null
  onerror: ((event: SpeechSynthesisErrorEvent) => void) | null = null

  constructor(text: string) {
    this.text = text
  }

  /** Helpers to simulate browser callbacks in tests */
  triggerStart() {
    this.onstart?.()
  }
  triggerEnd() {
    this.onend?.({} as SpeechSynthesisEvent)
  }
  triggerError(error: string) {
    this.onerror?.({ error } as SpeechSynthesisErrorEvent)
  }
}

const mockSpeechSynthesis = {
  speak: speakMock,
  cancel: cancelMock,
  pause: pauseMock,
  resume: resumeMock,
  getVoices: getVoicesMock,
  speaking: false,
  paused: false,
  pending: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  onvoiceschanged: null,
  dispatchEvent: vi.fn(),
}

function installSpeechSynthesis() {
  Object.defineProperty(window, 'speechSynthesis', {
    value: mockSpeechSynthesis,
    writable: true,
    configurable: true,
  })
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    value: MockUtterance,
    writable: true,
    configurable: true,
  })
}

function removeSpeechSynthesis() {
  // Remove from window to simulate unsupported browser
  Object.defineProperty(window, 'speechSynthesis', {
    value: undefined,
    writable: true,
    configurable: true,
  })
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    value: undefined,
    writable: true,
    configurable: true,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  lastUtterance = null
  installSpeechSynthesis()
})

afterEach(() => {
  installSpeechSynthesis() // always restore so other suites aren't affected
})

// ── chunkText ─────────────────────────────────────────────────────────────────

describe('chunkText', () => {
  it('returns empty array for empty string', () => {
    expect(chunkText('')).toEqual([])
  })

  it('returns empty array for whitespace-only string', () => {
    expect(chunkText('   ')).toEqual([])
  })

  it('returns a single chunk for short text', () => {
    const text = 'Hello, world!'
    expect(chunkText(text, 200)).toEqual([text])
  })

  it('splits long text into multiple chunks not exceeding maxLength', () => {
    const sentence = 'This is a sentence. '
    const longText = sentence.repeat(20) // ~400 chars
    const chunks = chunkText(longText, 100)
    expect(chunks.length).toBeGreaterThan(1)
    chunks.forEach((chunk) => expect(chunk.length).toBeLessThanOrEqual(100))
  })

  it('preserves all content across chunks (no text lost)', () => {
    const text = 'First sentence. Second sentence. Third sentence. Fourth sentence.'
    const chunks = chunkText(text, 30)
    // Concatenating chunks should recover the original words
    const reconstructed = chunks.join(' ')
    expect(reconstructed).toContain('First')
    expect(reconstructed).toContain('Second')
    expect(reconstructed).toContain('Third')
    expect(reconstructed).toContain('Fourth')
  })

  it('handles text with no sentence-ending punctuation (word-boundary split)', () => {
    const longWordless = 'word '.repeat(60).trim() // 300 chars, no punctuation
    const chunks = chunkText(longWordless, 50)
    expect(chunks.length).toBeGreaterThan(1)
    chunks.forEach((c) => expect(c.length).toBeLessThanOrEqual(50))
  })

  it('uses TTS_CHUNK_MAX_CHARS as default maxLength', () => {
    const text = 'a'.repeat(TTS_CHUNK_MAX_CHARS + 10)
    const chunks = chunkText(text)
    chunks.forEach((c) => expect(c.length).toBeLessThanOrEqual(TTS_CHUNK_MAX_CHARS))
  })

  it('does not produce empty chunks', () => {
    const text = 'One. Two. Three.'
    const chunks = chunkText(text, 10)
    chunks.forEach((c) => expect(c.trim().length).toBeGreaterThan(0))
  })
})

// ── selectVoice ───────────────────────────────────────────────────────────────

describe('selectVoice', () => {
  const makeVoice = (name: string, lang: string): SpeechSynthesisVoice =>
    ({ name, lang, default: false, localService: true, voiceURI: name } as SpeechSynthesisVoice)

  it('returns null when voices list is empty', () => {
    expect(selectVoice([])).toBeNull()
  })

  it('prefers a female-named English voice', () => {
    const voices = [
      makeVoice('Google UK English Male', 'en-GB'),
      makeVoice('Samantha', 'en-US'),
      makeVoice('Alex', 'en-US'),
    ]
    expect(selectVoice(voices)?.name).toBe('Samantha')
  })

  it('falls back to first English voice when no female keyword matches', () => {
    const voices = [
      makeVoice('Google Deutsch', 'de-DE'),
      makeVoice('Alex', 'en-US'),
      makeVoice('Fred', 'en-US'),
    ]
    expect(selectVoice(voices)?.name).toBe('Alex')
  })

  it('falls back to first available voice when no English voice exists', () => {
    // Use non-keyword, non-English voices so the plain pool[0] fallback is exercised
    const plain = [makeVoice('Hans', 'de-DE'), makeVoice('Thomas', 'fr-FR')]
    expect(selectVoice(plain)?.name).toBe('Hans')
  })

  it('matches female keywords case-insensitively', () => {
    const voices = [makeVoice('KAREN', 'en-AU'), makeVoice('Bruce', 'en-AU')]
    expect(selectVoice(voices)?.name).toBe('KAREN')
  })

  it('recognises Victoria as a female voice', () => {
    const voices = [makeVoice('Victoria', 'en-US'), makeVoice('Alex', 'en-US')]
    expect(selectVoice(voices)?.name).toBe('Victoria')
  })
})

// ── useTTS hook ───────────────────────────────────────────────────────────────

describe('useTTS', () => {
  // ── isSupported ────────────────────────────────────────────────────────────

  it('reports isSupported=true when speechSynthesis is available', () => {
    const { result } = renderHook(() => useTTS())
    expect(result.current.isSupported).toBe(true)
  })

  it('reports isSupported=false when speechSynthesis is unavailable', () => {
    removeSpeechSynthesis()
    const { result } = renderHook(() => useTTS())
    expect(result.current.isSupported).toBe(false)
  })

  // ── Initial state ──────────────────────────────────────────────────────────

  it('starts with isSpeaking=false', () => {
    const { result } = renderHook(() => useTTS())
    expect(result.current.isSpeaking).toBe(false)
  })

  // ── speak() ────────────────────────────────────────────────────────────────

  it('calls speechSynthesis.speak() when speak() is invoked', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Hello'))
    expect(speakMock).toHaveBeenCalledTimes(1)
  })

  it('does nothing when speak() is called with an empty string', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak(''))
    expect(speakMock).not.toHaveBeenCalled()
  })

  it('does nothing when speak() is called and TTS is unsupported', () => {
    removeSpeechSynthesis()
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Hello'))
    expect(speakMock).not.toHaveBeenCalled()
  })

  it('cancels previous speech before starting new speech', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('First'))
    act(() => result.current.speak('Second'))
    // cancel should have been called at least once (before each speak call)
    expect(cancelMock).toHaveBeenCalled()
  })

  it('sets utterance rate to TTS_RATE', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Test text'))
    expect(lastUtterance?.rate).toBe(TTS_RATE)
  })

  it('sets utterance pitch to TTS_PITCH', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Test text'))
    expect(lastUtterance?.pitch).toBe(TTS_PITCH)
  })

  it('sets utterance volume to 1', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Test text'))
    expect(lastUtterance?.volume).toBe(1)
  })

  it('transitions isSpeaking to true when onstart fires', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Hello'))
    act(() => (lastUtterance as MockUtterance).triggerStart())
    expect(result.current.isSpeaking).toBe(true)
  })

  it('transitions isSpeaking to false when onend fires on last chunk', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Hello'))
    act(() => (lastUtterance as MockUtterance).triggerStart())
    expect(result.current.isSpeaking).toBe(true)
    act(() => (lastUtterance as MockUtterance).triggerEnd())
    expect(result.current.isSpeaking).toBe(false)
  })

  // ── stop() ─────────────────────────────────────────────────────────────────

  it('calls speechSynthesis.cancel() when stop() is invoked', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Hello'))
    act(() => result.current.stop())
    expect(cancelMock).toHaveBeenCalled()
  })

  it('sets isSpeaking to false when stop() is called mid-speech', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Hello'))
    act(() => (lastUtterance as MockUtterance).triggerStart())
    expect(result.current.isSpeaking).toBe(true)
    act(() => result.current.stop())
    expect(result.current.isSpeaking).toBe(false)
  })

  it('does nothing when stop() is called and TTS is unsupported', () => {
    removeSpeechSynthesis()
    const { result } = renderHook(() => useTTS())
    // Should not throw
    expect(() => act(() => result.current.stop())).not.toThrow()
  })

  // ── Chunking ───────────────────────────────────────────────────────────────

  it('speaks a second chunk after the first utterance ends', () => {
    const { result } = renderHook(() => useTTS())
    // Build text that's guaranteed to produce two chunks.
    // Each sentence is ~101 chars; together (201) they exceed TTS_CHUNK_MAX_CHARS (200).
    const s1 = 'a'.repeat(99) + '. ' // 101 chars (sentence 1)
    const s2 = 'b'.repeat(99) + '.' //  100 chars (sentence 2)
    const longText = s1 + s2 //          201 chars total → two chunks

    act(() => result.current.speak(longText))
    const firstUtterance = lastUtterance as MockUtterance

    // Simulate first chunk finishing
    act(() => firstUtterance.triggerStart())
    act(() => firstUtterance.triggerEnd())

    // speakMock should have been called again for chunk 2
    expect(speakMock.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('stops chunk progression when stop() is called between chunks', () => {
    const { result } = renderHook(() => useTTS())
    const longText =
      'First long sentence here with plenty of words. Second long sentence here with plenty of words too.'
    act(() => result.current.speak(longText))

    const firstUtterance = lastUtterance as MockUtterance
    act(() => firstUtterance.triggerStart())

    // Stop mid-speech
    act(() => result.current.stop())
    const callsAfterStop = speakMock.mock.calls.length

    // Trigger end of first utterance — should NOT start next chunk
    act(() => firstUtterance.triggerEnd())
    expect(speakMock.mock.calls.length).toBe(callsAfterStop)
  })

  // ── Error handling ─────────────────────────────────────────────────────────

  it('sets isSpeaking to false on unexpected utterance error', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Hello'))
    act(() => (lastUtterance as MockUtterance).triggerStart())
    expect(result.current.isSpeaking).toBe(true)

    act(() => (lastUtterance as MockUtterance).triggerError('network'))
    expect(result.current.isSpeaking).toBe(false)
  })

  it('ignores interrupted/canceled utterance errors (from stop())', () => {
    const { result } = renderHook(() => useTTS())
    act(() => result.current.speak('Hello'))
    act(() => (lastUtterance as MockUtterance).triggerStart())

    // 'interrupted' is fired when we cancel ourselves — should not log or crash
    expect(() =>
      act(() => (lastUtterance as MockUtterance).triggerError('interrupted')),
    ).not.toThrow()
  })

  // ── Tab visibility ─────────────────────────────────────────────────────────

  it('registers a visibilitychange event listener on mount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    renderHook(() => useTTS())
    expect(addSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    addSpy.mockRestore()
  })

  it('removes the visibilitychange listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook(() => useTTS())
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    removeSpy.mockRestore()
  })

  it('calls speechSynthesis.pause() when tab becomes hidden', () => {
    renderHook(() => useTTS())
    // Simulate tab hidden
    Object.defineProperty(document, 'hidden', { value: true, configurable: true })
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(pauseMock).toHaveBeenCalled()
    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
  })

  it('calls speechSynthesis.resume() when tab becomes visible again', () => {
    renderHook(() => useTTS())
    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(resumeMock).toHaveBeenCalled()
  })

  // ── Cleanup ────────────────────────────────────────────────────────────────

  it('cancels speech on unmount', () => {
    const { unmount } = renderHook(() => useTTS())
    act(() => unmount())
    expect(cancelMock).toHaveBeenCalled()
  })

  it('does not update state after unmount (no stale-closure warning)', () => {
    const { result, unmount } = renderHook(() => useTTS())
    act(() => result.current.speak('Hello'))
    const utterance = lastUtterance as MockUtterance
    act(() => unmount())
    // Triggering onstart after unmount must not throw
    expect(() => act(() => utterance.triggerStart())).not.toThrow()
  })

  // ── Voice loading ──────────────────────────────────────────────────────────

  it('subscribes to voiceschanged event for async voice loading', () => {
    renderHook(() => useTTS())
    expect(mockSpeechSynthesis.addEventListener).toHaveBeenCalledWith(
      'voiceschanged',
      expect.any(Function),
    )
  })
})
