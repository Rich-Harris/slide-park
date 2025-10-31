<script lang="ts">
	import { page } from '$app/stores';
	import { goto, afterNavigate } from '$app/navigation';
	import type { SlideData } from '../index.d.ts';
	import Presenter from './Presenter.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		data: SlideData;
		defaultMode?: 'presenter' | 'viewer';
		wpm?: number;
		children?: Snippet;
	}

	let {
		data,
		defaultMode = (typeof sessionStorage !== 'undefined' &&
			(sessionStorage.getItem('slide-park:mode') as 'presenter' | 'viewer')) ||
			'viewer',
		wpm = 180,
		children
	}: Props = $props();

	let mode = $state(defaultMode);
	let element: HTMLElement;

	const current = 'slide-park:current';

	function go(pathname: string) {
		if (!pathname) return;

		goto(pathname);
		localStorage.setItem(current, pathname);
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (document.activeElement !== document.body || !e.isTrusted) return;
		if (e.key.startsWith('Arrow') || e.key === 'Space' || e.key === 'P') {
			e.preventDefault();

			if (e.key === 'ArrowRight' || e.key === 'Space') {
				go(data.next.step);
			} else if (e.key === 'ArrowLeft') {
				go(data.prev.step);
			} else if (e.key === 'ArrowDown') {
				go(data.next.slide);
			} else if (e.key === 'ArrowUp') {
				go(data.prev.slide);
			} else if (e.key === 'P') {
				mode = mode === 'presenter' ? 'viewer' : 'presenter';
				sessionStorage.setItem('slide-park:mode', mode);
			}
		}

		if (e.code === 'KeyF' && e.metaKey) {
			e.preventDefault();
			element.requestFullscreen();
		}

		if (e.code === 'Escape') {
			document.exitFullscreen();
		}
	}}
	onstorage={(e) => {
		if (e.key !== current) return;

		if (e.newValue !== $page.url.pathname) {
			goto(e.newValue);
		}
	}}
/>

<div class="slide-park" class:presenter-mode={mode === 'presenter'}>
	<Presenter {data} {wpm} />
	<div class="main">
		<div bind:this={element} class="slide">
			{#if children}
				{@render children()}
			{:else}
				<data.current.component state={data.current.step.state} />
			{/if}
		</div>
	</div>
</div>

<style>
	.slide-park {
		--ratio: 2.5;
		--scale: calc(1 / (1 + var(--ratio)));
		position: fixed;
		right: 0;
		top: 0;
		width: calc(100% * (1 + var(--ratio)));
		height: 100%;
		display: grid;
		grid-template-columns: calc(var(--ratio) / (var(--ratio) + 1) * 100%) calc(
				100% / (1 + var(--ratio))
			);
		align-items: center;
		justify-content: center;
		transform-origin: 100% 50%;
		transition: transform 0.2s;
		background: var(--background, transparent);

		&.presenter-mode {
			transform: scale(var(--scale));
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
			position: relative;
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
