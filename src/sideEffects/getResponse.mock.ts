/**
 * Mock implementation of getResponse.
 *
 * Delegates to the intent-aware conversation engine which returns a
 * context-aware response after a simulated thinking delay.
 */
import type { GetResponse } from './getResponse'
import { getResponse as getResponseFromEngine } from '@/mocks/conversation'

export const getResponseMock: GetResponse = (userMessage: string): Promise<string> => {
  return getResponseFromEngine(userMessage)
}
