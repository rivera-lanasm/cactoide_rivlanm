import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Using Netlify adapter for deployment
		adapter: adapter({
			// if you want to use 'split' mode, set this to 'split'
			// and create a _redirects file with the redirects you want
			// see "split" mode in https://github.com/sveltejs/kit/tree/main/packages/adapter-netlify
			edge: false,
			split: false
		})
	}
};

export default config;
