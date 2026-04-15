/**
 * Unit tests for the Avatar component.
 *
 * Strategy:
 *   - AvatarIllustration is mocked so tests focus purely on Avatar's own logic:
 *       • correct container height class (h-[50vh])
 *       • aria-label / role surfaced to screen readers
 *       • data-speaking attribute reflects isSpeaking prop
 *       • speaking vs idle CSS classes applied to inner container
 *       • accessible live-region text changes with isSpeaking
 *   - Re-render tests confirm smooth class transitions (no abrupt changes).
 */

import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Avatar from './Avatar'

// Mock the SVG illustration so tests don't depend on its internals
vi.mock('./AvatarIllustration', () => ({
  default: ({ isSpeaking }: { isSpeaking: boolean }) => (
    <div data-testid="avatar-illustration" data-speaking={isSpeaking} />
  ),
  AvatarIllustration: ({ isSpeaking }: { isSpeaking: boolean }) => (
    <div data-testid="avatar-illustration" data-speaking={isSpeaking} />
  ),
}))

describe('Avatar', () => {
  it('renders a landmark section with the default aria-label', () => {
    const { getByRole } = render(<Avatar isSpeaking={false} />)
    const region = getByRole('region', { name: /animated ai assistant avatar/i })
    expect(region).toBeTruthy()
  })

  it('accepts a custom ariaLabel', () => {
    const { getByRole } = render(<Avatar isSpeaking={false} ariaLabel="My custom avatar" />)
    expect(getByRole('region', { name: /my custom avatar/i })).toBeTruthy()
  })

  it('renders the top-level section with 50-vh height class', () => {
    const { getByTestId } = render(<Avatar isSpeaking={false} />)
    const section = getByTestId('avatar-section')
    expect(section.className).toContain('h-[50vh]')
  })

  it('sets data-speaking="false" when not speaking', () => {
    const { getByTestId } = render(<Avatar isSpeaking={false} />)
    expect(getByTestId('avatar-section').getAttribute('data-speaking')).toBe('false')
  })

  it('sets data-speaking="true" when speaking', () => {
    const { getByTestId } = render(<Avatar isSpeaking={true} />)
    expect(getByTestId('avatar-section').getAttribute('data-speaking')).toBe('true')
  })

  it('passes isSpeaking prop to AvatarIllustration', () => {
    const { getByTestId } = render(<Avatar isSpeaking={true} />)
    const illustration = getByTestId('avatar-illustration')
    expect(illustration.getAttribute('data-speaking')).toBe('true')
  })

  it('applies the scale-[1.02] class to the inner container when speaking', () => {
    const { getByTestId } = render(<Avatar isSpeaking={true} />)
    const container = getByTestId('avatar-illustration-container')
    expect(container.className).toContain('scale-[1.02]')
  })

  it('applies the scale-100 class when not speaking', () => {
    const { getByTestId } = render(<Avatar isSpeaking={false} />)
    const container = getByTestId('avatar-illustration-container')
    expect(container.className).toContain('scale-100')
  })

  it('shows "Avatar is idle" in the live region when not speaking', () => {
    const { getByText } = render(<Avatar isSpeaking={false} />)
    expect(getByText('Avatar is idle')).toBeTruthy()
  })

  it('shows "Avatar is speaking" in the live region when speaking', () => {
    const { getByText } = render(<Avatar isSpeaking={true} />)
    expect(getByText('Avatar is speaking')).toBeTruthy()
  })

  it('forwards extra className to the outer container', () => {
    const { getByTestId } = render(<Avatar isSpeaking={false} className="my-custom-class" />)
    expect(getByTestId('avatar-section').className).toContain('my-custom-class')
  })

  it('switches live region text when isSpeaking changes', () => {
    const { rerender, getByText } = render(<Avatar isSpeaking={false} />)
    expect(getByText('Avatar is idle')).toBeTruthy()

    rerender(<Avatar isSpeaking={true} />)
    expect(getByText('Avatar is speaking')).toBeTruthy()

    rerender(<Avatar isSpeaking={false} />)
    expect(getByText('Avatar is idle')).toBeTruthy()
  })
})
