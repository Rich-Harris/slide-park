import type { Component } from 'svelte';
import './ambient.d.ts';

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
	classnames: string;
	current: Component;
	step: number;
}

declare const SlidePark: Component<{ slide: Slide }>;

export default SlidePark;
