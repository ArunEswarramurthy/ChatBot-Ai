/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        gradient: {
          from: '#2E0249',
          via: '#570A57',
          to: '#A91079',
          accent: '#F806CC',
          cyan: '#00CFFF',
          green: '#3DFF8C'
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #2E0249 0%, #570A57 25%, #A91079 75%, #F806CC 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(46, 2, 73, 0.8) 0%, rgba(87, 10, 87, 0.8) 50%, rgba(169, 16, 121, 0.8) 100%)',
        'gradient-button': 'linear-gradient(135deg, #00CFFF 0%, #3DFF8C 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 207, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 207, 255, 0.8)' },
        },
      }
    },
  },
  plugins: [],
}