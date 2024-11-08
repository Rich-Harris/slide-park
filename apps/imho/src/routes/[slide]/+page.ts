import { getSlide } from './load';

export function load({ params }) {
	return getSlide(params.slide);
}
