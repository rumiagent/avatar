import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { BackgroundLayer, TRANSITION_MS } from './BackgroundLayer'
import { environments } from '@/data/environments'

describe('BackgroundLayer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the background-layer container', () => {
    render(<BackgroundLayer environment={environments[0]} />)
    expect(screen.getByTestId('background-layer')).toBeInTheDocument()
  })

  it('is aria-hidden so screen readers skip it', () => {
    render(<BackgroundLayer environment={environments[0]} />)
    expect(screen.getByTestId('background-layer')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders styled layers for the environment background', () => {
    render(<BackgroundLayer environment={environments[0]} />)
    const container = screen.getByTestId('background-layer')
    // Should have at least 2 children: front layer + vignette overlay
    expect(container.children.length).toBeGreaterThanOrEqual(2)
    // The front layer should have opacity and transition styles
    const frontLayer = container.children[0] as HTMLElement
    expect(frontLayer.style.opacity).toBeDefined()
    expect(frontLayer.style.transitionDuration).toBe(`${TRANSITION_MS}ms`)
  })

  it('renders the vignette overlay', () => {
    render(<BackgroundLayer environment={environments[0]} />)
    const container = screen.getByTestId('background-layer')
    const children = container.children
    // Last child should be the vignette overlay
    const vignette = children[children.length - 1] as HTMLElement
    expect(vignette.style.background).toContain('radial-gradient')
  })

  it('creates a back layer when environment changes', () => {
    const { rerender } = render(<BackgroundLayer environment={environments[0]} />)
    const container = screen.getByTestId('background-layer')

    // Initially: front layer + vignette = 2 children
    // (no back layer because there's no previous environment)
    const initialChildCount = container.children.length

    act(() => {
      rerender(<BackgroundLayer environment={environments[1]} />)
    })

    // After change: back layer + front layer + vignette = 3 children
    expect(container.children.length).toBe(initialChildCount + 1)
  })

  it('removes the back layer after transition completes', () => {
    const { rerender } = render(<BackgroundLayer environment={environments[0]} />)
    const container = screen.getByTestId('background-layer')
    const initialChildCount = container.children.length

    act(() => {
      rerender(<BackgroundLayer environment={environments[1]} />)
    })

    // Back layer should exist
    expect(container.children.length).toBe(initialChildCount + 1)

    // Fast-forward past the transition duration
    act(() => {
      vi.advanceTimersByTime(TRANSITION_MS + 100)
    })

    // Back layer should be removed
    expect(container.children.length).toBe(initialChildCount)
  })

  it('does not create a back layer when re-rendered with the same environment', () => {
    const { rerender } = render(<BackgroundLayer environment={environments[0]} />)
    const container = screen.getByTestId('background-layer')
    const initialChildCount = container.children.length

    act(() => {
      rerender(<BackgroundLayer environment={environments[0]} />)
    })

    expect(container.children.length).toBe(initialChildCount)
  })
})
