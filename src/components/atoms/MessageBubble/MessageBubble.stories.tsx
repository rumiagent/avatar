/**
 * Stories for MessageBubble – individual chat message component.
 *
 * Demonstrates both role variants (avatar / user), edge cases with
 * long content, and custom class overrides.
 */

import { MessageBubble } from './MessageBubble'

export default {
  title: 'Atoms/MessageBubble',
  component: MessageBubble,
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

/** Avatar message — lavender glow, left-aligned. */
export const AvatarMessage = () => (
  <MessageBubble role="avatar" text="Hello! How can I help you today?" />
)

/** User message — gold glow, right-aligned. */
export const UserMessage = () => (
  <MessageBubble role="user" text="Tell me about yourself." />
)

/** Short avatar message — single word. */
export const ShortMessage = () => <MessageBubble role="avatar" text="Hi!" />

/** Long avatar message — verifies max-width and text wrapping. */
export const LongAvatarMessage = () => (
  <MessageBubble
    role="avatar"
    text="I appreciate you sharing that with me. It sounds like you've been through quite a journey, and I want you to know that your feelings are completely valid. Let's take this one step at a time and explore what matters most to you right now."
  />
)

/** Long user message — verifies max-width and text wrapping. */
export const LongUserMessage = () => (
  <MessageBubble
    role="user"
    text="I've been thinking a lot lately about my career path and whether I'm making the right choices. Sometimes it feels like everyone else has it figured out, but I'm still searching for what truly makes me happy."
  />
)

/** Conversation thread — multiple messages in sequence. */
export const Conversation = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <MessageBubble role="avatar" text="Hello! How are you feeling today?" />
    <MessageBubble role="user" text="I'm doing well, thanks for asking!" />
    <MessageBubble
      role="avatar"
      text="That's wonderful to hear. Is there anything specific you'd like to talk about?"
    />
    <MessageBubble role="user" text="I'd love to learn more about mindfulness." />
  </div>
)

/** With a custom CSS class applied. */
export const WithCustomClass = () => (
  <MessageBubble role="avatar" text="Custom styled bubble" className="opacity-50" />
)
