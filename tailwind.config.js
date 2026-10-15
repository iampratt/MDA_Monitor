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
          400: '#4EA983',
          500: '#2C8D67',
          600: '#1F7654',
          700: '#146C50', // Core Brand Primary
          800: '#115741',
          900: '#0E4836',
          950: '#07271D',
        },
        surface: {
          bg: '#F8FAF9',
          card: '#FFFFFF',
          sidebar: '#FBFDFB',
          subtle: '#F1F5F2',
          border: '#E2E8E4',
          borderHover: '#CBD7CE',
          muted: '#64748B',
          dark: '#0F172A',
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
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(20, 108, 80, 0.08), 0 8px 10px -6px rgba(20, 108, 80, 0.04)',
        'elevated': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideDown: 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
