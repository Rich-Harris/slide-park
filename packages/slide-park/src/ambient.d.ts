declare module '*?slide-park' {
	function getSlide(
		slug: string
	): Promise<import('@rich_harris/slide-park').Slide>;

	export { getSlide };
}
