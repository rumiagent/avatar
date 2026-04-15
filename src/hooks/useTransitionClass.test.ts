import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useTransitionClass } from './useTransitionClass'

describe('useTransitionClass', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function makeRef(el: HTMLDivElement | null = document.createElement('div')) {
    return { current: el }
  }

  it('does nothing on initial render when isSpeaking is false', () => {
    const ref = makeRef()
    renderHook(() => useTransitionClass(false, ref))

    expect(ref.current!.classList.contains('avatar-transitioning')).toBe(false)
  })

  it('adds and then removes the transitioning class when isSpeaking changes', () => {
    const ref = makeRef()
    const { rerender } = renderHook(
      ({ isSpeaking }) => useTransitionClass(isSpeaking, ref),
      { initialProps: { isSpeaking: false } },
    )

    rerender({ isSpeaking: true })
    expect(ref.current!.classList.contains('avatar-transitioning')).toBe(true)

    vi.advanceTimersByTime(200)
    expect(ref.current!.classList.contains('avatar-transitioning')).toBe(false)
  })

  it('does not add the class when the ref target is null', () => {
    const ref = makeRef(null)
    const { rerender } = renderHook(
      ({ isSpeaking }) => useTransitionClass(isSpeaking, ref),
      { initialProps: { isSpeaking: false } },
    )

    // Should not throw when ref.current is null
    rerender({ isSpeaking: true })
  })

  it('cleans up the timeout on unmount', () => {
    const ref = makeRef()
    const { rerender, unmount } = renderHook(
      ({ isSpeaking }) => useTransitionClass(isSpeaking, ref),
      { initialProps: { isSpeaking: false } },
    )

    rerender({ isSpeaking: true })
    expect(ref.current!.classList.contains('avatar-transitioning')).toBe(true)

    unmount()
    // After unmount the timeout cleanup should have fired; advancing should not throw
    vi.advanceTimersByTime(200)
  })
})
