/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        /* Thin scrollbar for Chrome, Safari, Edge */
        '.thin-scrollbar::-webkit-scrollbar': {
          width: '6px',
        },
        '.thin-scrollbar::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '.thin-scrollbar::-webkit-scrollbar-thumb': {
          backgroundColor: '#4A5568', // Customize the color
          borderRadius: '3px',
        },
        /* Thin scrollbar for Firefox */
        '.thin-scrollbar': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#4A5568 transparent', // Customize the color
        },
      });
    }
  ],
}

