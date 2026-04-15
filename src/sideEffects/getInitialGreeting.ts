/**
 * Contract for retrieving the initial greeting shown in the chat feed on load.
 *
 * @throws Error — must be replaced by a real or mock implementation via ContextSideEffects.
 */
export type GetInitialGreeting = () => string

export const getInitialGreeting: GetInitialGreeting = (): string => {
  throw new Error('Not implemented')
}
