/**
 * useTTS – Native browser Text-to-Speech hook.
 *
 * Uses the Web Speech API (`window.speechSynthesis`) exclusively —
 * zero external network calls, zero API keys.
 *
 * Features:
 *   • Automatic voice selection: prefers calm English female voices,
 *     falls back to first available English voice, then any voice.
 *   • Text chunking: splits long strings at sentence boundaries to avoid
 *     Chrome's silent 15-second utterance cutoff.
 *   • Tab-visibility guard: pauses/resumes synthesis when the tab is
 *     hidden / restored (Chrome drops synthesis on background tabs).
 *   • Graceful degradation: when `speechSynthesis` is unavailable
 *     `isSupported` is false and all functions are harmless no-ops.
 *
 * @example
 *   const { speak, stop, isSpeaking, isSupported } = useTTS()
 *   // …
 *   speak('Hello! I'm glad we have this conversation.')
 *   // later…
 *   stop()
 */

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Voice / delivery constants ────────────────────────────────────────────────

/** Playback rate: slightly below 1.0 for a calm, measured delivery. */
export const TTS_RATE = 0.9

/** Pitch: 1.0 is neutral; keep it natural. */
export const TTS_PITCH = 1.05

/** Volume: full volume. */
export const TTS_VOLUME = 1.0

/**
 * Maximum characters per utterance chunk.
 * Chrome silently stops synthesis after ~15 s; at an average speaking rate of
 * ~14 chars/s that is ~210 characters.  We use 200 as a conservative ceiling.
 */
export const TTS_CHUNK_MAX_CHARS = 200

/** Lowercase substrings that hint at a female voice. */
const FEMALE_VOICE_KEYWORDS = [
  'female',
  'woman',
  'samantha',
  'karen',
  'victoria',
  'fiona',
  'moira',
  'tessa',
  'veena',
  'zira',
  'susan',
  'allison',
  'ava',
  'alice',
  'amelie',
  'anna',
  'joana',
  'kanya',
  'kyoko',
  'laura',
  'lekha',
  'luciana',
  'maged',
  'mariam',
  'mei-jia',
  'milena',
  'nora',
  'paulina',
  'sara',
  'sin-ji',
  'zosia',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Splits `text` into chunks of at most `maxLength` characters, breaking
 * preferentially at sentence-ending punctuation (`.`, `!`, `?`) and then at
 * word boundaries so no word is cut in half.
 */
export function chunkText(text: string, maxLength: number = TTS_CHUNK_MAX_CHARS): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  if (trimmed.length <= maxLength) return [trimmed]

  // Split on sentence-ending punctuation while keeping the delimiter
  const sentences = trimmed.match(/[^.!?…]+[.!?…]*/g) ?? [trimmed]

  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    // If a single sentence is longer than maxLength, split it at word boundaries
    if (sentence.length > maxLength) {
      if (current) {
        chunks.push(current.trim())
        current = ''
      }
      const words = sentence.split(' ')
      for (const word of words) {
        if (word.length > maxLength) {
          // Hard character split: word itself exceeds the limit (e.g. no whitespace)
          if (current) {
            chunks.push(current.trim())
            current = ''
          }
          let remaining = word
          while (remaining.length > maxLength) {
            chunks.push(remaining.slice(0, maxLength))
            remaining = remaining.slice(maxLength)
          }
          if (remaining) current = remaining
        } else if (current.length + word.length + 1 > maxLength && current.length > 0) {
          chunks.push(current.trim())
          current = word
        } else {
          current = current ? `${current} ${word}` : word
        }
      }
    } else if (current.length + sentence.length > maxLength && current.length > 0) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current += sentence
    }
  }

  if (current.trim()) chunks.push(current.trim())
  return chunks
}

/**
 * Picks the best available voice.
 *
 * Priority:
 *   1. English female voice (name contains a known female keyword)
 *   2. First available English voice
 *   3. First available voice (any language)
 *   4. null (use browser default)
 */
export function selectVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null

  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  const pool = enVoices.length > 0 ? enVoices : voices

  const femaleVoice = pool.find((v) =>
    FEMALE_VOICE_KEYWORDS.some((kw) => v.name.toLowerCase().includes(kw)),
  )

  return femaleVoice ?? pool[0] ?? null
}

// ── Hook return type ──────────────────────────────────────────────────────────

export interface UseTTSReturn {
  /** Speak the provided text. Cancels any in-progress speech first. */
  speak: (text: string) => void
  /** Immediately stop all speech. */
  stop: () => void
  /** True while the browser is actively producing audio. */
  isSpeaking: boolean
  /** False when `window.speechSynthesis` is not available in this browser. */
  isSupported: boolean
}

// ── Main hook ─────────────────────────────────────────────────────────────────

export function useTTS(): UseTTSReturn {
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    window.speechSynthesis != null

  const [isSpeaking, setIsSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const chunksRef = useRef<string[]>([])
  const chunkIndexRef = useRef(0)
  const activeRef = useRef(false) // guard to drop stale utterance callbacks

  // ── Voice initialisation ────────────────────────────────────────────────

  useEffect(() => {
    if (!isSupported) return

    const synth = window.speechSynthesis

    const loadVoices = () => {
      const voices = synth.getVoices()
      if (voices.length > 0) {
        voiceRef.current = selectVoice(voices)
      }
    }

    // Voices may already be available (Firefox) or arrive asynchronously (Chrome)
    loadVoices()
    synth.addEventListener('voiceschanged', loadVoices)
    return () => synth.removeEventListener('voiceschanged', loadVoices)
  }, [isSupported])

  // ── Tab-visibility guard (Chrome TTS freeze fix) ───────────────────────

  useEffect(() => {
    if (!isSupported) return

    const handleVisibilityChange = () => {
      const synth = window.speechSynthesis
      if (document.hidden) {
        synth.pause()
      } else {
        synth.resume()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isSupported])

  // ── Cleanup on unmount ─────────────────────────────────────────────────

  useEffect(() => {
    if (!isSupported) return
    return () => {
      activeRef.current = false
      window.speechSynthesis.cancel()
    }
  }, [isSupported])

  // ── Internal: speak one chunk, then recurse to the next ───────────────

  const speakChunk = useCallback(
    (index: number) => {
      if (!isSupported) return
      const chunks = chunksRef.current

      if (index >= chunks.length || !activeRef.current) {
        // All chunks finished or speak() was cancelled
        activeRef.current = false
        setIsSpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index])
      utterance.rate = TTS_RATE
      utterance.pitch = TTS_PITCH
      utterance.volume = TTS_VOLUME
      if (voiceRef.current) utterance.voice = voiceRef.current

      utterance.onstart = () => {
        if (activeRef.current) setIsSpeaking(true)
      }

      utterance.onend = () => {
        if (!activeRef.current) return
        chunkIndexRef.current = index + 1
        speakChunk(index + 1)
      }

      utterance.onerror = (event) => {
        // 'interrupted' fires when we call cancel() ourselves — not an error
        if (event.error === 'interrupted' || event.error === 'canceled') return
        console.warn('[useTTS] SpeechSynthesisUtterance error:', event.error)
        activeRef.current = false
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    },
    [isSupported],
  )

  // ── Public API ─────────────────────────────────────────────────────────

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return

      // Cancel any current speech and reset
      activeRef.current = false
      window.speechSynthesis.cancel()
      setIsSpeaking(false)

      const chunks = chunkText(text)
      if (chunks.length === 0) return

      chunksRef.current = chunks
      chunkIndexRef.current = 0
      activeRef.current = true

      speakChunk(0)
    },
    [isSupported, speakChunk],
  )

  const stop = useCallback(() => {
    if (!isSupported) return
    activeRef.current = false
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  return { speak, stop, isSpeaking, isSupported }
}

export default useTTS
