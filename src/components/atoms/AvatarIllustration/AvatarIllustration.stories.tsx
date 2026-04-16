/**
 * Stories for AvatarIllustration – pure SVG avatar rendering.
 *
 * Demonstrates the idle animations (breathing, blinking, hair sway)
 * and the speaking animation (mouth movement) without any Rive dependency.
 */

import { useState } from 'react'

import { AvatarIllustration } from './AvatarIllustration'

export default {
  title: 'Atoms/AvatarIllustration',
  component: AvatarIllustration,
  decorators: [
    (Story: React.FC) => (
      <div
        style={{
          background: '#09090f',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

/** Idle state — breathing, blinking, and hair sway animations play. */
export const Idle = () => (
  <AvatarIllustration isSpeaking={false} className="h-[60vh] w-auto" />
)

/** Speaking state — mouth animation layer active on top of idle animations. */
export const Speaking = () => (
  <AvatarIllustration isSpeaking={true} className="h-[60vh] w-auto" />
)

/** Interactive toggle to observe the idle-to-speaking transition. */
export const InteractiveToggle = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <AvatarIllustration isSpeaking={isSpeaking} className="h-[50vh] w-auto" />
      <button
        type="button"
        onClick={() => setIsSpeaking((v) => !v)}
        style={{
          padding: '8px 16px',
          borderRadius: 8,
          background: 'rgba(167,139,250,0.2)',
          border: '1px solid rgba(167,139,250,0.4)',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        {isSpeaking ? 'Stop speaking' : 'Start speaking'}
      </button>
    </div>
  )
}

/** Small size — verify the SVG scales proportionally. */
export const SmallSize = () => (
  <AvatarIllustration isSpeaking={false} className="h-32 w-auto" />
)

/** Large size — fill-width rendering for responsive layouts. */
export const LargeSize = () => (
  <AvatarIllustration isSpeaking={false} className="h-[90vh] w-auto" />
)
