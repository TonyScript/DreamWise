/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./dream/*.html",
    "./assets/js/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'dream-purple': '#6366f1',
        'dream-blue': '#1e40af',
        'dream-dark': '#0f172a',
        'dream-gray': '#1e293b',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}