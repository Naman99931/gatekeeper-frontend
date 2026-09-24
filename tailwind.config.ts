import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F7F8FA',
        surface: '#FFFFFF',
        sidebar: '#12151C',
        sidebarhover: '#1D212B',
        border: '#E2E5EA',
        text: {
          primary: '#1A1D23',
          secondary: '#5B6472',
          muted: '#8A93A3',
        },
        accent: {
          DEFAULT: '#2545C7',
          hover: '#1E3AA8',
          soft: '#EBEFFC',
        },
        success: { DEFAULT: '#16794F', soft: '#E7F5EE' },
        danger: { DEFAULT: '#C0362C', soft: '#FBEAE9' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
    },
  },
  plugins: [],
};
export default config;
