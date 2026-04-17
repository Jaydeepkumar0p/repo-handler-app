/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#080810',
        surface: '#0f0f1a',
        'surface-2': '#16162a',
        border: '#1e1e35',
        'border-bright': '#2a2a45',
        indigo: { 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5' },
        violet: { 400: '#a78bfa', 500: '#8b5cf6' },
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'typing': 'typing 1s steps(3) infinite',
      },
      keyframes: {
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(99,102,241,0.2)' },
          '50%': { boxShadow: '0 0 50px rgba(99,102,241,0.5)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        typing: {
          '0%': { content: '.' },
          '33%': { content: '..' },
          '66%': { content: '...' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
