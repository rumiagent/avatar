/**
 * Unit tests for MessageBubble.
 *
 * Strategy:
 *   - Verify alignment and role data attributes for both avatar and user bubbles
 *   - Verify that design-system classes are applied correctly per role
 *   - Verify text content is rendered
 *   - Verify that extra className is forwarded
 */

import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MessageBubble from './MessageBubble'

describe('MessageBubble', () => {
  it('renders the provided text content', () => {
    const { getByText } = render(<MessageBubble role="avatar" text="Hello there!" />)
    expect(getByText('Hello there!')).toBeTruthy()
  })

  it('sets data-role="avatar" for avatar messages', () => {
    const { getByTestId } = render(<MessageBubble role="avatar" text="Hi" />)
    expect(getByTestId('message-bubble').getAttribute('data-role')).toBe('avatar')
  })

  it('sets data-role="user" for user messages', () => {
    const { getByTestId } = render(<MessageBubble role="user" text="Hi" />)
    expect(getByTestId('message-bubble').getAttribute('data-role')).toBe('user')
  })

  it('aligns avatar bubbles to the left (justify-start)', () => {
    const { getByTestId } = render(<MessageBubble role="avatar" text="Hi" />)
    const wrapper = getByTestId('message-bubble')
    expect(wrapper.className).toContain('justify-start')
    expect(wrapper.className).not.toContain('justify-end')
  })

  it('aligns user bubbles to the right (justify-end)', () => {
    const { getByTestId } = render(<MessageBubble role="user" text="Hi" />)
    const wrapper = getByTestId('message-bubble')
    expect(wrapper.className).toContain('justify-end')
    expect(wrapper.className).not.toContain('justify-start')
  })

  it('applies bubble-avatar class to avatar messages', () => {
    const { getByTestId } = render(<MessageBubble role="avatar" text="Hi" />)
    const bubble = getByTestId('message-bubble').firstElementChild as HTMLElement
    expect(bubble.className).toContain('bubble-avatar')
  })

  it('applies bubble-user class to user messages', () => {
    const { getByTestId } = render(<MessageBubble role="user" text="Hi" />)
    const bubble = getByTestId('message-bubble').firstElementChild as HTMLElement
    expect(bubble.className).toContain('bubble-user')
  })

  it('does not apply bubble-user to avatar messages', () => {
    const { getByTestId } = render(<MessageBubble role="avatar" text="Hi" />)
    const bubble = getByTestId('message-bubble').firstElementChild as HTMLElement
    expect(bubble.className).not.toContain('bubble-user')
  })

  it('does not apply bubble-avatar to user messages', () => {
    const { getByTestId } = render(<MessageBubble role="user" text="Hi" />)
    const bubble = getByTestId('message-bubble').firstElementChild as HTMLElement
    expect(bubble.className).not.toContain('bubble-avatar')
  })

  it('applies the fade-up animation class on mount', () => {
    const { getByTestId } = render(<MessageBubble role="avatar" text="Hi" />)
    expect(getByTestId('message-bubble').className).toContain('animate-fade-up')
  })

  it('forwards extra className to the wrapper', () => {
    const { getByTestId } = render(
      <MessageBubble role="avatar" text="Hi" className="my-custom-class" />,
    )
    expect(getByTestId('message-bubble').className).toContain('my-custom-class')
  })

  it('renders long text without truncation', () => {
    const longText = 'A'.repeat(200)
    const { getByText } = render(<MessageBubble role="avatar" text={longText} />)
    expect(getByText(longText)).toBeTruthy()
  })
})
