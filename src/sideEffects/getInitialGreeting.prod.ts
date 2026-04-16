/**
 * Production implementation of getInitialGreeting.
 *
 * TODO: Replace with a real API call when a backend is available.
 */
import type { GetInitialGreeting } from './getInitialGreeting'

export const getInitialGreetingProd: GetInitialGreeting = (): string => {
  // TODO: replace with real API call to fetch the initial greeting from the backend
  throw new Error(
    'getInitialGreetingProd is not implemented. Provide a real API integration or use the mock via ContextSideEffects.',
  )
}
