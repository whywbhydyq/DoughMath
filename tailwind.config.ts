import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dough: {
          50: '#fff8ec',
          100: '#ffedc6',
          200: '#f5d392',
          500: '#c9791f',
          700: '#8a4c13',
          800: '#63340f',
          900: '#3d240d'
        },
        workspace: '#fff4dc',
        input: '#fffaf0',
        result: '#fff7e6',
        success: '#ecfdf3',
        warning: '#fffbeb',
        danger: '#fef2f2',
        info: '#eff6ff'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(61, 36, 13, 0.08)',
        hover: '0 18px 42px rgba(61, 36, 13, 0.14)'
      }
    }
  },
  plugins: []
};

export default config;
