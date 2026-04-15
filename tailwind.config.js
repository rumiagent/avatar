/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design-system colours for glow / accent effects
        glow: {
          primary: '#a78bfa',
          secondary: '#818cf8',
          accent: '#c4b5fd',
        },
      },
      boxShadow: {
        glow: '0 0 20px 4px rgba(167, 139, 250, 0.5)',
        'glow-lg': '0 0 40px 10px rgba(167, 139, 250, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        breathe: 'breathe 4s ease-in-out infinite',
        blink: 'blink 4s ease-in-out infinite',
        'hair-sway': 'hairSway 6s ease-in-out infinite',
        'mouth-speak': 'mouthSpeak 0.22s ease-in-out infinite alternate',
        'ambient-pulse': 'ambientPulse 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(167, 139, 250, 0.5)' },
          '50%': { boxShadow: '0 0 40px 12px rgba(167, 139, 250, 0.8)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
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
      },
    },
  },
  plugins: [],
}
