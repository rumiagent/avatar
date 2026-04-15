import { useState } from 'react'
import Avatar from '@/components/avatar/Avatar'

function App() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      {/* Avatar occupies the top 50 vh */}
      <Avatar isSpeaking={isSpeaking} />

      {/* Bottom half — placeholder content / controls */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8">
        <p className="text-sm text-gray-400">
          {isSpeaking ? 'Speaking…' : 'Idle — press the button to simulate speech'}
        </p>

        <button
          type="button"
          onClick={() => setIsSpeaking((s) => !s)}
          className={[
            'rounded-full px-8 py-3 text-sm font-semibold tracking-wide',
            'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-glow-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
            isSpeaking
              ? 'bg-glow-primary text-gray-950 shadow-glow'
              : 'border border-glow-primary/40 bg-transparent text-glow-primary hover:bg-glow-primary/10',
          ].join(' ')}
        >
          {isSpeaking ? 'Stop speaking' : 'Start speaking'}
        </button>
      </div>
    </div>
  )
}

export default App
