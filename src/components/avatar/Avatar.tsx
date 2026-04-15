/**
 * Avatar – the top-level animated avatar component.
 *
 * Renders a white-haired woman character that reacts to speaking state.
 * The container always occupies exactly 50 vh so the avatar sits in the
 * upper half of the viewport at every screen width ≥ 375 px.
 *
 * Props:
 *   isSpeaking  – when true the avatar transitions to its speaking animation;
 *                 when false it returns to the idle loop.
 *   className   – optional extra classes applied to the outer container.
 *   ariaLabel   – accessible label for screen readers.
 *
 * @example
 *   <Avatar isSpeaking={isTalking} />
 */

import { useEffect, useRef } from 'react'
import AvatarIllustration from './AvatarIllustration'

export interface AvatarProps {
  /** When true, the speaking animation plays; idle otherwise. */
  isSpeaking: boolean
  /** Additional CSS class names for the outermost container. */
  className?: string
  /** Screen-reader label for the avatar region. */
  ariaLabel?: string
}

/**
 * Smooth transition helper: adds/removes the speaking class with a small
 * crossfade delay so state changes never look abrupt.
 */
function useTransitionClass(
  isSpeaking: boolean,
  targetRef: React.RefObject<HTMLDivElement | null>,
) {
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

export function Avatar({
  isSpeaking,
  className = '',
  ariaLabel = 'Animated AI assistant avatar',
}: AvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useTransitionClass(isSpeaking, containerRef)

  return (
    <section
      aria-label={ariaLabel}
      data-testid="avatar-section"
      data-speaking={isSpeaking}
      className={[
        // Fixed height: exactly half the viewport
        'relative flex h-[50vh] w-full items-end justify-center overflow-hidden',
        // Dark styled background with a hint of deep purple
        'bg-gradient-to-b from-gray-950 via-[#120e1e] to-[#1a1428]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Radial ambient glow — intensifies while speaking */}
      <div
        aria-hidden="true"
        className={[
          'pointer-events-none absolute inset-0 transition-opacity duration-500',
          isSpeaking ? 'opacity-100' : 'opacity-60',
        ].join(' ')}
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 80%, rgba(167,139,250,0.18) 0%, rgba(99,102,241,0.08) 60%, transparent 100%)',
        }}
      />

      {/* Speaking indicator ring — glows around avatar while speaking */}
      <div
        aria-hidden="true"
        className={[
          'absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-500',
          isSpeaking
            ? 'h-[46vh] w-[min(90vw,46vh)] opacity-100 shadow-glow-lg'
            : 'h-[44vh] w-[min(86vw,44vh)] opacity-0',
        ].join(' ')}
      />

      {/* Avatar illustration container */}
      <div
        ref={containerRef}
        data-testid="avatar-illustration-container"
        className={[
          'relative z-10 flex h-full w-full max-w-sm items-end justify-center',
          'transition-all duration-500 ease-in-out',
          // Slight scale-up when speaking for presence
          isSpeaking ? 'scale-[1.02]' : 'scale-100',
        ].join(' ')}
      >
        <AvatarIllustration isSpeaking={isSpeaking} className="h-full w-full" />
      </div>

      {/* Status label — visually hidden, accessible */}
      <p className="sr-only" aria-live="polite">
        {isSpeaking ? 'Avatar is speaking' : 'Avatar is idle'}
      </p>
    </section>
  )
}

export default Avatar
