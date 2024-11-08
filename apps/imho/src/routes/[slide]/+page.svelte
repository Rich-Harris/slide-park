<script lang="ts">
	interface Props {
		data: Awaited<ReturnType<typeof import('./+page').load>>;
	}

	let { data }: Props = $props();
</script>

<data.component {data} />
