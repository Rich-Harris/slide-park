<script lang="ts">
	import { page } from '$app/stores';
	import { goto, afterNavigate } from '$app/navigation';
	import type { SlideData } from '../index.d.ts';
	import Presenter from './Presenter.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		data: SlideData;
		children?: Snippet;
	}

	let { data, children }: Props = $props();

	let mode: 'presenter' | 'viewer' = $state('presenter');
	let primary = $state(true);

	const current = 'slide-park:current';

	afterNavigate((navigation) => {
		if (primary && navigation.to) {
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
				data.next.step && goto(data.next.step);
			} else if (e.key === 'ArrowLeft') {
				data.prev.step && goto(data.prev.step);
			} else if (e.key === 'ArrowDown') {
				data.next.slide && goto(data.next.slide);
			} else if (e.key === 'ArrowUp') {
				data.prev.slide && goto(data.prev.slide);
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
	<Presenter {data} />
	<div class="main">
		<div class="slide">
			{#if children}
				{@render children()}
			{:else}
				<data.current.component step={data.step} />
			{/if}
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

		&.presenter-mode {
			transform: scale(0.25);
		}
	}

	.main,
	.slide {
		overflow: hidden;
	}

	.main {
		display: grid;
		place-items: center;
		width: 100vw;

		.slide {
			aspect-ratio: 16 / 9;
			background-size: cover;
			width: 100em;
			height: 56.25em;
		}
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
