<script>
	import { onMount } from 'svelte';

	let characters = ['🌶️'];

	let confetti = new Array(100)
		.fill()
		.map((_, i) => {
			return {
				character: characters[i % characters.length],
				x: Math.random() * 100,
				y: -20 - Math.random() * 100,
				r: 0.1 + Math.random() * 0.9
			};
		})
		.sort((a, b) => a.r - b.r);

	onMount(() => {
		let frame;

		function loop() {
			frame = requestAnimationFrame(loop);

			confetti = confetti.map((emoji) => {
				emoji.y += 0.05 * emoji.r;
				if (emoji.y > 120) emoji.y = -20;
				return emoji;
			});
		}

		loop();

		return () => cancelAnimationFrame(frame);
	});
</script>

{#each confetti as c}
	<span
		style="left: {c.x}%; top: {c.y}%; --size: {c.r * c.r}; filter: blur({Math.max(
			0,
			10 * (0.7 - c.r)
		)}px)"
	>
		{c.character}
	</span>
{/each}

<style>
	:global(body) {
		overflow: hidden;
	}

	span {
		position: absolute;
		font-size: 6em;
		user-select: none;
		transform: scale(var(--size));
		filter: blur(calc((1 - (1px * var(--size)))));
	}
</style>
