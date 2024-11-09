<script lang="ts">
	import SlidePark from '@rich_harris/slide-park';
	import '../global.css';

	let { data } = $props();
</script>

<SlidePark slide={data.slide} />
