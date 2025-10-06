import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // OKLCH Color System - Perceptually uniform colors
      colors: {
        primary: {
          50: 'oklch(97% 0.02 230)',
          100: 'oklch(94% 0.04 230)',
          200: 'oklch(88% 0.08 230)',
          300: 'oklch(80% 0.11 230)',
          400: 'oklch(72% 0.13 230)',
          500: 'oklch(65% 0.15 230)',
          600: 'oklch(58% 0.15 230)',
          700: 'oklch(50% 0.14 230)',
          800: 'oklch(42% 0.12 230)',
          900: 'oklch(34% 0.10 230)',
          950: 'oklch(26% 0.08 230)',
        },
        secondary: {
          50: 'oklch(97% 0.02 160)',
          100: 'oklch(94% 0.04 160)',
          200: 'oklch(88% 0.07 160)',
          300: 'oklch(81% 0.10 160)',
          400: 'oklch(75% 0.11 160)',
          500: 'oklch(70% 0.12 160)',
          600: 'oklch(62% 0.12 160)',
          700: 'oklch(54% 0.11 160)',
          800: 'oklch(46% 0.10 160)',
          900: 'oklch(38% 0.08 160)',
          950: 'oklch(30% 0.06 160)',
        },
        accent: {
          50: 'oklch(97% 0.02 50)',
          100: 'oklch(94% 0.04 50)',
          200: 'oklch(89% 0.08 50)',
          300: 'oklch(83% 0.11 50)',
          400: 'oklch(77% 0.13 50)',
          500: 'oklch(72% 0.14 50)',
          600: 'oklch(65% 0.14 50)',
          700: 'oklch(57% 0.13 50)',
          800: 'oklch(49% 0.11 50)',
          900: 'oklch(41% 0.09 50)',
          950: 'oklch(33% 0.07 50)',
        },
        neutral: {
          50: 'oklch(98% 0.00 0)',
          100: 'oklch(96% 0.00 0)',
          200: 'oklch(92% 0.00 0)',
          300: 'oklch(84% 0.01 0)',
          400: 'oklch(68% 0.01 0)',
          500: 'oklch(56% 0.01 0)',
          600: 'oklch(48% 0.01 0)',
          700: 'oklch(40% 0.01 0)',
          800: 'oklch(32% 0.01 0)',
          900: 'oklch(24% 0.01 0)',
          950: 'oklch(16% 0.01 0)',
        },
        background: {
          DEFAULT: 'oklch(99% 0.00 0)',
          light: 'oklch(98% 0.00 0)',
          lighter: 'oklch(97% 0.00 0)',
        },
        foreground: {
          DEFAULT: 'oklch(24% 0.01 0)',
          light: 'oklch(40% 0.01 0)',
          lighter: 'oklch(56% 0.01 0)',
        },
      },
      // Border radius system
      borderRadius: {
        'soft': '12px',
        'gentle': '14px',
        'comfort': '16px',
      },
      // Box shadow system with depth
      boxShadow: {
        'card': '0 2px 8px -2px oklch(0% 0 0 / 0.1), 0 4px 16px -4px oklch(0% 0 0 / 0.05)',
        'card-hover': '0 4px 16px -2px oklch(0% 0 0 / 0.15), 0 8px 24px -4px oklch(0% 0 0 / 0.08)',
        'elevated': '0 8px 24px -4px oklch(0% 0 0 / 0.12), 0 16px 48px -8px oklch(0% 0 0 / 0.08)',
      },
      // Typography scale
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      // Spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Animation and transitions
      transitionDuration: {
        '2000': '2000ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // Responsive breakpoints (industry standard)
      screens: {
        'xs': '475px',
        // sm: '640px' (default)
        // md: '768px' (default)
        // lg: '1024px' (default)
        // xl: '1280px' (default)
        '2xl': '1536px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};

export default config;
