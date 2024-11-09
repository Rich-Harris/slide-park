import { getSlide } from '../../../slides/content.md?slide-park';

export async function load({ params }) {
	return {
		slide: await getSlide(params.slide)
	};
}
