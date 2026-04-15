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
 *       – Chat panel: styles the speak-toggle button
 */

import { useState } from 'react'
import Avatar from '@/components/avatar/Avatar'
import ChatPanel from '@/components/chat/ChatPanel'

function App() {
  const [isSpeaking, setIsSpeaking] = useState(false)

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
      <ChatPanel
        isSpeaking={isSpeaking}
        onToggleSpeaking={() => setIsSpeaking((s) => !s)}
        className="h-[50vh] flex-shrink-0"
      />
    </div>
  )
}

export default App
