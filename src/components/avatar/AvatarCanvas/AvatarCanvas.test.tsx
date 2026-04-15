/**
 * Unit tests for AvatarCanvas.
 *
 * The Rive runtime loads a WASM binary at runtime, so we mock the entire
 * @rive-app/react-canvas module and exercise only the component's own logic:
 *   - renders without crashing
 *   - exposes the correct imperative handle methods
 *   - guards mouthOpen values to [0, 1]
 */

import { createRef } from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AvatarCanvas, { type AvatarHandle } from './AvatarCanvas'

// ---------------------------------------------------------------------------
// Mock @rive-app/react-canvas
// vi.mock is hoisted, so the factory must use inline state — no top-level refs.
// ---------------------------------------------------------------------------

vi.mock('@rive-app/react-canvas', () => {
  const isSpeakingInput = { value: false }
  const mouthOpenInput = { value: 0 }

  return {
    useRive: vi.fn(() => ({
      rive: {},
      RiveComponent: () => <canvas data-testid="rive-canvas" />,
    })),
    useStateMachineInput: vi.fn((_rive: unknown, _sm: string, inputName: string) => {
      if (inputName === 'isSpeaking') return isSpeakingInput
      if (inputName === 'mouthOpen') return mouthOpenInput
      return null
    }),
    // expose the objects so tests can inspect them
    __isSpeakingInput: isSpeakingInput,
    __mouthOpenInput: mouthOpenInput,
  }
})

// Helper to grab the shared input stubs after the mock is loaded.
async function getInputStubs() {
  const mod = await import('@rive-app/react-canvas')
  // The vitest module mock exports these as extra keys.
  const m = mod as typeof mod & {
    __isSpeakingInput: { value: boolean | number }
    __mouthOpenInput: { value: boolean | number }
  }
  return { isSpeakingInput: m.__isSpeakingInput, mouthOpenInput: m.__mouthOpenInput }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AvatarCanvas', () => {
  beforeEach(async () => {
    const { isSpeakingInput, mouthOpenInput } = await getInputStubs()
    isSpeakingInput.value = false
    mouthOpenInput.value = 0
  })

  it('renders the Rive canvas without crashing', () => {
    const { getByTestId } = render(<AvatarCanvas src="/avatar.riv" stateMachine="AvatarSM" />)
    expect(getByTestId('rive-canvas')).toBeTruthy()
  })

  it('applies an accessible aria-label to the wrapper', () => {
    const { getByRole } = render(
      <AvatarCanvas src="/avatar.riv" stateMachine="AvatarSM" ariaLabel="AI assistant avatar" />,
    )
    expect(getByRole('img', { name: 'AI assistant avatar' })).toBeTruthy()
  })

  it('exposes setIsSpeaking via the imperative handle', async () => {
    const { isSpeakingInput } = await getInputStubs()
    const ref = createRef<AvatarHandle>()
    render(<AvatarCanvas ref={ref} src="/avatar.riv" stateMachine="AvatarSM" />)

    ref.current?.setIsSpeaking(true)
    expect(isSpeakingInput.value).toBe(true)

    ref.current?.setIsSpeaking(false)
    expect(isSpeakingInput.value).toBe(false)
  })

  it('exposes setMouthOpen via the imperative handle', async () => {
    const { mouthOpenInput } = await getInputStubs()
    const ref = createRef<AvatarHandle>()
    render(<AvatarCanvas ref={ref} src="/avatar.riv" stateMachine="AvatarSM" />)

    ref.current?.setMouthOpen(0.5)
    expect(mouthOpenInput.value).toBeCloseTo(0.5)
  })

  it('clamps setMouthOpen below 0 to 0', async () => {
    const { mouthOpenInput } = await getInputStubs()
    const ref = createRef<AvatarHandle>()
    render(<AvatarCanvas ref={ref} src="/avatar.riv" stateMachine="AvatarSM" />)

    ref.current?.setMouthOpen(-0.5)
    expect(mouthOpenInput.value).toBe(0)
  })

  it('clamps setMouthOpen above 1 to 1', async () => {
    const { mouthOpenInput } = await getInputStubs()
    const ref = createRef<AvatarHandle>()
    render(<AvatarCanvas ref={ref} src="/avatar.riv" stateMachine="AvatarSM" />)

    ref.current?.setMouthOpen(2.5)
    expect(mouthOpenInput.value).toBe(1)
  })

  it('applies a custom className to the wrapper div', () => {
    const { container } = render(
      <AvatarCanvas src="/avatar.riv" stateMachine="AvatarSM" className="h-64 w-64" />,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('w-64')
    expect(wrapper.className).toContain('h-64')
  })
})
