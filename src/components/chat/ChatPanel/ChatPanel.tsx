/**
 * ChatPanel – the bottom 50 vh of the app layout.
 *
 * Divided into three stacked regions:
 *   1. Panel divider — glowing hairline separating avatar from chat
 *   2. Message feed  — scrollable list of MessageBubbles (+ typing indicator)
 *   3. Input bar     — compose area with send button
 *
 * Behaviour
 * ---------
 * • User types in the input and presses Enter or the send button.
 * • The message is appended to the feed; a typing indicator appears.
 * • The intent-aware conversation engine resolves with a response (~0.8 – 1.5 s).
 * • The response is added to the feed and `onSpeak` is called so TTS begins.
 * • The input is disabled while the avatar is speaking (`isSpeaking=true`)
 *   or while a response is being awaited (`isTyping=true`).
 * • The feed auto-scrolls to the latest entry on every state change.
 *
 * No backend calls — all data flows through the intent-aware mock engine
 * (`src/mocks/conversation.ts`).
 *
 * @example
 *   <ChatPanel
 *     isSpeaking={isSpeaking}
 *     onSpeak={speak}
 *     className="h-[50vh] flex-shrink-0"
 *   />
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { getInitialGreeting, getResponse } from '@/mocks/conversation'
import { MessageBubble } from '../MessageBubble'
import { TypingIndicator } from '../TypingIndicator'

/** A single message in the conversation feed. */
export interface Message {
  id: number
  role: 'avatar' | 'user'
  text: string
}

export interface ChatPanelProps {
  /** True while TTS is playing — disables the input and send button. */
  isSpeaking: boolean
  /**
   * Called with the avatar's response text so the parent can trigger TTS.
   * Intentionally separate from message-state management: the chat panel owns
   * the conversation, the parent owns audio playback.
   */
  onSpeak: (text: string) => void
  /** Optional extra classes for the outer container. */
  className?: string
}

/** Auto-incrementing message ID (module-level so it survives re-renders). */
let _nextId = 1
function nextId(): number {
  return _nextId++
}

export function ChatPanel({ isSpeaking, onSpeak, className = '' }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: nextId(), role: 'avatar', text: getInitialGreeting() },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  /** Ref to the scrollable feed container for programmatic scrolling. */
  const feedRef = useRef<HTMLDivElement>(null)

  /** Scroll the feed to the very bottom. */
  const scrollToBottom = useCallback(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [])

  // Auto-scroll whenever the message list or typing-indicator state changes.
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  /** True when the user must wait before sending another message. */
  const isBlocked = isSpeaking || isTyping

  /** Submit handler — fires on Enter key press and send-button click. */
  const handleSubmit = useCallback(async () => {
    const text = inputValue.trim()
    if (!text || isBlocked) return

    // 1. Show user message immediately.
    setInputValue('')
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }])

    // 2. Show typing indicator while the mock engine "thinks".
    setIsTyping(true)

    try {
      const response = await getResponse(text)

      // 3. Append avatar response.
      setMessages((prev) => [...prev, { id: nextId(), role: 'avatar', text: response }])

      // 4. Trigger TTS for the response.
      onSpeak(response)
    } finally {
      setIsTyping(false)
    }
  }, [inputValue, isBlocked, onSpeak])

  /** Handle Enter key in the text input (Shift+Enter is a passthrough). */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void handleSubmit()
      }
    },
    [handleSubmit],
  )

  return (
    <div
      data-testid="chat-panel"
      className={[
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
        ref={feedRef}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        className="scrollbar-hide flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} text={msg.text} />
        ))}

        {/* Typing indicator — visible while mock engine is responding */}
        {isTyping && <TypingIndicator />}
      </div>

      {/* ── 3. Input bar — sticky at bottom ── */}
      <div
        className={[
          'shrink-0 border-t px-4 py-3',
          'border-surface-border/60',
          'bg-gradient-to-t from-surface-base to-transparent',
        ].join(' ')}
      >
        <div className="flex items-center gap-2">
          {/* Text input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something…"
            aria-label="Message input"
            disabled={isBlocked}
            className="chat-input"
          />

          {/* Send button */}
          <button
            type="button"
            data-testid="send-button"
            onClick={() => void handleSubmit()}
            disabled={isBlocked || !inputValue.trim()}
            aria-label="Send message"
            className="send-button"
          >
            {/* Arrow-right icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
