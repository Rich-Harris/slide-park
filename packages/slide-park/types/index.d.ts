declare module '@rich_harris/slide-park' {
	import type { Component, Snippet } from 'svelte';
	export interface SlideStep {
		words: string;
		state: Record<string, any>;
	}

	export interface Slide {
		index: number;
		component: Component;
		title: string;
		steps: SlideStep[];
		step: SlideStep;
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
	}

	const SlidePark: Component<{
		data: SlideData;
		defaultMode?: 'viewer' | 'presenter';
		children?: Snippet;
	}>;

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