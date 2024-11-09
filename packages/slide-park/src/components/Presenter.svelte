<script lang="ts">
	import type { Slide } from '../index.js';

	interface Props {
		slide: Slide;
	}

	let { slide }: Props = $props();

	function pad(n: number) {
		return n < 10 ? '0' + n : n;
	}
</script>

<div class="text">
	<div class="content">{@html slide.text}</div>
	<p class="progress">
		<span style="width: 4em;">{slide.index + 1}/{slide.total}</span>
		<progress value={(slide.index + 1) / slide.total} max="1"></progress>
		<span style="width: 9em; text-align: right;">
			{Math.floor(slide.remaining_seconds / 60)}m{pad(
				slide.remaining_seconds % 60
			)}s remaining
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
		font-size: 80px;
		background: #000;
		color: white;
		padding: 1em;
		overflow: hidden;
		line-height: 1.3;

		.content {
			height: 0;
			flex: 1;
			overflow: auto;
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
