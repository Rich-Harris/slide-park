import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { slides } from 'slide-park';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	plugins: [
		slides({
			input: 'slides',
			output: 'src/routes'
		}),
		enhancedImages(),
		sveltekit()
	]
});
