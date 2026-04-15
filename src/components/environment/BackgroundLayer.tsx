/**
 * BackgroundLayer — renders the active environment as a full-screen
 * background with a smooth crossfade transition on change.
 *
 * Implementation:
 *   Two absolutely-positioned layers are stacked. When the environment
 *   changes, the "next" layer fades in while the "previous" layer fades
 *   out (both via CSS opacity transition).  A dark vignette overlay is
 *   drawn on top so the background never competes with the avatar or chat.
 *
 *   The 600 ms transition duration matches the issue spec.
 */

import { useEffect, useRef, useState } from 'react'

import type { Environment } from './environments'

export interface BackgroundLayerProps {
  environment: Environment
}

const TRANSITION_MS = 600

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ environment }) => {
  /* Track two layers so we can crossfade between them. */
  const [layers, setLayers] = useState<{ front: Environment; back: Environment | null }>({
    front: environment,
    back: null,
  })
  const [frontVisible, setFrontVisible] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (environment.id === layers.front.id) return

    // Clear any pending transition cleanup.
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Place current front into back, new environment into front, hide front initially.
    setLayers({ front: environment, back: layers.front })
    setFrontVisible(false)

    // After a microtask (to let the DOM paint the hidden layer), start fade-in.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFrontVisible(true)
      })
    })

    // After the transition completes, drop the back layer.
    timeoutRef.current = setTimeout(() => {
      setLayers((prev) => ({ ...prev, back: null }))
    }, TRANSITION_MS + 50)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment])

  const layerBase =
    'absolute inset-0 w-full h-full transition-opacity pointer-events-none'

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-testid="background-layer"
    >
      {/* Back layer (previous environment, fading out) */}
      {layers.back && (
        <div
          className={layerBase}
          style={{
            background: layers.back.background,
            opacity: frontVisible ? 0 : 1,
            transitionDuration: `${TRANSITION_MS}ms`,
            transitionTimingFunction: 'ease-in-out',
          }}
        />
      )}

      {/* Front layer (current environment, fading in) */}
      <div
        className={layerBase}
        style={{
          background: layers.front.background,
          opacity: frontVisible ? 1 : 0,
          transitionDuration: `${TRANSITION_MS}ms`,
          transitionTimingFunction: 'ease-in-out',
        }}
      />

      {/* Dark vignette overlay — ensures readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  )
}
