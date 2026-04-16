import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { ContextSideEffectsProvider } from './contexts/ContextSideEffects'
import { getInitialGreetingMock } from './sideEffects/getInitialGreeting.mock'
import { getResponseMock } from './sideEffects/getResponse.mock'

/**
 * While no real backend exists, the app uses mock side-effect implementations.
 * When a backend is available, swap these for the prod implementations.
 */
const sideEffects = {
  getInitialGreeting: getInitialGreetingMock,
  getResponse: getResponseMock,
}

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

createRoot(rootEl).render(
  <StrictMode>
    <ContextSideEffectsProvider value={sideEffects}>
      <App />
    </ContextSideEffectsProvider>
  </StrictMode>,
)
