const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    tailwindcss('./tailwind.config.js'),

    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
