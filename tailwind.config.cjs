const generateWidthClasses = () => {
  const classes = [];
  for (let i = 0; i <= 100; i++) {
    classes.push('w-['+i+'%]');
  }
  return classes;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  purge: {
    options: {
      safelist: [
        ...generateWidthClasses(),
        'bg-cargo-matter',
        'bg-cargo-flora',
        'bg-cargo-water',
        'bg-cargo-minerals',
        'bg-cargo-fungi',
        'bg-cargo-fauna',
        'bg-cargo-energy',
        'bg-cargo-technology',
        'bg-cargo-weaponry',
        'bg-cargo-wisdom',
      ]
    }
  },
  theme: {
    extend: {
      colors: {
        'cargo': {
          'matter': '#999999',
          'flora': '#52c754',
          'water': '#7ccdfc',
          'minerals': '#70b3a6',
          'fungi': '#9c70b3',
          'fauna': '#b39070',
          'energy': '#8fe3e3',
          'technology': '#9d4ced',
          'weaponry': '#ed4c4c',
          'wisdom': '#edd04c'
        }
      }
    },
  },
  plugins: [],
}
