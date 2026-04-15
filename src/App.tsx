/**
 * App – root component and layout shell.
 *
 * Layout contract:
 *   • The viewport is divided exactly 50 / 50 between the avatar panel (top)
 *     and the chat panel (bottom).  Both panels are always visible with no
 *     outer-page scrollbar; each panel manages its own internal scroll.
 *   • Responsive down to 375 px width — no horizontal scroll introduced.
 *   • `isSpeaking` state is the single source of truth wired to both panels:
 *       – Avatar panel: triggers speaking animation + glow intensification
 *       – Chat panel: disables the input while TTS is active
 *
 * TTS integration:
 *   • `useTTS` drives the avatar's speaking animation via its `isSpeaking` flag.
 *   • When the mock engine returns a response, ChatPanel calls `onSpeak(text)`
 *     which triggers speech synthesis for that text.
 *   • The input bar is disabled while `isSpeaking` is true — users must wait
 *     for the avatar to finish before sending the next message.
 *   • When `speechSynthesis` is unavailable the animation still plays so the
 *     UI remains functional as a demo.
 */

import Avatar from '@/components/avatar/Avatar'
import ChatPanel from '@/components/chat/ChatPanel'
import { useTTS } from '@/hooks/useTTS'

function App() {
  const { speak, isSpeaking } = useTTS()

  return (
    /*
     * Outer shell: full-viewport height, flex-column, overflow-hidden.
     * `overflow-hidden` prevents any outer-page scrollbar from appearing.
     * Both child panels are `h-[50vh]` → they equally share the viewport.
     */
    <div className="flex h-screen flex-col overflow-hidden bg-surface-base">
      {/* ── Top 50 %: Avatar panel ── */}
      <Avatar isSpeaking={isSpeaking} className="h-[50vh] flex-shrink-0" />

      {/* ── Bottom 50 %: Chat panel ── */}
      <ChatPanel isSpeaking={isSpeaking} onSpeak={speak} className="h-[50vh] flex-shrink-0" />
    </div>
  )
}

export default App
