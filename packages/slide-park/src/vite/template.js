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

	const slide_num = +match[1];
	const step_num = +match[2];

	const slide_index = slide_num - 1;
	const step_index = step_num - 1;

	const loader = slides[slide_index];
	if (!loader) error(404);

	const module = await loader.load();

	const step = module.steps[step_index];
	if (!step) error(404);

	const prev = slides[slide_index - 1] ?? null;
	const next = slides[slide_index + 1] ?? null;

	const prev_slide = prev && `${slide_num - 1}-${prev.num_steps}`;
	const next_slide = next && `${slide_num + 1}-1`;

	const prev_step = step_num > 1 ? `${slide_num}-${step_num - 1}` : prev_slide;
	const next_step =
		step_num < loader.num_steps ? `${slide_num}-${step_num + 1}` : next_slide;

	const remaining_words = slides
		.slice(slide_num)
		.map((slide) => slide.num_words)
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
			index: slide_index,
			component: module.default,
			title: module.title,
			steps: module.steps,
			step: module.steps[step_index]
		}
	};

	return data;
}
