import { createBundle } from 'dts-buddy';

createBundle({
	modules: {
		'@rich_harris/slide-park': 'src/index.d.ts',
		'@rich_harris/slide-park/vite': 'src/vite/index.js'
	},
	output: 'types/index.d.ts'
});
