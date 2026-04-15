<script lang="ts">
	import type { SlideData } from '../index.js';

	interface Props {
		data: SlideData;
		wpm: number;
	}

	let { data, wpm }: Props = $props();

	let content: HTMLElement;

	const words_per_second = $derived(wpm / 60);

	const step_index = $derived(data.current.steps.indexOf(data.current.step));

	/** the number of words read in this slide */
	const words_read = $derived(
		data.current.steps
			.slice(0, step_index)
			.reduce((t, s) => t + s.words.split(/\s/).length, 0)
	);

	const remaining_words = $derived.by(() => {
		return data.words.unread - words_read;
	});

	const remaining_seconds = $derived(
		Math.round(remaining_words / words_per_second)
	);

	function pad(n: number) {
		return n < 10 ? '0' + n : n;
	}

	function scroll(node: HTMLElement, fn: () => boolean) {
		$effect(() => {
			if (fn()) {
				node.scrollIntoView({
					behavior: 'smooth'
				});
			}
		});
	}
</script>

<div class="text">
	<div class="content" bind:this={content}>
		{#each data.current.steps as step}
			<section
				use:scroll={() => step === data.current.step}
				aria-current={step === data.current.step}
			>
				{#if Object.keys(step.state).length > 0}
					<pre><code>{JSON.stringify(step.state)}</code></pre>
				{/if}

				{@html step.words}
			</section>
		{/each}
	</div>

	<p class="progress">
		<span style="width: 4em;">{data.current.index + 1}/{data.total}</span>
		<progress value={(data.words.read + words_read) / data.words.total} max="1"
		></progress>
		<span style="width: 9em; text-align: right;">
			{Math.floor(remaining_seconds / 60)}m{pad(remaining_seconds % 60)}s
			remaining
		</span>
	</p>
</div>

<style>
	.text {
		aspect-ratio: 2;
		display: flex;
		flex-direction: column;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
		font-size: calc(20px / var(--scale));
		background: #000;
		color: white;
		padding: 1em;
		overflow: hidden;
		line-height: 1.3;

		.content {
			height: 0;
			flex: 1;
			overflow-x: hidden;
			overflow-y: auto;

			section[aria-current='false'] {
				color: #888;
			}

			section:not(:last-child) {
				border-bottom: 4px solid #666;
			}
		}

		pre code {
			font-size: 0.8em;
		}

		.progress {
			display: flex;
			align-items: center;

			span {
				width: 6em;
				line-height: 1;
				position: relative;
				top: 0.05em;
			}
		}

		progress {
			flex: 1;
			margin: 0 1em;
			height: 1em;
			appearance: none;
			background: #333;
			border: none;

			&::-webkit-progress-bar {
				background: #333;
			}
		}
	}
</style>
