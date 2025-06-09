import type { Component, Snippet } from 'svelte';
import './ambient.d.ts';
import { SlideLoader } from './vite/types.js';

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
		load: SlideLoader['load_next'];
	};
	current: Slide;
}

declare const SlidePark: Component<{
	data: SlideData;
	defaultMode?: 'viewer' | 'presenter';
	children?: Snippet;
}>;

export default SlidePark;
