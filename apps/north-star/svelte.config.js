import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},

	vitePlugin: {
		dynamicCompileOptions: ({ filename, compileOptions }) => {
			if (compileOptions.dev && filename.includes('.md.')) {
				// this is necessary because otherwise CSS updates don't work — something
				// to do with the virtual modules
				return { css: 'injected' };
			}
		}
	}
};

export default config;
