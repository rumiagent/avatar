/**
 * Stories for TypingIndicator – animated "avatar is typing" dots.
 *
 * Demonstrates the three-dot bounce animation in isolation and
 * within a conversation context.
 */

import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

export default {
  title: 'Atoms/TypingIndicator',
  component: TypingIndicator,
  decorators: [
    (Story: React.FC) => (
      <div
        style={{
          background: '#09090f',
          minHeight: '100vh',
          padding: 24,
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

/** Default — three animated bouncing dots. */
export const Default = () => <TypingIndicator />

/** In context — shown after a user message, as it would appear in the chat. */
export const InConversation = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <MessageBubble role="avatar" text="Hello! How are you today?" />
    <MessageBubble role="user" text="I'm curious about something..." />
    <TypingIndicator />
  </div>
)
