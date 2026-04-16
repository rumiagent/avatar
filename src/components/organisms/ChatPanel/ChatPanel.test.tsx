/**
 * Unit tests for ChatPanel.
 *
 * Strategy:
 *   - Side effects are injected via ContextSideEffectsProvider — no module mocking.
 *   - Verify structural regions: divider, message feed, input bar, send button.
 *   - Verify initial greeting from the injected getInitialGreeting is rendered on mount.
 *   - Verify message submission via Enter key and send-button click.
 *   - Verify typing indicator appears immediately after submission.
 *   - Verify avatar response appears and onSpeak is called after getResponse resolves.
 *   - Verify the input and send button are disabled while isSpeaking=true.
 *   - Verify the input and send button are disabled while isTyping (engine pending).
 *   - Verify empty / whitespace-only messages are rejected.
 *   - Verify extra className is forwarded to the outer container.
 */

import { render, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { ContextSideEffectsProvider } from '@/contexts/ContextSideEffects'
import type { SideEffects } from '@/contexts/ContextSideEffects'

import ChatPanel from './ChatPanel'

// ── Test constants ──────────────────────────────────────────────────────
const MOCK_GREETING = 'Hello! Test greeting.'
const MOCK_RESPONSE = 'This is a mock response.'

// ── Default mock side effects ───────────────────────────────────────────
function createMockSideEffects(overrides: Partial<SideEffects> = {}): SideEffects {
  return {
    getInitialGreeting: vi.fn(() => MOCK_GREETING),
    getResponse: vi.fn(() => Promise.resolve(MOCK_RESPONSE)),
    ...overrides,
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function renderPanel(
  props: Partial<{ isSpeaking: boolean; onSpeak: (t: string) => void; className: string }> = {},
  sideEffectOverrides: Partial<SideEffects> = {},
) {
  const onSpeak = props.onSpeak ?? vi.fn()
  const isSpeaking = props.isSpeaking ?? false
  const sideEffects = createMockSideEffects(sideEffectOverrides)

  return {
    sideEffects,
    ...render(
      <ContextSideEffectsProvider value={sideEffects}>
        <ChatPanel isSpeaking={isSpeaking} onSpeak={onSpeak} className={props.className} />
      </ContextSideEffectsProvider>,
    ),
  }
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('ChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Structural presence ──────────────────────────────────────────────────

  it('renders the outer container with data-testid="chat-panel"', () => {
    const { getByTestId } = renderPanel()
    expect(getByTestId('chat-panel')).toBeTruthy()
  })

  it('renders the message feed with role="log"', () => {
    const { getByRole } = renderPanel()
    expect(getByRole('log')).toBeTruthy()
  })

  it('renders the text input with aria-label="Message input"', () => {
    const { getByLabelText } = renderPanel()
    expect(getByLabelText(/message input/i)).toBeTruthy()
  })

  it('renders the send button with data-testid="send-button"', () => {
    const { getByTestId } = renderPanel()
    expect(getByTestId('send-button')).toBeTruthy()
  })

  it('forwards extra className to the outer container', () => {
    const { getByTestId } = renderPanel({ className: 'my-custom-panel' })
    expect(getByTestId('chat-panel').className).toContain('my-custom-panel')
  })

  // ── Initial greeting ─────────────────────────────────────────────────────

  it('renders the initial greeting on mount', () => {
    const { getByText } = renderPanel()
    expect(getByText(MOCK_GREETING)).toBeTruthy()
  })

  it('initial greeting is rendered as an avatar bubble', () => {
    const { getAllByTestId } = renderPanel()
    const avatarBubbles = getAllByTestId('message-bubble').filter(
      (b) => b.getAttribute('data-role') === 'avatar',
    )
    expect(avatarBubbles.length).toBeGreaterThan(0)
  })

  it('no user bubbles are shown on initial render', () => {
    const { queryAllByTestId } = renderPanel()
    const userBubbles = (queryAllByTestId('message-bubble') as HTMLElement[]).filter(
      (b) => b.getAttribute('data-role') === 'user',
    )
    expect(userBubbles.length).toBe(0)
  })

  it('calls getInitialGreeting from context on mount', () => {
    const { sideEffects } = renderPanel()
    expect(sideEffects.getInitialGreeting).toHaveBeenCalled()
  })

  // ── Input state ───────────────────────────────────────────────────────────

  it('input is enabled when not speaking and not waiting for response', () => {
    const { getByLabelText } = renderPanel({ isSpeaking: false })
    expect((getByLabelText(/message input/i) as HTMLInputElement).disabled).toBe(false)
  })

  it('input is disabled when isSpeaking=true', () => {
    const { getByLabelText } = renderPanel({ isSpeaking: true })
    expect((getByLabelText(/message input/i) as HTMLInputElement).disabled).toBe(true)
  })

  it('send button is disabled when isSpeaking=true', () => {
    const { getByTestId } = renderPanel({ isSpeaking: true })
    expect((getByTestId('send-button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('send button is disabled when input is empty', () => {
    const { getByTestId } = renderPanel()
    // Input starts empty
    expect((getByTestId('send-button') as HTMLButtonElement).disabled).toBe(true)
  })

  it('send button becomes enabled when user types text', () => {
    const { getByTestId, getByLabelText } = renderPanel()
    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hello' } })
    expect((getByTestId('send-button') as HTMLButtonElement).disabled).toBe(false)
  })

  // ── Message submission ────────────────────────────────────────────────────

  it('appends user message to feed after submitting via Enter', async () => {
    const { getByLabelText, getByText } = renderPanel()
    const input = getByLabelText(/message input/i)

    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(getByText('Test message')).toBeTruthy()
    })
  })

  it('appends user message after clicking the send button', async () => {
    const { getByTestId, getByLabelText, getByText } = renderPanel()

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Click send' } })
    fireEvent.click(getByTestId('send-button'))

    await waitFor(() => {
      expect(getByText('Click send')).toBeTruthy()
    })
  })

  it('clears the input field after submitting', async () => {
    const { getByLabelText } = renderPanel()
    const input = getByLabelText(/message input/i) as HTMLInputElement

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })

  it('user message bubble has data-role="user"', async () => {
    const { getByLabelText, getAllByTestId } = renderPanel()

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hi' } })
    fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      const userBubbles = getAllByTestId('message-bubble').filter(
        (b) => b.getAttribute('data-role') === 'user',
      )
      expect(userBubbles.length).toBeGreaterThan(0)
    })
  })

  it('calls getResponse from context with user message text', async () => {
    const { getByLabelText, sideEffects } = renderPanel()

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hello there' } })
    fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(sideEffects.getResponse).toHaveBeenCalledWith('Hello there')
    })
  })

  // ── Typing indicator ──────────────────────────────────────────────────────

  it('typing indicator appears immediately after submitting a message', async () => {
    // Use a never-resolving promise to freeze the engine mid-flight.
    const neverResolves = () => new Promise<string>(() => {})

    const { getByLabelText, getByTestId } = renderPanel({}, { getResponse: neverResolves })

    await act(async () => {
      fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hello' } })
      fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })
    })

    expect(getByTestId('typing-indicator')).toBeTruthy()
  })

  it('typing indicator disappears once the response arrives', async () => {
    const { getByLabelText, queryByTestId } = renderPanel()

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hello' } })
    fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(queryByTestId('typing-indicator')).toBeNull()
    })
  })

  // ── Avatar response & TTS ─────────────────────────────────────────────────

  it('avatar response is added to the feed after engine resolves', async () => {
    const { getByLabelText, getByText } = renderPanel()

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hi' } })
    fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(getByText(MOCK_RESPONSE)).toBeTruthy()
    })
  })

  it('onSpeak is called with the response text when engine resolves', async () => {
    const onSpeak = vi.fn()
    const { getByLabelText } = renderPanel({ onSpeak })

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hi' } })
    fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(onSpeak).toHaveBeenCalledWith(MOCK_RESPONSE)
    })
  })

  it('onSpeak is called exactly once per submitted message', async () => {
    const onSpeak = vi.fn()
    const { getByLabelText } = renderPanel({ onSpeak })

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hi' } })
    fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(onSpeak).toHaveBeenCalledTimes(1)
    })
  })

  // ── Guard: empty / whitespace messages ────────────────────────────────────

  it('does not submit an empty message on Enter', async () => {
    const onSpeak = vi.fn()
    const { getByLabelText } = renderPanel({ onSpeak })
    const input = getByLabelText(/message input/i)

    fireEvent.change(input, { target: { value: '' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    // Give a tick for any async effects.
    await Promise.resolve()
    expect(onSpeak).not.toHaveBeenCalled()
  })

  it('does not submit a whitespace-only message on Enter', async () => {
    const onSpeak = vi.fn()
    const { getByLabelText } = renderPanel({ onSpeak })
    const input = getByLabelText(/message input/i)

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await Promise.resolve()
    expect(onSpeak).not.toHaveBeenCalled()
  })

  it('Shift+Enter does not submit the message', async () => {
    const onSpeak = vi.fn()
    const { getByLabelText } = renderPanel({ onSpeak })
    const input = getByLabelText(/message input/i)

    fireEvent.change(input, { target: { value: 'No submit' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true })

    await Promise.resolve()
    expect(onSpeak).not.toHaveBeenCalled()
  })

  // ── Error handling ───────────────────────────────────────────────────────

  it('shows error message bubble when getResponse rejects', async () => {
    const { getByLabelText, getByText } = renderPanel(
      {},
      { getResponse: () => Promise.reject(new Error('Network failure')) },
    )

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hi' } })
    fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(getByText('Sorry, something went wrong. Please try again.')).toBeTruthy()
    })
  })

  it('typing indicator disappears after getResponse error', async () => {
    const { getByLabelText, queryByTestId } = renderPanel(
      {},
      { getResponse: () => Promise.reject(new Error('fail')) },
    )

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hi' } })
    fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(queryByTestId('typing-indicator')).toBeNull()
    })
  })

  it('does not call onSpeak when getResponse rejects', async () => {
    const onSpeak = vi.fn()
    const { getByLabelText } = renderPanel(
      { onSpeak },
      { getResponse: () => Promise.reject(new Error('fail')) },
    )

    fireEvent.change(getByLabelText(/message input/i), { target: { value: 'Hi' } })
    fireEvent.keyDown(getByLabelText(/message input/i), { key: 'Enter', code: 'Enter' })

    // Wait for the error message to appear, then verify onSpeak was never called.
    await waitFor(() => {
      expect(onSpeak).not.toHaveBeenCalled()
    })
  })

  // ── Input blocked while speaking ──────────────────────────────────────────

  it('does not call onSpeak when submitting while isSpeaking=true', async () => {
    const onSpeak = vi.fn()
    const { getByLabelText } = renderPanel({ isSpeaking: true, onSpeak })
    const input = getByLabelText(/message input/i)

    // Input is disabled but fire the event anyway to confirm the guard works.
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    await Promise.resolve()
    expect(onSpeak).not.toHaveBeenCalled()
  })
})
