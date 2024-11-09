<script lang="ts">
	import SlidePark from '@rich_harris/slide-park';
	import './styles.css';

	let { data } = $props();
</script>

<svelte:head>
	<title>North Star • {data.current.title}</title>
</svelte:head>

<SlidePark {data}>
	<data.current.component step={data.step} />
</SlidePark>
