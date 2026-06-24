/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Monaco', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        blueprint: {
          bg: '#0A0F16',
          panel: '#0E1A22',
          grid: '#00D1FF',
          critical: '#FFD700',
          accent: '#0088CC',
        },
        paper: {
          bg: '#F0F4F8',
          panel: '#E0E6ED',
          grid: '#0088CC',
          critical: '#C5A467',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #00D1FF 1px, transparent 1px), linear-gradient(to bottom, #00D1FF 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '20px 20px',
      }
    },
  },
  plugins: [],
}
