import { getSlide } from '../../../slides/content.md?slide-park';

export function load({ params }) {
	return getSlide(params.slide);
}
