/** @import { SlideData } from '../index.js' */
/** @import { SlideLoader } from './types.js' */

import { error } from '@sveltejs/kit';

const WORDS_PER_MINUTE = 180;
const WORDS_PER_SECOND = WORDS_PER_MINUTE / 60;

// @ts-ignore
const slides = /** @type {SlideLoader[]} */ (SLIDES);

/**
 *
 * @param {string} slug
 * @returns {Promise<SlideData>}
 */
export async function getSlide(slug) {
	const match = /^(\d+)-(\d+)$/.exec(slug);
	if (!match) error(404);

	const index = +match[1] - 1;
	const step = +match[2];

	const loader = slides[index];
	if (!loader) error(404);

	const prev = slides[index - 1] ?? null;
	const next = slides[index + 1] ?? null;

	const prev_slide = prev && `${index}-${prev.steps - 1}`;
	const next_slide = next && `${index + 2}-0`;

	const prev_step = step > 0 ? `${match[1]}-${step - 1}` : prev_slide;
	const next_step =
		step < loader.steps - 1 ? `${match[1]}-${step + 1}` : next_slide;

	const module = await loader.load();

	const remaining_words = slides
		.slice(index)
		.map((slide) => slide.words)
		.reduce((a, b) => a + b, 0);

	const remaining = Math.round(remaining_words / WORDS_PER_SECOND);

	/** @type {SlideData} */
	const data = {
		total: slides.length,
		remaining,
		prev: {
			slide: prev_slide,
			step: prev_step
		},
		next: {
			slide: next_slide,
			step: next_step
		},
		current: {
			index,
			text: module.metadata.text,
			title: module.metadata.title,
			steps: loader.steps,
			component: module.default
		},
		step: +match[2]
	};

	return data;
}
