<script lang="ts">
	import { page } from '$app/stores';
	import { goto, beforeNavigate, afterNavigate } from '$app/navigation';
	import type { Slide } from '../index.d.ts';
	import Presenter from './Presenter.svelte';

	interface Props {
		slide: Slide;
	}

	let { slide }: Props = $props();

	let mode: 'presenter' | 'viewer' = $state('presenter');

	let primary = $state(true);

	const active = 'slide-park:active';
	const current = 'slide-park:current';

	beforeNavigate(({ willUnload }) => {
		if (willUnload) {
			const count = +(localStorage.getItem(active) ?? '0');
			if (count <= 1) {
				localStorage.removeItem(active);
				localStorage.removeItem(current);
			} else {
				localStorage.setItem(active, String(count - 1));
			}
		}
	});

	afterNavigate((navigation) => {
		if (navigation.type === 'enter') {
			const pathname = localStorage.getItem(current);
			if (pathname) goto(pathname);

			const count = +(localStorage.getItem(active) ?? '0');
			localStorage.setItem(active, String(count + 1));
		} else if ((primary || navigation.type === 'popstate') && navigation.to) {
			localStorage.setItem(current, navigation.to.url.pathname);
		}
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (document.activeElement !== document.body) return;
		if (e.key.startsWith('Arrow') || e.key === 'Space' || e.key === 'P') {
			e.preventDefault();

			primary = true;

			if (e.key === 'ArrowRight' || e.key === 'Space') {
				slide.next_step && goto(slide.next_step);
			} else if (e.key === 'ArrowLeft') {
				slide.prev_step && goto(slide.prev_step);
			} else if (e.key === 'ArrowDown') {
				slide.next_slide && goto(slide.next_slide);
			} else if (e.key === 'ArrowUp') {
				slide.prev_slide && goto(slide.prev_slide);
			} else if (e.key === 'P') {
				mode = mode === 'presenter' ? 'viewer' : 'presenter';
			}
		}
	}}
	onstorage={(e) => {
		if (e.key !== current) return;

		if (e.newValue !== $page.url.pathname) {
			primary = false;
			goto(e.newValue);
		}
	}}
/>

<div class="slide-park" class:presenter-mode={mode === 'presenter'}>
	<Presenter {slide} />
	<div class="main">
		<div class="slide">
			<slide.current step={slide.step} slide={{ title: slide.title }} />
		</div>
	</div>
</div>

<style>
	.slide-park {
		position: fixed;
		right: 0;
		top: 0;
		width: 400%;
		height: 100%;
		display: grid;
		grid-template-columns: 3fr 1fr;
		align-items: center;
		justify-content: center;
		transform-origin: 100% 50%;
		transition: transform 0.2s;
	}

	.slide-park.presenter-mode {
		transform: scale(0.25);
	}

	.slide {
		aspect-ratio: 16 / 9;
		background-size: cover;
	}

	.main {
		display: grid;
		place-items: center;
		width: 100vw;
	}

	.main,
	.slide {
		overflow: hidden;
	}

	.slide {
		width: 100em;
		height: 56.25em;
	}

	@media (min-aspect-ratio: 16 / 9) {
		:global(html) {
			font-size: calc(16 / 9 * 1vh);
		}
	}

	@media (max-aspect-ratio: 16 / 9) {
		:global(html) {
			font-size: 1vw;
		}
	}
</style>
