/* eslint-disable react-refresh/only-export-components */
/**
 * ContextSideEffects — dependency-injection context for all side effects.
 *
 * Every side effect consumed by UI components must be provided through this
 * context so that Storybook stories and tests can swap implementations freely
 * (e.g. never-resolving promises for loading states, thrown errors for error
 * states, instant mocks for unit tests).
 *
 * Default values use the production implementations, so the app works
 * out-of-the-box without wrapping in a provider.
 *
 * @example
 *   // Override in a Storybook story:
 *   <ContextSideEffectsProvider value={{
 *     ...defaultSideEffects,
 *     getResponse: () => new Promise(() => {}),  // loading state
 *   }}>
 *     <ChatPanel isSpeaking={false} onSpeak={() => {}} />
 *   </ContextSideEffectsProvider>
 */

import { createContext } from 'react'

import { defaultSideEffects } from './defaultSideEffects'

export type { SideEffects } from './defaultSideEffects'
export { defaultSideEffects } from './defaultSideEffects'

/**
 * React context carrying the current side-effect implementations.
 * Defaults to production so wrapping in a provider is optional at the app level.
 */
export const ContextSideEffects = createContext(defaultSideEffects)

/**
 * Convenience alias for the context provider.
 *
 * @example
 *   <ContextSideEffectsProvider value={{ getInitialGreeting: () => 'Hi', getResponse: async () => 'OK' }}>
 *     <App />
 *   </ContextSideEffectsProvider>
 */
export const ContextSideEffectsProvider = ContextSideEffects.Provider
