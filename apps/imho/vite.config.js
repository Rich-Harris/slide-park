import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { slides } from 'slide-park';

export default defineConfig({
	plugins: [
		slides({
			input: 'slides',
			output: 'src/routes'
		}),
		sveltekit()
	]
});
