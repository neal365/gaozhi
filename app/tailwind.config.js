/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rice-paper': '#F5F0E6',
        'antique-paper': '#E8DFC4',
        'white-paper': '#FFFFFF',
        'text-primary': '#2C2C2C',
        'line-color': '#D4C4A8',
        'line-light': '#E0D4BC',
        'accent': '#8B7355',
        'accent-light': '#A6927A',
      },
      fontFamily: {
        'kai': ['KaiTi', 'STKaiti', 'serif'],
        'xing': ['Ma Shan Zheng', 'KaiTi', 'serif'],
        'li': ['LiSu', 'STLiti', 'serif'],
        'song': ['SimSun', 'STSong', 'serif'],
      },
    },
  },
  plugins: [],
}
