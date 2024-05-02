const tailwindcss = require('tailwindcss');
import tailwindConfig from './tailwind.config.js'
const autoprefixer = require('autoprefixer');

const config = {
	plugins: [
    tailwindcss(tailwindConfig), autoprefixer
    ]
};

module.exports = config;
