import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // OKLCH Color System - Your original sage green design
      colors: {
        background: {
          DEFAULT: 'oklch(94% 0.02 160)', // Sage green background - darker
          light: 'oklch(96% 0.015 160)', // Lighter sage - darker
          lighter: 'oklch(98% 0.01 160)', // Very light sage - darker
        },
        foreground: {
          DEFAULT: 'oklch(24% 0.02 160)', // Dark sage-tinted text
          light: 'oklch(40% 0.015 160)',
          lighter: 'oklch(56% 0.01 160)',
        },
        primary: {
          DEFAULT: 'oklch(65% 0.15 230)', // Calm teal-blue
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
        },
        secondary: {
          DEFAULT: 'oklch(70% 0.12 160)', // Sage green
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
        },
        accent: {
          DEFAULT: 'oklch(72% 0.14 50)', // Warm amber
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
        },
      },
      // Border radius
      borderRadius: {
        'soft': '12px',
        'gentle': '14px',
        'comfort': '16px',
      },
      // Box shadows
      boxShadow: {
        'elevated-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'elevated-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'card': '0 2px 8px -2px oklch(0% 0 0 / 0.1), 0 4px 16px -4px oklch(0% 0 0 / 0.05)',
        'card-hover': '0 4px 16px -2px oklch(0% 0 0 / 0.15), 0 8px 24px -4px oklch(0% 0 0 / 0.08)',
      },
      // Responsive breakpoints - Industry standard includes laptop-specific sizes
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'laptop': '1024px',      // Explicit laptop breakpoint (13"-15" laptops)
        'desktop': '1280px',     // Desktop monitors
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};

export default config;
