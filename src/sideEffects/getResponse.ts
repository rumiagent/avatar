/**
 * Contract for retrieving an avatar response to a user message.
 *
 * @throws Error — must be replaced by a real or mock implementation via ContextSideEffects.
 */
export type GetResponse = (userMessage: string) => Promise<string>

export const getResponse: GetResponse = async (): Promise<string> => {
  throw new Error('Not implemented')
}
