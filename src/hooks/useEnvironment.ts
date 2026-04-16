/**
 * useEnvironment — manages the active background environment.
 *
 * Persists the selected environment id to localStorage so the choice
 * survives page reloads.  Returns the current environment object plus
 * a setter that accepts an environment id string.
 */

import { useCallback, useState } from 'react'

import {
  DEFAULT_ENVIRONMENT_ID,
  getEnvironmentById,
  type Environment,
} from '@/data/environments'

const STORAGE_KEY = 'avatar-environment'

/** Read the persisted environment id, falling back to the default. */
const readPersistedId = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ENVIRONMENT_ID
  } catch {
    return DEFAULT_ENVIRONMENT_ID
  }
}

/** Write the environment id to localStorage (best-effort). */
const persistId = (id: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* quota exceeded or private browsing — silently ignore */
  }
}

export interface UseEnvironmentReturn {
  environment: Environment
  setEnvironmentId: (id: string) => void
}

export const useEnvironment = (): UseEnvironmentReturn => {
  const [environment, setEnvironment] = useState<Environment>(() =>
    getEnvironmentById(readPersistedId()),
  )

  const setEnvironmentId = useCallback((id: string) => {
    const next = getEnvironmentById(id)
    setEnvironment(next)
    persistId(next.id)
  }, [])

  return { environment, setEnvironmentId }
}
