module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        'base': '0.9rem'
      }
    },
  },
  variants: {
    extend: {
    	opacity: ['disabled'],
      backgroundColor: ['hover'],
      textColor: ['hover'],
      fontWeight: ['hover']
    },
  },
  plugins: [],
}
