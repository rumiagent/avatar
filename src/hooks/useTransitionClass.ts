/**
 * useTransitionClass — smooth transition helper for the Avatar component.
 *
 * Adds/removes the `avatar-transitioning` CSS class on a target element
 * whenever `isSpeaking` changes, giving CSS a brief window to apply a
 * crossfade so state changes never look abrupt.
 */

import { useEffect, useRef } from 'react'

export function useTransitionClass(
  isSpeaking: boolean,
  targetRef: React.RefObject<HTMLDivElement | null>,
): void {
  const prevRef = useRef(isSpeaking)

  useEffect(() => {
    if (prevRef.current === isSpeaking) return
    prevRef.current = isSpeaking

    const el = targetRef.current
    if (!el) return

    // Mark mid-transition so CSS can apply a brief opacity dip
    el.classList.add('avatar-transitioning')
    const tid = setTimeout(() => {
      el.classList.remove('avatar-transitioning')
    }, 200)
    return () => clearTimeout(tid)
  }, [isSpeaking, targetRef])
}
