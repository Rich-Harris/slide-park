<script lang="ts">
	import { T } from '@threlte/core';
	import data from './stars.6.json?url';
	import type GeoJSON from 'geojson';

	let features = $state.raw<GeoJSON.Feature[]>([]);

	$effect(() => {
		fetch(data)
			.then((r) => r.json())
			.then((data) => {
				features = data.features;
			});
	});
</script>

<T.Mesh>
	<T.BoxGeometry />
	<T.MeshBasicMaterial />

	{#each features as feature}{/each}
</T.Mesh>
