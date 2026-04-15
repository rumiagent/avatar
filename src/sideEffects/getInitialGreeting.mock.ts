/**
 * Mock implementation of getInitialGreeting.
 *
 * Delegates to the intent-aware conversation engine's greeting.
 */
import type { GetInitialGreeting } from './getInitialGreeting'
import { getInitialGreeting as getGreetingFromEngine } from '@/mocks/conversation'

export const getInitialGreetingMock: GetInitialGreeting = (): string => {
  return getGreetingFromEngine()
}
