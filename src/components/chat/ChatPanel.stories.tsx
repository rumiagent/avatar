/**
 * Stories for ChatPanel – the main chat interface.
 *
 * ChatPanel currently calls mock side effects directly (see issue #21 for
 * the ContextSideEffects refactor). Stories demonstrate the component in
 * its current architecture with various initial states.
 *
 * Required story states per guidelines:
 *   - Default (with initial greeting)
 *   - Speaking (input disabled while avatar talks)
 *   - Interactive (full send/receive flow)
 */

import { useState } from 'react'

import { ChatPanel } from './ChatPanel'

export default {
  title: 'Organisms/ChatPanel',
  component: ChatPanel,
  decorators: [
    (Story: React.FC) => (
      <div
        style={{
          background: '#09090f',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

/** Default state — shows initial greeting, input ready. */
export const Default = () => (
  <ChatPanel
    isSpeaking={false}
    onSpeak={() => {}}
    className="h-[50vh] flex-shrink-0"
  />
)

/** Speaking state — input and send button are disabled. */
export const Speaking = () => (
  <ChatPanel
    isSpeaking={true}
    onSpeak={() => {}}
    className="h-[50vh] flex-shrink-0"
  />
)

/**
 * Interactive — toggle speaking state to test the blocking behaviour.
 * Send messages to exercise the full conversation flow.
 */
export const Interactive = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = (text: string) => {
    setIsSpeaking(true)
    // Simulate TTS duration proportional to text length
    const duration = Math.max(1500, text.length * 40)
    setTimeout(() => setIsSpeaking(false), duration)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: 16,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 12,
        }}
      >
        {isSpeaking ? 'Avatar is speaking... (input disabled)' : 'Ready for input'}
      </div>
      <ChatPanel
        isSpeaking={isSpeaking}
        onSpeak={handleSpeak}
        className="flex-1"
      />
    </div>
  )
}

/** Full-height variant — verifies layout at different container sizes. */
export const FullHeight = () => (
  <ChatPanel
    isSpeaking={false}
    onSpeak={() => {}}
    className="h-[80vh] flex-shrink-0"
  />
)
