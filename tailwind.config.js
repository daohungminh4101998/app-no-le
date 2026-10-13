/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A', // Primary
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052e16',
        },
        shopee: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F97316',
          600: '#EA580C',
          primary: '#EE4D2D', // Authentic Shopee orange-red for recognizable affiliate context
        },
        accent: {
          yellow: '#FACC15',
          gold: '#EAB308',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#F1F5F9',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
          border: '#E2E8F0',
        }
      },
      borderRadius: {
        'brand': '14px',
        'brand-lg': '18px',
        'brand-xl': '24px',
      },
      boxShadow: {
        '2xs': '0 1px 2px rgba(15, 23, 42, 0.06)',
        'soft': '0 2px 10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
        'float': '0 8px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
        'cta': '0 10px 25px -5px rgba(22, 163, 74, 0.35)',
        'orange-cta': '0 10px 25px -5px rgba(238, 77, 45, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
