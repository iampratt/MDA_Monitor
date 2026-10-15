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
          50: '#F0F9F5',
          100: '#DDF0E7',
          200: '#BCE2D1',
          300: '#8DCBB0',
          400: '#58AE8B',
          500: '#32926E',
          600: '#237B5C',
          700: '#146C50', // Core Primary
          800: '#135742',
          900: '#114838',
          950: '#08281F',
        },
        surface: {
          bg: '#F6F8F6',
          card: '#FFFFFF',
          sidebar: '#FBFDFB',
          subtle: '#EEF3EF',
          border: '#E2E8E4',
          muted: '#68776F',
          dark: '#1B2A23',
        },
        health: {
          good: '#16A34A',
          goodBg: '#DCFCE7',
          warning: '#D97706',
          warningBg: '#FEF3C7',
          danger: '#DC2626',
          dangerBg: '#FEE2E2',
          info: '#2563EB',
          infoBg: '#DBEAFE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(20, 108, 80, 0.04), 0 1px 2px -1px rgba(20, 108, 80, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(20, 108, 80, 0.08), 0 2px 4px -1px rgba(20, 108, 80, 0.04)',
        'elevated': '0 10px 25px -5px rgba(20, 108, 80, 0.08), 0 8px 10px -6px rgba(20, 108, 80, 0.04)',
      }
    },
  },
  plugins: [],
}
