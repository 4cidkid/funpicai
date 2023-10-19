import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function ({ addVariant }: { addVariant: Function }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    },
    function ({ addUtilities  }: { addUtilities: Function }) {
      addUtilities({
        ".drag-none": {
          "-webkit-user-drag": "none",
          "-khtml-user-drag": "none",
          "-moz-user-drag": "none",
          "-o-user-drag": "none",
          "user-drag": "none"
        }
      })
    },
  ],
}
export default config
