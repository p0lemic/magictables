import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        magic: {
          purple: '#9b5de5',
          pink: '#f72585',
          yellow: '#fee440',
          teal: '#00f5d4',
          lavender: '#f0e6ff',
          rose: '#ffe6f0',
        },
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.4s ease-out',
        'shake': 'shake 0.4s ease-in-out',
        'star-fill': 'starFill 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'confetti-fall': 'confettiFall 2s ease-in forwards',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        starFill: {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
