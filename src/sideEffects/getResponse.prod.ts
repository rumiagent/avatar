/**
 * Production implementation of getResponse.
 *
 * TODO: Replace with a real API call when a backend is available.
 */
import type { GetResponse } from './getResponse'

export const getResponseProd: GetResponse = async (
  _userMessage: string,
): Promise<string> => {
  // TODO: replace with real API call to send the user message and receive a response
  throw new Error(
    'getResponseProd is not implemented. Provide a real API integration or use the mock via ContextSideEffects.',
  )
}
