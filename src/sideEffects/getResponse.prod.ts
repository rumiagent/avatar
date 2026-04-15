/**
 * Production implementation of getResponse.
 *
 * TODO: Replace with a real API call when a backend is available.
 * For now, delegates to the mock conversation engine.
 */
import type { GetResponse } from './getResponse'
import { getResponse as getResponseFromEngine } from '@/mocks/conversation'

export const getResponseProd: GetResponse = (userMessage: string): Promise<string> => {
  return getResponseFromEngine(userMessage)
}
