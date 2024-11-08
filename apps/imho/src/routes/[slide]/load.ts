// @ts-ignore
import { slides } from './.slides/index.js';
import Slide from './Slide.svelte';

const WORDS_PER_MINUTE = 180;
const WORDS_PER_SECOND = WORDS_PER_MINUTE / 60;

export async function getSlide(slug: string) {
	const match = /^(\d+)-(\d+)$/.exec(slug);
	if (!match) return { status: 404 };

	const index = +match[1] - 1;
	const step = +match[2];

	const slide = slides[index];
	if (!slide) return { status: 404 };

	const prev = slides[index - 1] ?? null;
	const next = slides[index + 1] ?? null;

	const prev_slide = prev && `${index}-${prev.steps - 1}`;
	const next_slide = next && `${index + 2}-0`;

	const prev_step = step > 0 ? `${match[1]}-${step - 1}` : prev_slide;
	const next_step =
		step < slide.steps - 1 ? `${match[1]}-${step + 1}` : next_slide;

	const module = await slide.load();

	const remaining_words = slides
		.slice(index)
		.map((slide) => slide.words)
		.reduce((a, b) => a + b, 0);

	const remaining_seconds = Math.round(remaining_words / WORDS_PER_SECOND);

	return {
		component: Slide,
		index,
		total: slides.length,
		remaining_seconds,
		prev_step,
		next_step,
		prev_slide,
		next_slide,
		steps: slide.steps,
		text: module.metadata.text,
		title: module.metadata.title,
		styles: module.metadata.styles,
		classnames: module.metadata.classnames,
		current: module.default,
		step: +match[2]
	};
}
