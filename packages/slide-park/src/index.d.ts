import type { Component } from 'svelte';
import './ambient.d.ts';

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

declare const SlidePark: Component<{ data: SlideData }>;

export default SlidePark;
