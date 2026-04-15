/**
 * Stories for Avatar – the top-level animated avatar component.
 *
 * Demonstrates idle and speaking states, the transition between them,
 * and edge-case scenarios like custom class names and aria labels.
 */

import { useState } from 'react'

import { Avatar } from './Avatar'

export default {
  title: 'Organisms/Avatar',
  component: Avatar,
  decorators: [
    (Story: React.FC) => (
      <div style={{ background: '#09090f', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

/** Default idle state — breathing, blinking, and hair sway animations. */
export const Idle = () => <Avatar isSpeaking={false} />

/** Speaking state — glow ring, scale-up, and mouth animation active. */
export const Speaking = () => <Avatar isSpeaking={true} />

/** Interactive toggle between idle and speaking states. */
export const InteractiveToggle = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  return (
    <div>
      <Avatar isSpeaking={isSpeaking} />
      <div style={{ position: 'relative', zIndex: 10, padding: 24, textAlign: 'center' }}>
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
    </div>
  )
}

/** With a custom CSS class applied to the outer container. */
export const WithCustomClass = () => (
  <Avatar isSpeaking={false} className="border-2 border-red-500" />
)

/** With a custom accessible label for screen readers. */
export const WithCustomAriaLabel = () => (
  <Avatar isSpeaking={false} ariaLabel="Custom avatar description" />
)
