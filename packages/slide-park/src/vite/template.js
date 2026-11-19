/** @import { SlideData } from '../index.js' */
/** @import { SlideLoader } from './types.js' */

import { error } from '@sveltejs/kit';

// @ts-ignore
export let slides = /** @type {SlideLoader[]} */ (SLIDES);

export function getIndex() {
	/** @type {string[]} */
	const index = [];

	for (let slide_num = 0; slide_num < slides.length; slide_num += 1) {
		const slide = slides[slide_num];
		for (let step_num = 0; step_num < slide.num_steps; step_num += 1) {
			index.push(`${slide_num + 1}-${step_num + 1}`);
		}
	}

	return index;
}

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

	const words = slides.map((slide) => slide.num_words);

	/** @type {SlideData} */
	const data = {
		total: slides.length,
		words: {
			total: words.reduce(sum, 0),
			read: words.slice(0, slide_index).reduce(sum, 0),
			unread: words.slice(slide_index).reduce(sum, 0)
		},
		prev: {
			slide: prev_slide,
			step: prev_step
		},
		next: {
			slide: next_slide,
			step: next_step,
			load: loader.load_next
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

/**
 * @param {number} a
 * @param {number} b
 */
function sum(a, b) {
	return a + b;
}

if (import.meta.hot) {
	// importers (i.e. `+page.js`) keep a reference to the *first* instance's
	// `getIndex` and `getSlide`, since this module accepts its own updates.
	// So we swap the new loaders into that instance (which `hot.data` lets
	// us reach from later instances), then re-run `load` so the page picks
	// up the new content
	/** @type {(slides: SlideLoader[]) => void} */
	const update = (import.meta.hot.data.update ??= (/** @type {SlideLoader[]} */ s) => {
		slides = s;
	});

	import.meta.hot.accept(async (module) => {
		if (module?.slides) {
			update(module.slides);

			if (!import.meta.env.SSR) {
				const { invalidateAll } = await import('$app/navigation');
				await invalidateAll();
			}
		}
	});
}
