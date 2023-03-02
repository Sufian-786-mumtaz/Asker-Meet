module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
    // defaultLineHeights: true,
    // standardFontWeights: true
  },
  theme: {
    extend: {
      colors: {
        main: "#FF5925",
        dark: "#292A2C",
        light: "#F9FBFE",
        muted: "#748297"
      }
    }
  },
  variants: {},
  plugins: []
}
