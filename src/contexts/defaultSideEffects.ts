/**
 * Default (production) side-effect implementations and the SideEffects interface.
 *
 * Extracted into its own file so that ContextSideEffects.tsx only exports
 * React context / provider values, satisfying the react-refresh/only-export-components rule.
 */

import type { GetInitialGreeting } from '@/sideEffects/getInitialGreeting'
import type { GetResponse } from '@/sideEffects/getResponse'
import { getInitialGreetingProd } from '@/sideEffects/getInitialGreeting.prod'
import { getResponseProd } from '@/sideEffects/getResponse.prod'

/** Shape of all injectable side effects. */
export interface SideEffects {
  getInitialGreeting: GetInitialGreeting
  getResponse: GetResponse
}

/** Default side effects wired to production implementations. */
export const defaultSideEffects: SideEffects = {
  getInitialGreeting: getInitialGreetingProd,
  getResponse: getResponseProd,
}
