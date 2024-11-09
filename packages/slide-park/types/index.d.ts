declare module '@rich_harris/slide-park' {
	import type { Component } from 'svelte';
	export interface Slide {
		component: Component;
		index: number;
		total: number;
		remaining_seconds: number;
		prev_step: string;
		next_step: string;
		prev_slide: string;
		next_slide: string;
		steps: number;
		text: string;
		title: string;
		styles: Array<{ key: string; value: string }>;
		current: Component;
		step: number;
	}

	const SlidePark: Component<{ slide: Slide }>;

	export default SlidePark;

	export {};
}

declare module '@rich_harris/slide-park/vite' {
	export function slides(): import("vite").PluginOption;

	export {};
}declare module '*?slide-park' {
	function getSlide(
		slug: string
	): Promise<import('@rich_harris/slide-park').Slide>;

	export { getSlide };
}

//# sourceMappingURL=index.d.ts.map