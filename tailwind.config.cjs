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
        ...generateWidthClasses()
      ]
    }
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
