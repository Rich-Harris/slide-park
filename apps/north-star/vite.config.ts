import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { slides } from '@rich_harris/slide-park/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	plugins: [slides(), enhancedImages(), sveltekit()],
	server: {
		fs: {
			allow: ['.']
		}
	}
});
