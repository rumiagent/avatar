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
      },
    },
  },
  plugins: [],
}
