/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ── Colors ────────────────────────────────────────────────────────────
      colors: {
        // Glow / accent system
        glow: {
          primary: '#a78bfa', // lavender
          secondary: '#818cf8', // indigo
          accent: '#c4b5fd', // light lavender
          gold: '#d4a847', // warm gold
          'gold-light': '#f0c96e', // bright gold
        },
        // Deep dark surface palette (near-black → charcoal → midnight)
        surface: {
          base: '#09090f', // near-black root background
          raised: '#0f0f18', // slightly elevated
          overlay: '#13131e', // card / panel surface
          muted: '#1b1b28', // muted / secondary surface
          border: '#252535', // subtle borders
        },
        // Midnight-blue family
        midnight: {
          950: '#050510',
          900: '#080820',
          800: '#0d0d2a',
          700: '#141438',
        },
        // Charcoal family
        charcoal: {
          900: '#111115',
          800: '#18181e',
          700: '#1f1f28',
          600: '#272738',
        },
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        // Elegant serif for headlines / display text
        serif: ['Playfair Display', 'Georgia', 'ui-serif', 'serif'],
        display: ['Playfair Display', 'Georgia', 'ui-serif', 'serif'],
        // Clean sans-serif for body copy and UI
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'display-lg': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
      },

      // ── Spacing — 4 px base grid ──────────────────────────────────────────
      // Tailwind's default already uses a 4-px scale; we document it here
      // and extend with any project-specific named steps.
      spacing: {
        4.5: '18px',
        13: '52px',
        15: '60px',
        18: '72px',
        22: '88px',
        26: '104px',
        30: '120px',
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        bubble: '1.25rem', // generous rounding for chat bubbles
        'bubble-sm': '0.875rem',
      },

      // ── Shadows / glows ───────────────────────────────────────────────────
      boxShadow: {
        // Avatar-panel ambient glows
        glow: '0 0 20px 4px rgba(167, 139, 250, 0.50)',
        'glow-lg': '0 0 40px 10px rgba(167, 139, 250, 0.40)',
        'glow-xl': '0 0 60px 20px rgba(167, 139, 250, 0.35)',
        // Gold / warm accent glow
        'glow-gold': '0 0 20px 4px rgba(212, 168, 71, 0.45)',
        'glow-gold-lg': '0 0 40px 10px rgba(212, 168, 71, 0.35)',
        // Soft white glow
        'glow-white': '0 0 20px 4px rgba(255, 255, 255, 0.15)',
        // Chat bubble glows (distinct for avatar vs user)
        'bubble-avatar': '0 0 18px 3px rgba(167, 139, 250, 0.28), 0 2px 10px rgba(0, 0, 0, 0.45)',
        'bubble-user': '0 0 18px 3px rgba(212, 168, 71, 0.22), 0 2px 10px rgba(0, 0, 0, 0.45)',
        // Panel-level effects
        'panel-divider': '0 -1px 0 0 rgba(167, 139, 250, 0.12)',
        'inner-glow': 'inset 0 0 40px rgba(167, 139, 250, 0.06)',
      },

      // ── Animations & keyframes ────────────────────────────────────────────
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in both',
        'fade-up': 'fadeUp 0.4s ease-out both',
        breathe: 'breathe 4s ease-in-out infinite',
        blink: 'blink 4s ease-in-out infinite',
        'hair-sway': 'hairSway 6s ease-in-out infinite',
        'mouth-speak': 'mouthSpeak 0.22s ease-in-out infinite alternate',
        'ambient-pulse': 'ambientPulse 3s ease-in-out infinite',
        'speaking-ring': 'speakingRing 2s ease-in-out infinite',
      },

      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(167, 139, 250, 0.50)' },
          '50%': { boxShadow: '0 0 50px 16px rgba(167, 139, 250, 0.85)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-4px) scaleY(1.012)' },
        },
        blink: {
          '0%, 88%, 94%, 100%': { transform: 'scaleY(1)' },
          '91%': { transform: 'scaleY(0.08)' },
        },
        hairSway: {
          '0%, 100%': { transform: 'rotate(-1deg) translateX(0)' },
          '50%': { transform: 'rotate(1deg) translateX(2px)' },
        },
        mouthSpeak: {
          '0%': { transform: 'scaleY(0.4)' },
          '100%': { transform: 'scaleY(1)' },
        },
        ambientPulse: {
          '0%, 100%': { opacity: '0.5', r: '180' },
          '50%': { opacity: '0.8', r: '200' },
        },
        speakingRing: {
          '0%, 100%': { boxShadow: '0 0 40px 10px rgba(167, 139, 250, 0.40)' },
          '50%': { boxShadow: '0 0 70px 24px rgba(167, 139, 250, 0.75)' },
        },
      },
    },
  },
  plugins: [],
}
