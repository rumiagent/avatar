/**
 * AvatarIllustration – pure SVG rendering of the white-haired woman avatar.
 *
 * All animations are driven by CSS classes toggled via the `isSpeaking` prop:
 *   • Idle  : breathing, blinking, gentle hair sway (always active)
 *   • Speaking: mouth-speak animation layer activates on top of idle
 *
 * No external assets are required — the character is entirely vector-based.
 */

interface AvatarIllustrationProps {
  isSpeaking: boolean
  className?: string
}

export function AvatarIllustration({ isSpeaking, className = '' }: AvatarIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 520"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        {/* Skin gradient — warm ivory */}
        <radialGradient id="av-skin" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5e6d3" />
          <stop offset="70%" stopColor="#e8d5bc" />
          <stop offset="100%" stopColor="#d4b896" />
        </radialGradient>

        {/* Hair — white-silver with shimmer */}
        <linearGradient id="av-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#e8e8f0" />
          <stop offset="60%" stopColor="#d0d0e0" />
          <stop offset="100%" stopColor="#b8b8cc" />
        </linearGradient>

        {/* Hair highlight shimmer */}
        <linearGradient id="av-hair-shine" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c8c8dc" stopOpacity="0.5" />
        </linearGradient>

        {/* Ambient glow behind avatar */}
        <radialGradient id="av-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#818cf8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>

        {/* Iris gradient */}
        <radialGradient id="av-iris" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#1f2937" />
        </radialGradient>

        {/* Shoulder/body gradient */}
        <linearGradient id="av-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d2640" />
          <stop offset="100%" stopColor="#1a1628" />
        </linearGradient>

        {/* Neck shadow */}
        <linearGradient id="av-neck" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c9a882" />
          <stop offset="40%" stopColor="#e8d5bc" />
          <stop offset="60%" stopColor="#e8d5bc" />
          <stop offset="100%" stopColor="#c9a882" />
        </linearGradient>

        {/* Lip color */}
        <linearGradient id="av-lips" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c47a7a" />
          <stop offset="100%" stopColor="#a85a5a" />
        </linearGradient>

        {/* Clip path for eye blink */}
        <clipPath id="av-left-eye-clip">
          <ellipse cx="148" cy="218" rx="22" ry="16" />
        </clipPath>
        <clipPath id="av-right-eye-clip">
          <ellipse cx="252" cy="218" rx="22" ry="16" />
        </clipPath>
      </defs>

      {/* ── Ambient glow backdrop ── */}
      <ellipse
        cx="200"
        cy="300"
        rx="190"
        ry="210"
        fill="url(#av-glow)"
        className="animate-ambient-pulse"
        style={{ animation: 'ambientPulse 3s ease-in-out infinite' }}
      />

      {/* ── Shoulders / body ── */}
      <ellipse cx="200" cy="520" rx="170" ry="90" fill="url(#av-body)" />
      {/* Collarbone area */}
      <ellipse cx="200" cy="460" rx="130" ry="50" fill="url(#av-body)" />

      {/* ── Neck ── */}
      <rect x="170" y="370" width="60" height="80" rx="18" fill="url(#av-neck)" />

      {/* ─────────────────────────────────────────────
           Breathing group — everything above shoulders
          ───────────────────────────────────────────── */}
      <g
        style={{
          transformOrigin: '200px 420px',
          animation: 'breathe 4s ease-in-out infinite',
        }}
      >
        {/* ── Hair — back layer (behind face) ── */}
        {/* Long flowing hair behind the face */}
        <path
          d="M 90 200 Q 60 280 70 380 Q 80 440 110 460 Q 80 360 85 280 Q 88 240 100 210 Z"
          fill="url(#av-hair)"
          opacity="0.9"
        />
        <path
          d="M 310 200 Q 340 280 330 380 Q 320 440 290 460 Q 320 360 315 280 Q 312 240 300 210 Z"
          fill="url(#av-hair)"
          opacity="0.9"
        />

        {/* ── Hair — top/crown ── */}
        {/* Left side swing */}
        <path
          d="M 108 155
             Q 90 110 110 80
             Q 130 55 160 60
             Q 140 90 138 130
             Z"
          fill="url(#av-hair)"
          style={{
            transformOrigin: '200px 120px',
            animation: 'hairSway 6s ease-in-out infinite',
          }}
        />
        {/* Crown mass */}
        <path
          d="M 108 155
             Q 100 100 130 70
             Q 160 45 200 48
             Q 240 45 270 70
             Q 300 100 292 155
             Q 260 120 200 118
             Q 140 120 108 155
             Z"
          fill="url(#av-hair)"
        />
        {/* Right side sweep */}
        <path
          d="M 292 155
             Q 310 110 290 80
             Q 270 55 240 60
             Q 260 90 262 130
             Z"
          fill="url(#av-hair)"
          style={{
            transformOrigin: '200px 120px',
            animation: 'hairSway 6s ease-in-out infinite reverse',
          }}
        />

        {/* Hair shimmer highlight */}
        <path
          d="M 150 60 Q 180 50 210 52 Q 185 70 165 90 Q 155 75 150 60 Z"
          fill="url(#av-hair-shine)"
          opacity="0.7"
        />

        {/* ── Face ── */}
        <ellipse cx="200" cy="230" rx="118" ry="138" fill="url(#av-skin)" />

        {/* Subtle cheek warmth */}
        <ellipse cx="136" cy="258" rx="28" ry="18" fill="#e0a090" opacity="0.18" />
        <ellipse cx="264" cy="258" rx="28" ry="18" fill="#e0a090" opacity="0.18" />

        {/* ── Eyebrows ── */}
        <path
          d="M 122 196 Q 140 188 165 192"
          stroke="#8a7a6a"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 235 192 Q 260 188 278 196"
          stroke="#8a7a6a"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Left eye ── */}
        <g clipPath="url(#av-left-eye-clip)">
          {/* White */}
          <ellipse cx="148" cy="218" rx="22" ry="16" fill="white" />
          {/* Iris */}
          <circle
            cx="148"
            cy="218"
            r="11"
            fill="url(#av-iris)"
            style={{
              transformOrigin: '148px 218px',
              animation: 'blink 4s ease-in-out infinite',
            }}
          />
          {/* Pupil */}
          <circle cx="147" cy="217" r="5.5" fill="#0f1117" />
          {/* Catchlight */}
          <circle cx="143" cy="213" r="2.5" fill="white" opacity="0.9" />
          {/* Lid overlay for blink */}
          <ellipse
            cx="148"
            cy="208"
            rx="22"
            ry="16"
            fill="#e8d5bc"
            style={{
              transformOrigin: '148px 208px',
              animation: 'blink 4s ease-in-out infinite',
            }}
          />
        </g>
        {/* Upper lash line */}
        <path
          d="M 126 212 Q 148 204 170 212"
          stroke="#2d2020"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Right eye ── */}
        <g clipPath="url(#av-right-eye-clip)">
          {/* White */}
          <ellipse cx="252" cy="218" rx="22" ry="16" fill="white" />
          {/* Iris */}
          <circle
            cx="252"
            cy="218"
            r="11"
            fill="url(#av-iris)"
            style={{
              transformOrigin: '252px 218px',
              animation: 'blink 4s ease-in-out infinite',
            }}
          />
          {/* Pupil */}
          <circle cx="251" cy="217" r="5.5" fill="#0f1117" />
          {/* Catchlight */}
          <circle cx="247" cy="213" r="2.5" fill="white" opacity="0.9" />
          {/* Lid overlay for blink */}
          <ellipse
            cx="252"
            cy="208"
            rx="22"
            ry="16"
            fill="#e8d5bc"
            style={{
              transformOrigin: '252px 208px',
              animation: 'blink 4s ease-in-out infinite',
            }}
          />
        </g>
        {/* Upper lash line */}
        <path
          d="M 230 212 Q 252 204 274 212"
          stroke="#2d2020"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Nose ── */}
        <path
          d="M 200 238 Q 192 265 188 272 Q 196 278 200 276 Q 204 278 212 272 Q 208 265 200 238 Z"
          fill="#c9a882"
          opacity="0.55"
        />
        <path
          d="M 188 272 Q 196 280 212 272"
          stroke="#b8906a"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />

        {/* ── Mouth ── */}
        {/* Lip gap / mouth opening */}
        <g
          style={{
            transformOrigin: '200px 310px',
          }}
        >
          {/* Upper lip */}
          <path
            d="M 170 304 Q 185 298 200 302 Q 215 298 230 304 Q 215 308 200 306 Q 185 308 170 304 Z"
            fill="url(#av-lips)"
          />

          {/* Lower lip — animates downward when speaking */}
          <path
            d="M 170 304 Q 185 322 200 324 Q 215 322 230 304"
            fill="url(#av-lips)"
            style={
              isSpeaking
                ? {
                    transformOrigin: '200px 304px',
                    animation: 'mouthSpeak 0.22s ease-in-out infinite alternate',
                  }
                : undefined
            }
          />

          {/* Mouth interior (visible when open) */}
          {isSpeaking && (
            <ellipse
              cx="200"
              cy="310"
              rx="24"
              ry="8"
              fill="#3d1a1a"
              style={{
                transformOrigin: '200px 304px',
                animation: 'mouthSpeak 0.22s ease-in-out infinite alternate',
              }}
            />
          )}

          {/* Lip corners */}
          <circle cx="170" cy="304" r="3" fill="#b06060" opacity="0.8" />
          <circle cx="230" cy="304" r="3" fill="#b06060" opacity="0.8" />

          {/* Cupid's bow highlight */}
          <path
            d="M 185 300 Q 192 296 200 299 Q 208 296 215 300"
            stroke="#e8a0a0"
            strokeWidth="1.2"
            fill="none"
            opacity="0.6"
          />
        </g>

        {/* ── Hair — front layer (over face edges) ── */}
        {/* Left fringe strands */}
        <path
          d="M 108 155 Q 98 190 100 230 Q 90 200 88 165 Q 95 135 108 155 Z"
          fill="url(#av-hair)"
          opacity="0.85"
        />
        <path
          d="M 115 148 Q 103 175 106 210"
          stroke="url(#av-hair-shine)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        {/* Right fringe strands */}
        <path
          d="M 292 155 Q 302 190 300 230 Q 310 200 312 165 Q 305 135 292 155 Z"
          fill="url(#av-hair)"
          opacity="0.85"
        />
      </g>

      {/* ── Subtle collar / neckline ── */}
      <path
        d="M 150 450 Q 200 440 250 450"
        stroke="#4a3f5c"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}

export default AvatarIllustration
