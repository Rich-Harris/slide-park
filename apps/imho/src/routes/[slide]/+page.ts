import { getSlide } from '../../../slides/content.md?slide-park';

export async function load({ params }) {
	return getSlide(params.slide);
}
