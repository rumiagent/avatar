/**
 * Unit tests for ChatPanel.
 *
 * Strategy:
 *   - Verify structural regions: divider, message feed, input bar
 *   - Verify speak-toggle button reflects isSpeaking state (aria-pressed, text)
 *   - Verify onToggleSpeaking callback fires on button click
 *   - Verify demo messages are rendered with correct roles
 *   - Verify the message feed has appropriate ARIA log role
 *   - Verify extra className is forwarded to the outer container
 */

import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ChatPanel from './ChatPanel'

describe('ChatPanel', () => {
  // ── Structural presence ────────────────────────────────────────────────

  it('renders the outer container with data-testid="chat-panel"', () => {
    const { getByTestId } = render(<ChatPanel isSpeaking={false} onToggleSpeaking={() => {}} />)
    expect(getByTestId('chat-panel')).toBeTruthy()
  })

  it('renders the message feed with role="log"', () => {
    const { getByRole } = render(<ChatPanel isSpeaking={false} onToggleSpeaking={() => {}} />)
    expect(getByRole('log')).toBeTruthy()
  })

  it('renders the text input with accessible label', () => {
    const { getByLabelText } = render(<ChatPanel isSpeaking={false} onToggleSpeaking={() => {}} />)
    expect(getByLabelText(/message input/i)).toBeTruthy()
  })

  it('renders the speak-toggle button', () => {
    const { getByTestId } = render(<ChatPanel isSpeaking={false} onToggleSpeaking={() => {}} />)
    expect(getByTestId('speak-toggle')).toBeTruthy()
  })

  // ── Demo messages ──────────────────────────────────────────────────────

  it('renders at least one avatar message bubble', () => {
    const { getAllByTestId } = render(<ChatPanel isSpeaking={false} onToggleSpeaking={() => {}} />)
    const bubbles = getAllByTestId('message-bubble')
    const avatarBubbles = bubbles.filter((b) => b.getAttribute('data-role') === 'avatar')
    expect(avatarBubbles.length).toBeGreaterThan(0)
  })

  it('renders at least one user message bubble', () => {
    const { getAllByTestId } = render(<ChatPanel isSpeaking={false} onToggleSpeaking={() => {}} />)
    const bubbles = getAllByTestId('message-bubble')
    const userBubbles = bubbles.filter((b) => b.getAttribute('data-role') === 'user')
    expect(userBubbles.length).toBeGreaterThan(0)
  })

  // ── Speak-toggle: idle state ──────────────────────────────────────────

  it('shows "Speak" label when not speaking', () => {
    const { getByTestId } = render(<ChatPanel isSpeaking={false} onToggleSpeaking={() => {}} />)
    expect(getByTestId('speak-toggle').textContent).toBe('Speak')
  })

  it('sets aria-pressed="false" when not speaking', () => {
    const { getByTestId } = render(<ChatPanel isSpeaking={false} onToggleSpeaking={() => {}} />)
    expect(getByTestId('speak-toggle').getAttribute('aria-pressed')).toBe('false')
  })

  // ── Speak-toggle: speaking state ──────────────────────────────────────

  it('shows "Stop" label when speaking', () => {
    const { getByTestId } = render(<ChatPanel isSpeaking={true} onToggleSpeaking={() => {}} />)
    expect(getByTestId('speak-toggle').textContent).toBe('Stop')
  })

  it('sets aria-pressed="true" when speaking', () => {
    const { getByTestId } = render(<ChatPanel isSpeaking={true} onToggleSpeaking={() => {}} />)
    expect(getByTestId('speak-toggle').getAttribute('aria-pressed')).toBe('true')
  })

  it('applies shadow-glow class to the button when speaking', () => {
    const { getByTestId } = render(<ChatPanel isSpeaking={true} onToggleSpeaking={() => {}} />)
    expect(getByTestId('speak-toggle').className).toContain('shadow-glow')
  })

  // ── Interaction ────────────────────────────────────────────────────────

  it('calls onToggleSpeaking when speak-toggle is clicked', () => {
    const handler = vi.fn()
    const { getByTestId } = render(<ChatPanel isSpeaking={false} onToggleSpeaking={handler} />)
    fireEvent.click(getByTestId('speak-toggle'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('calls onToggleSpeaking again on second click', () => {
    const handler = vi.fn()
    const { getByTestId } = render(<ChatPanel isSpeaking={true} onToggleSpeaking={handler} />)
    fireEvent.click(getByTestId('speak-toggle'))
    fireEvent.click(getByTestId('speak-toggle'))
    expect(handler).toHaveBeenCalledTimes(2)
  })

  // ── className forwarding ──────────────────────────────────────────────

  it('forwards extra className to the outer container', () => {
    const { getByTestId } = render(
      <ChatPanel isSpeaking={false} onToggleSpeaking={() => {}} className="my-custom-panel" />,
    )
    expect(getByTestId('chat-panel').className).toContain('my-custom-panel')
  })
})
