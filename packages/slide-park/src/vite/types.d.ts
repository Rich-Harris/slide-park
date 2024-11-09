import { Slide } from '@rich_harris/slide-park';
import { Component } from 'svelte';

export interface SlideData {
	steps: number;
	words: number;
	component: string;
}

export interface SlideLoader {
	steps: number;
	words: number;
	load: () => Promise<{
		metadata: {
			title: string;
			text: string;
		};
		default: Component<{ slide: Slide }>;
	}>;
}
