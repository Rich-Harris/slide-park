<script lang="ts">
	import SlidePark from '@rich_harris/slide-park';

	interface Props {
		data: Awaited<ReturnType<typeof import('./+page').load>>;
	}

	let { data }: Props = $props();
</script>

<SlidePark slide={data.slide} />
