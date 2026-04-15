/**
 * MessageBubble – a single chat message rendered in the conversation feed.
 *
 * Visual identity:
 *   • Avatar messages: lavender-tinted glow, left-aligned, rounded with a
 *     small bottom-left notch — distinct "assistant voice" feel.
 *   • User messages: warm-gold glow, right-aligned, mirrored notch shape —
 *     warmer colour temperature anchors the human side of the conversation.
 *
 * The glow is purely CSS (box-shadow + border) — no third-party library needed.
 * Entry animation (fade-up) plays once on mount via the `animate-fade-up` class.
 *
 * @example
 *   <MessageBubble role="avatar" text="Hello, how can I help?" />
 *   <MessageBubble role="user"   text="Tell me about yourself." />
 */

export type MessageRole = 'avatar' | 'user'

export interface MessageBubbleProps {
  /** Who sent the message — determines alignment and visual style. */
  role: MessageRole
  /** The text content to display inside the bubble. */
  text: string
  /** Optional additional classes for the outermost wrapper. */
  className?: string
}

export function MessageBubble({ role, text, className = '' }: MessageBubbleProps) {
  const isAvatar = role === 'avatar'

  return (
    <div
      className={[
        'flex w-full animate-fade-up',
        isAvatar ? 'justify-start' : 'justify-end',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid="message-bubble"
      data-role={role}
    >
      <div
        className={[
          // Max width so long messages don't span the full panel
          'max-w-[78%] px-4 py-3 text-sm leading-relaxed',
          // Role-specific design-system class (defined in index.css)
          isAvatar ? 'bubble-avatar text-white/90' : 'bubble-user text-white/80',
        ].join(' ')}
      >
        {text}
      </div>
    </div>
  )
}

export default MessageBubble
