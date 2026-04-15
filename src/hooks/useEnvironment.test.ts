import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useEnvironment } from './useEnvironment'

describe('useEnvironment', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the default environment when nothing is persisted', () => {
    const { result } = renderHook(() => useEnvironment())
    expect(result.current.environment.id).toBe('apartment')
  })

  it('reads the persisted environment from localStorage', () => {
    localStorage.setItem('avatar-environment', 'kitchen')
    const { result } = renderHook(() => useEnvironment())
    expect(result.current.environment.id).toBe('kitchen')
  })

  it('falls back to default when localStorage has an unknown id', () => {
    localStorage.setItem('avatar-environment', 'mars-base')
    const { result } = renderHook(() => useEnvironment())
    expect(result.current.environment.id).toBe('apartment')
  })

  it('updates the environment and persists to localStorage', () => {
    const { result } = renderHook(() => useEnvironment())

    act(() => {
      result.current.setEnvironmentId('evening-lounge')
    })

    expect(result.current.environment.id).toBe('evening-lounge')
    expect(localStorage.getItem('avatar-environment')).toBe('evening-lounge')
  })

  it('handles localStorage errors gracefully', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    const { result } = renderHook(() => useEnvironment())
    expect(result.current.environment.id).toBe('apartment')
  })
})
