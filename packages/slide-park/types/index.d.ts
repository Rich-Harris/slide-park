declare module '@rich_harris/slide-park' {
	import type { Component } from 'svelte';
	export interface Slide {
		index: number;
		steps: number;
		text: string;
		title: string;
		component: Component;
	}

	export interface SlideData {
		/** The number of slides */
		total: number;
		/** The estimated remaining time, in seconds */
		remaining: number;
		prev: {
			slide: string | null;
			step: string | null;
		};
		next: {
			slide: string | null;
			step: string | null;
		};
		current: Slide;
		step: number;
	}

	const SlidePark: Component<{ data: SlideData }>;

	export default SlidePark;

	export {};
}

declare module '@rich_harris/slide-park/vite' {
	export function slides(): import("vite").PluginOption;

	export {};
}declare module '*?slide-park' {
	function getSlide(
		slug: string
	): Promise<import('@rich_harris/slide-park').SlideData>;

	export { getSlide };
}

//# sourceMappingURL=index.d.ts.map