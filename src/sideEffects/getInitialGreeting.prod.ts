/**
 * Production implementation of getInitialGreeting.
 *
 * TODO: Replace with a real API call when a backend is available.
 * For now, delegates to the mock conversation engine.
 */
import type { GetInitialGreeting } from './getInitialGreeting'
import { getInitialGreeting as getGreetingFromEngine } from '@/mocks/conversation'

export const getInitialGreetingProd: GetInitialGreeting = (): string => {
  return getGreetingFromEngine()
}
