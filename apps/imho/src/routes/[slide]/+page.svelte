<script lang="ts">
	import SlidePark from '@rich_harris/slide-park';

	let { data } = $props();
</script>

<svelte:head>
	<title>IMHO • {data.slide.title}</title>
</svelte:head>

<SlidePark slide={data.slide} />
