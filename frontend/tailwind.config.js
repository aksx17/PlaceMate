module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#8aa6ff',
          500: '#667eea',
          600: '#4d5fc7',
          700: '#3644a4',
          800: '#242e82',
          900: '#151d5f',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#764ba2',
          600: '#5e3d82',
          700: '#462f61',
          800: '#2e2041',
          900: '#1a1225',
        }
      }
    },
  },
  plugins: [],
}
