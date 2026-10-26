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
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669', // Sophisticated Emerald Primary
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        shopee: {
          50: '#FFF5F2',
          100: '#FFE8E2',
          200: '#FFD3C7',
          500: '#FF5722',
          600: '#EE4D2D', // Authentic Shopee primary
          700: '#D73211',
          primary: '#EE4D2D',
          hover: '#D73211',
        },
        accent: {
          yellow: '#FBBF24',
          gold: '#F59E0B',
          amber: '#D97706',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          canvas: '#F1F5F9',
          card: '#FFFFFF',
          muted: '#F8FAFC',
          hover: '#F1F5F9',
        },
        ink: {
          primary: '#0B0F19',
          secondary: '#334155',
          muted: '#64748B',
          light: '#94A3B8',
          border: '#E2E8F0',
        }
      },
      borderRadius: {
        'brand': '14px',
        'brand-lg': '18px',
        'brand-xl': '22px',
        'brand-2xl': '28px',
      },
      boxShadow: {
        '2xs': '0 1px 2px rgba(15, 23, 42, 0.04)',
        'soft': '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.03)',
        'card': '0 1px 2px rgba(15, 23, 42, 0.04), 0 3px 8px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        'float': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
        'cta': '0 8px 20px -4px rgba(5, 150, 105, 0.35)',
        'orange-cta': '0 8px 20px -4px rgba(238, 77, 45, 0.35)',
        'glow-brand': '0 0 24px -4px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
