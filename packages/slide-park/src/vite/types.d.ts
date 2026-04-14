import { Slide } from '@rich_harris/slide-park';
import { Component, Snippet } from 'svelte';

export interface Step {
	state: Record<string, any>;
	words: string;
}

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
		__images: Snippet;
		default: Component<{ slide: Slide }>;
	}>;
	load_next: () => Promise<{
		title: string;
		steps: Array<{
			words: string;
			state: Record<string, any>;
		}>;
		__images: Snippet;
		default: Component<{ slide: Slide }>;
	}>;
}
