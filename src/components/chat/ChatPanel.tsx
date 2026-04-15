/**
 * ChatPanel – the bottom 50 vh of the app layout.
 *
 * Divided into three stacked regions:
 *   1. Panel divider — a glowing hairline separating avatar from chat
 *   2. Message feed  — scrollable list of MessageBubbles
 *   3. Input bar     — sticky-to-bottom compose area + speak-toggle button
 *
 * The panel has `overflow-hidden` on its outer shell; only the message feed
 * (`overflow-y-auto scrollbar-hide`) scrolls independently.  This matches the
 * layout requirement: no outer-page scrollbar, each panel scrolls on its own.
 *
 * Design:
 *   • Deep dark background with a subtle inner glow
 *   • Lavender hairline divider between avatar and chat
 *   • Avatar bubbles: lavender glow  |  User bubbles: gold glow
 *   • Input bar uses a frosted-dark pill, focus ring uses glow-primary colour
 *   • Speak toggle animates to a filled lavender pill when active
 *
 * This is a presentational placeholder — real conversation logic lives in
 * issue #6 (chat interface) and #7 (conversation engine).
 *
 * @example
 *   <ChatPanel
 *     isSpeaking={isSpeaking}
 *     onToggleSpeaking={() => setIsSpeaking(s => !s)}
 *   />
 */

import MessageBubble from './MessageBubble'

/** Demonstration messages shown while the real conversation engine is pending. */
const DEMO_MESSAGES = [
  { id: 1, role: 'avatar' as const, text: "Hello! I'm here whenever you're ready to talk." },
  { id: 2, role: 'user' as const, text: 'Tell me a little about yourself.' },
  {
    id: 3,
    role: 'avatar' as const,
    text: "I'm your AI companion — calm, attentive, and always present. What's on your mind?",
  },
  { id: 4, role: 'user' as const, text: "I'd love to hear something uplifting." },
  {
    id: 5,
    role: 'avatar' as const,
    text: "Every conversation is a small light. I'm glad we have this one.",
  },
]

export interface ChatPanelProps {
  /** Reflects the current speaking state — styles the speak-toggle button. */
  isSpeaking: boolean
  /** Called when the user presses the speak-toggle button. */
  onToggleSpeaking: () => void
  /** Optional extra classes for the outer container. */
  className?: string
}

export function ChatPanel({ isSpeaking, onToggleSpeaking, className = '' }: ChatPanelProps) {
  return (
    <div
      data-testid="chat-panel"
      className={[
        // Layout: column flex, inner-glow, no outer scroll
        'relative flex flex-col overflow-hidden',
        'bg-gradient-to-b from-[#0f0f1c] to-surface-base',
        'inner-glow',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── 1. Panel divider — glowing hairline ── */}
      <div className="panel-divider" aria-hidden="true" />

      {/* ── 2. Message feed — scrollable ── */}
      <div
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        className="scrollbar-hide flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      >
        {DEMO_MESSAGES.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} text={msg.text} />
        ))}
      </div>

      {/* ── 3. Input bar — sticky at bottom ── */}
      <div
        className={[
          'shrink-0 border-t px-4 py-3',
          'border-surface-border/60',
          // Subtle upward gradient so the input bar reads as "grounded"
          'bg-gradient-to-t from-surface-base to-transparent',
        ].join(' ')}
      >
        <div className="flex items-center gap-3">
          {/* Text input */}
          <input
            type="text"
            placeholder="Type a message…"
            aria-label="Message input"
            className="chat-input"
          />

          {/* Speak toggle */}
          <button
            type="button"
            data-testid="speak-toggle"
            onClick={onToggleSpeaking}
            aria-pressed={isSpeaking}
            aria-label={isSpeaking ? 'Stop speaking' : 'Start speaking'}
            className={[
              'shrink-0 rounded-full px-5 py-2 text-sm font-medium tracking-wide',
              'transition-all duration-300',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-glow-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
              isSpeaking
                ? 'bg-glow-primary text-surface-base shadow-glow'
                : 'border border-glow-primary/40 text-glow-primary hover:bg-glow-primary/10',
            ].join(' ')}
          >
            {isSpeaking ? 'Stop' : 'Speak'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
