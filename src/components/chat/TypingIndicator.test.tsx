/**
 * Unit tests for TypingIndicator.
 *
 * Strategy:
 *   - Verify the component renders with the expected testid and ARIA attributes.
 *   - Verify exactly three dot elements are rendered.
 *   - Verify the dots carry the `typing-dot` class (CSS animation hook).
 *   - Verify dots are hidden from the accessibility tree (aria-hidden).
 *   - Verify the container exposes role="status" so screen readers announce
 *     the typing state without reading the dots literally.
 */

import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TypingIndicator from './TypingIndicator'

describe('TypingIndicator', () => {
  // ── Presence & testid ──────────────────────────────────────────────────

  it('renders with data-testid="typing-indicator"', () => {
    const { getByTestId } = render(<TypingIndicator />)
    expect(getByTestId('typing-indicator')).toBeTruthy()
  })

  // ── ARIA ───────────────────────────────────────────────────────────────

  it('has role="status" on the outer wrapper', () => {
    const { getByRole } = render(<TypingIndicator />)
    expect(getByRole('status')).toBeTruthy()
  })

  it('has an aria-label describing the typing state', () => {
    const { getByLabelText } = render(<TypingIndicator />)
    expect(getByLabelText(/avatar is typing/i)).toBeTruthy()
  })

  // ── Dot structure ─────────────────────────────────────────────────────

  it('renders exactly three dots', () => {
    // The dots are aria-hidden spans; query via CSS class rather than role.
    const { container } = render(<TypingIndicator />)
    const dots = container.querySelectorAll('.typing-dot')
    expect(dots).toHaveLength(3)
  })

  it('each dot carries the typing-dot CSS class', () => {
    const { container } = render(<TypingIndicator />)
    const dots = container.querySelectorAll('.typing-dot')
    dots.forEach((dot) => {
      expect(dot.classList.contains('typing-dot')).toBe(true)
    })
  })

  it('each dot has aria-hidden="true"', () => {
    const { container } = render(<TypingIndicator />)
    const dots = container.querySelectorAll('.typing-dot')
    dots.forEach((dot) => {
      expect(dot.getAttribute('aria-hidden')).toBe('true')
    })
  })

  // ── Alignment ─────────────────────────────────────────────────────────

  it('outer wrapper uses justify-start (left-aligned like avatar bubbles)', () => {
    const { getByTestId } = render(<TypingIndicator />)
    expect(getByTestId('typing-indicator').className).toContain('justify-start')
  })

  // ── Bubble styling ────────────────────────────────────────────────────

  it('inner bubble carries the bubble-avatar class', () => {
    const { container } = render(<TypingIndicator />)
    const bubble = container.querySelector('.bubble-avatar')
    expect(bubble).toBeTruthy()
  })
})
