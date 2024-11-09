<script lang="ts">
	import SlidePark from '@rich_harris/slide-park';

	let { data } = $props();
</script>

<svelte:head>
	<title>IMHO • {data.current.title}</title>
</svelte:head>

<SlidePark {data} />
