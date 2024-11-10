import { Slide } from '@rich_harris/slide-park';
import { Component } from 'svelte';

export interface SlideStub {
	num_steps: number;
	num_words: number;
	component: string;
}

export interface SlideLoader {
	num_steps: number;
	num_words: number;
	load: () => Promise<{
		title: string;
		steps: Array<{
			words: string;
			state: Record<string, any>;
		}>;
		default: Component<{ slide: Slide }>;
	}>;
}
