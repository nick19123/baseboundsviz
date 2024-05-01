import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');
/** @type {import('@sveltejs/kit').Config} */
export const prerender = true;

const config = {
	preprocess: [
		preprocess({
		  postcss: true,
		}),
		vitePreprocess({})
	  ],
	kit: {
		adapter: adapter(),
		paths: {
			base: dev ? '' : process.env.BASE_PATH
		}
	},
	prerender: {
		default: true
	},
	trailingSlash: 'always',
	paths: {
		base: '/baseboundsviz'
	}
};

export default config;
