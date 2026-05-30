import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Established brand palette — NVIDIA-inspired greens + deep slate
        brand: {
          DEFAULT: '#76b900',
          50: '#f3fbe5',
          100: '#e3f5c2',
          200: '#c9ec8a',
          300: '#a9df47',
          400: '#8fcf1f',
          500: '#76b900',
          600: '#5e9400',
          700: '#477000',
          800: '#324f02',
          900: '#1f3001',
        },
        ink: {
          950: '#070a07',
          900: '#0b0f0c',
          850: '#0e1310',
          800: '#111612',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};

export default config;
