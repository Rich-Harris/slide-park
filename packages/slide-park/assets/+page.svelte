<script>
	// @ts-ignore
	import { page } from '$app/stores';
	// @ts-ignore
	import { goto, beforeNavigate, afterNavigate } from '$app/navigation';

	/** @type {Awaited<ReturnType<typeof import('./+page.js').load>>} */
	export let data;

	/** @type {'presenter' | 'viewer'}*/
	let mode = 'viewer';

	let primary = true;

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

	function pad(n) {
		return n < 10 ? '0' + n : n;
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (document.activeElement !== document.body) return;
		if (e.key.startsWith('Arrow') || e.key === 'Space' || e.key === 'P') {
			e.preventDefault();

			primary = true;

			if (e.key === 'ArrowRight' || e.key === 'Space') {
				data.next_step && goto(data.next_step);
			} else if (e.key === 'ArrowLeft') {
				data.prev_step && goto(data.prev_step);
			} else if (e.key === 'ArrowDown') {
				data.next_slide && goto(data.next_slide);
			} else if (e.key === 'ArrowUp') {
				data.prev_slide && goto(data.prev_slide);
			} else if (e.key === 'P') {
				mode = mode === 'presenter' ? 'viewer' : 'presenter';
			}
		}
	}}
	on:storage={(e) => {
		if (e.key !== current) return;

		if (e.newValue !== $page.url.pathname) {
			primary = false;
			goto(e.newValue);
		}
	}}
/>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<div class="slide-park {mode}">
	<div class="text">
		<div class="content">{@html data.text}</div>
		<p class="progress">
			<span style="width: 4em;">{data.index + 1}/{data.total}</span>
			<progress value={(data.index + 1) / data.total} max="1" />
			<span style="width: 9em; text-align: right;">
				{Math.floor(data.remaining_seconds / 60)}m{pad(
					data.remaining_seconds % 60
				)}s remaining
			</span>
		</p>
	</div>
	<div class="main">
		<div class="slide {data.classnames}" style={data.styles}>
			<svelte:component
				this={data.component}
				step={data.step}
				slide={{ title: data.title }}
			/>
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

	.slide-park.presenter {
		transform: scale(0.25);
	}

	.text {
		aspect-ratio: 2;
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

	.text {
		display: flex;
		flex-direction: column;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
			Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
			sans-serif;
		font-size: 80px;
		background: #000;
		color: white;
		padding: 1em;
		overflow: hidden;
		line-height: 1.3;
	}

	.text .content {
		height: 0;
		flex: 1;
		overflow: auto;
	}

	.text .progress {
		display: flex;
		align-items: center;
	}

	.text .progress span {
		width: 6em;
		line-height: 1;
		position: relative;
		top: 0.05em;
	}

	.text progress {
		flex: 1;
		margin: 0 1em;
		height: 1em;
		appearance: none;
		background: #333;
		border: none;
	}

	.text progress::-webkit-progress-bar {
		background: red;
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
