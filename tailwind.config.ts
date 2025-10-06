import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Only adding minimal custom values needed for build
      borderRadius: {
        'soft': '12px',
        'gentle': '14px',
        'comfort': '16px',
      },
      boxShadow: {
        'elevated-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'elevated-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
      // Responsive breakpoints
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};

export default config;
