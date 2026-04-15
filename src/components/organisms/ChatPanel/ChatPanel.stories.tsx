/**
 * Stories for ChatPanel – the main chat interface.
 *
 * All side effects are injected via ContextSideEffectsProvider, enabling
 * deterministic story states (loading, error, empty) without module mocking.
 *
 * Required story states per guidelines:
 *   - Default (with initial greeting)
 *   - Speaking (input disabled while avatar talks)
 *   - Interactive (full send/receive flow)
 *   - Loading (never-resolving response)
 *   - Error (response throws)
 *   - Empty (empty greeting)
 */

import { useState } from 'react'

import { ContextSideEffectsProvider, defaultSideEffects } from '@/contexts/ContextSideEffects'
import { getInitialGreetingMock } from '@/sideEffects/getInitialGreeting.mock'
import { getResponseMock } from '@/sideEffects/getResponse.mock'

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
  <ContextSideEffectsProvider
    value={{
      getInitialGreeting: getInitialGreetingMock,
      getResponse: getResponseMock,
    }}
  >
    <ChatPanel
      isSpeaking={false}
      onSpeak={() => {}}
      className="h-[50vh] flex-shrink-0"
    />
  </ContextSideEffectsProvider>
)

/** Speaking state — input and send button are disabled. */
export const Speaking = () => (
  <ContextSideEffectsProvider
    value={{
      getInitialGreeting: getInitialGreetingMock,
      getResponse: getResponseMock,
    }}
  >
    <ChatPanel
      isSpeaking={true}
      onSpeak={() => {}}
      className="h-[50vh] flex-shrink-0"
    />
  </ContextSideEffectsProvider>
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
    <ContextSideEffectsProvider
      value={{
        getInitialGreeting: getInitialGreetingMock,
        getResponse: getResponseMock,
      }}
    >
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
    </ContextSideEffectsProvider>
  )
}

/** Full-height variant — verifies layout at different container sizes. */
export const FullHeight = () => (
  <ContextSideEffectsProvider value={defaultSideEffects}>
    <ChatPanel
      isSpeaking={false}
      onSpeak={() => {}}
      className="h-[80vh] flex-shrink-0"
    />
  </ContextSideEffectsProvider>
)

/** Loading state — response never resolves, typing indicator stays visible. */
export const Loading = () => (
  <ContextSideEffectsProvider
    value={{
      getInitialGreeting: getInitialGreetingMock,
      getResponse: () => new Promise(() => {}),
    }}
  >
    <ChatPanel
      isSpeaking={false}
      onSpeak={() => {}}
      className="h-[50vh] flex-shrink-0"
    />
  </ContextSideEffectsProvider>
)

/** Error state — response rejects, exercises the error path. */
export const ErrorState = () => (
  <ContextSideEffectsProvider
    value={{
      getInitialGreeting: getInitialGreetingMock,
      getResponse: async () => {
        throw new Error('Network failure')
      },
    }}
  >
    <ChatPanel
      isSpeaking={false}
      onSpeak={() => {}}
      className="h-[50vh] flex-shrink-0"
    />
  </ContextSideEffectsProvider>
)

/** Empty greeting — verifies the panel renders gracefully with no initial message text. */
export const EmptyGreeting = () => (
  <ContextSideEffectsProvider
    value={{
      getInitialGreeting: () => '',
      getResponse: getResponseMock,
    }}
  >
    <ChatPanel
      isSpeaking={false}
      onSpeak={() => {}}
      className="h-[50vh] flex-shrink-0"
    />
  </ContextSideEffectsProvider>
)
