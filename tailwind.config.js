/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mda: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        surface: {
          bg: '#FBFBFA',
          bone: '#F7F6F3',
          card: '#FFFFFF',
          subtle: '#F7F6F3',
          border: '#EAEAEA',
          borderHover: '#D4D4D4',
          muted: '#787774',
          dark: '#111111',
          charcoal: '#2F3437',
        },
        pastel: {
          green: '#EDF7EE',
          greenText: '#166534',
          yellow: '#FFFBEB',
          yellowText: '#B45309',
          red: '#FFF1F2',
          redText: '#BE123C',
          blue: '#EFF6FF',
          blueText: '#1D4ED8',
          teal: '#F0FDFA',
          tealText: '#0F766E',
          purple: '#F5F3FF',
          purpleText: '#6D28D9',
          gray: '#F1F1EF',
          grayText: '#5A5A58',
        },
        health: {
          good: '#059669',
          goodBg: '#ECFDF5',
          warning: '#D97706',
          warningBg: '#FFFBEB',
          danger: '#E11D48',
          dangerBg: '#FFF1F2',
          neutral: '#64748B',
          neutralBg: '#F1F5F9',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Newsreader', 'Playfair Display', 'Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': 'none',
        'card-hover': '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'elevated': '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
