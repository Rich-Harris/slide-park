<script lang="ts">
	import { Canvas } from '@threlte/core';
	import SlidePark from '@rich_harris/slide-park';
	import StarField from './stars/StarField.svelte';
	import './styles.css';

	let { data } = $props();
</script>

<svelte:head>
	<title>North Star • {data.current.title}</title>
</svelte:head>

<SlidePark {data} defaultMode="viewer">
	<div class="background">
		<Canvas>
			<StarField />
		</Canvas>
	</div>

	{#key data.current.index}
		<div class="slide">
			<data.current.component step={data.step} />
		</div>
	{/key}
</SlidePark>

<style>
	.background,
	.slide {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.background {
		background: radial-gradient(at center, black, hsl(220 100 3));
	}
</style>
