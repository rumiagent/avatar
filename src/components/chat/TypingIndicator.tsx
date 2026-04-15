/**
 * TypingIndicator – animated "thinking" state shown in the message feed.
 *
 * Displays three dots that bounce in sequence, giving the impression that
 * the avatar is composing a reply.  Styled to match the avatar-side message
 * bubble so it feels like a natural part of the conversation.
 *
 * The animation uses CSS classes defined in `src/styles/index.css`
 * (`typing-dot`) with `:nth-child` delays for the staggered bounce.
 *
 * Accessibility: the wrapper carries `role="status"` and `aria-label` so
 * screen readers announce that the avatar is typing without reading the
 * visual dots literally.
 *
 * @example
 *   {isTyping && <TypingIndicator />}
 */
export function TypingIndicator() {
  return (
    <div
      className="flex w-full justify-start"
      data-testid="typing-indicator"
      role="status"
      aria-label="Avatar is typing"
    >
      <div className="bubble-avatar flex items-center gap-1.5 px-4 py-3.5">
        <span className="typing-dot" aria-hidden="true" />
        <span className="typing-dot" aria-hidden="true" />
        <span className="typing-dot" aria-hidden="true" />
      </div>
    </div>
  )
}

export default TypingIndicator
