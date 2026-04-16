import { describe, expect, it } from 'vitest'

import {
  DEFAULT_ENVIRONMENT_ID,
  environments,
  getEnvironmentById,
} from './environments'

describe('environments', () => {
  it('has at least 2 distinct environments', () => {
    expect(environments.length).toBeGreaterThanOrEqual(2)
    const ids = environments.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every environment has required fields', () => {
    for (const env of environments) {
      expect(env.id).toBeTruthy()
      expect(env.label).toBeTruthy()
      expect(env.description).toBeTruthy()
      expect(env.background).toBeTruthy()
      expect(env.thumbnail).toBeTruthy()
    }
  })

  it('DEFAULT_ENVIRONMENT_ID matches an existing environment', () => {
    const match = environments.find((e) => e.id === DEFAULT_ENVIRONMENT_ID)
    expect(match).toBeDefined()
  })
})

describe('getEnvironmentById', () => {
  it('returns the correct environment for a valid id', () => {
    const env = getEnvironmentById('kitchen')
    expect(env.id).toBe('kitchen')
    expect(env.label).toBe('Kitchen')
  })

  it('falls back to the first environment for an unknown id', () => {
    const env = getEnvironmentById('nonexistent')
    expect(env.id).toBe(environments[0].id)
  })
})
