import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // OKLCH Color System - Multiple shades for depth
                background: {
                    DEFAULT: "oklch(96% 0.01 90)", // Darker page background
                    light: "oklch(98.5% 0.005 90)", // Lightest - for cards
                    lighter: "oklch(99.5% 0.003 90)", // Ultra light - for highlights
                },

                foreground: {
                    DEFAULT: "oklch(20% 0.01 90)", // Deep charcoal
                    light: "oklch(35% 0.01 90)", // Lighter text
                    lighter: "oklch(50% 0.015 90)", // Subtle text
                },

                primary: {
                    950: "oklch(45% 0.20 230)", // Darkest
                    900: "oklch(50% 0.19 230)",
                    800: "oklch(55% 0.18 230)",
                    DEFAULT: "oklch(65% 0.15 230)", // Base - calm teal-blue
                    600: "oklch(70% 0.13 230)",
                    500: "oklch(75% 0.12 230)",
                    400: "oklch(80% 0.10 230)",
                    300: "oklch(85% 0.08 230)",
                    200: "oklch(90% 0.06 230)",
                    100: "oklch(95% 0.04 230)",
                    50: "oklch(97% 0.02 230)", // Lightest
                },

                secondary: {
                    950: "oklch(50% 0.17 160)",
                    900: "oklch(55% 0.16 160)",
                    800: "oklch(60% 0.15 160)",
                    DEFAULT: "oklch(70% 0.12 160)", // Base - sage green
                    600: "oklch(75% 0.11 160)",
                    500: "oklch(80% 0.09 160)",
                    400: "oklch(85% 0.07 160)",
                    300: "oklch(88% 0.05 160)",
                    200: "oklch(92% 0.04 160)",
                    100: "oklch(95% 0.03 160)",
                    50: "oklch(97% 0.02 160)",
                },

                accent: {
                    950: "oklch(52% 0.19 50)",
                    900: "oklch(57% 0.18 50)",
                    800: "oklch(62% 0.17 50)",
                    DEFAULT: "oklch(72% 0.14 50)", // Base - warm amber
                    600: "oklch(77% 0.13 50)",
                    500: "oklch(82% 0.11 50)",
                    400: "oklch(87% 0.09 50)",
                    300: "oklch(90% 0.07 50)",
                    200: "oklch(93% 0.05 50)",
                    100: "oklch(96% 0.03 50)",
                    50: "oklch(98% 0.02 50)",
                },

                neutral: {
                    950: "oklch(15% 0.005 90)",
                    900: "oklch(18% 0.008 90)",
                    800: "oklch(24% 0.01 90)",
                    700: "oklch(32% 0.015 90)",
                    600: "oklch(42% 0.02 90)",
                    500: "oklch(52% 0.02 90)",
                    400: "oklch(65% 0.02 90)",
                    300: "oklch(78% 0.015 90)",
                    200: "oklch(88% 0.01 90)",
                    100: "oklch(94% 0.008 90)",
                    50: "oklch(97% 0.005 90)",
                },
            },

            spacing: {
                // Consistent spacing system (divisible by 4)
                '18': '4.5rem',   // 72px
                '22': '5.5rem',   // 88px
                '26': '6.5rem',   // 104px
                '30': '7.5rem',   // 120px
            },

            boxShadow: {
                // Realistic depth system - light from above
                'glow-top': 'inset 0 1px 0 0 oklch(100% 0 0 / 0.15)',
                'glow-top-lg': 'inset 0 2px 0 0 oklch(100% 0 0 / 0.2)',
                'depth-bottom': 'inset 0 -1px 0 0 oklch(0% 0 0 / 0.1)',
                'depth-bottom-lg': 'inset 0 -2px 0 0 oklch(0% 0 0 / 0.15)',

                // Elevated surfaces (light top + dark bottom for realism)
                'elevated-sm': '0 1px 2px 0 oklch(0% 0 0 / 0.05), 0 1px 3px 0 oklch(0% 0 0 / 0.03)',
                'elevated': '0 2px 4px -1px oklch(0% 0 0 / 0.08), 0 4px 6px -1px oklch(0% 0 0 / 0.05)',
                'elevated-md': '0 4px 6px -2px oklch(0% 0 0 / 0.10), 0 8px 12px -2px oklch(0% 0 0 / 0.06)',
                'elevated-lg': '0 8px 12px -4px oklch(0% 0 0 / 0.12), 0 16px 24px -4px oklch(0% 0 0 / 0.08)',
                'elevated-xl': '0 12px 24px -6px oklch(0% 0 0 / 0.15), 0 24px 48px -8px oklch(0% 0 0 / 0.10)',

                // Card-specific shadows with depth
                'card': '0 1px 3px 0 oklch(0% 0 0 / 0.08), 0 4px 8px -2px oklch(0% 0 0 / 0.05)',
                'card-hover': '0 4px 8px -2px oklch(0% 0 0 / 0.12), 0 12px 20px -4px oklch(0% 0 0 / 0.08)',

                // Inset shadows for sunken elements
                'inset-light': 'inset 0 2px 4px 0 oklch(0% 0 0 / 0.04)',
                'inset': 'inset 0 2px 4px 0 oklch(0% 0 0 / 0.06)',
                'inset-strong': 'inset 0 3px 6px 0 oklch(0% 0 0 / 0.10)',

                // Combined depth (glow + shadow)
                'depth': 'inset 0 1px 0 0 oklch(100% 0 0 / 0.15), inset 0 -1px 0 0 oklch(0% 0 0 / 0.08), 0 2px 4px 0 oklch(0% 0 0 / 0.05)',
                'depth-lg': 'inset 0 2px 0 0 oklch(100% 0 0 / 0.2), inset 0 -2px 0 0 oklch(0% 0 0 / 0.12), 0 4px 8px 0 oklch(0% 0 0 / 0.08)',
            },

            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },

            fontSize: {
                // Type scale with better hierarchy
                'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
                'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
                'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
                'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
                'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
                '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
                '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
                '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
                '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
            },

            borderRadius: {
                'soft': '0.75rem',  // 12px
                'gentle': '1rem',    // 16px
                'comfort': '1.25rem', // 20px
            },

            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(1rem)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.96)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;

