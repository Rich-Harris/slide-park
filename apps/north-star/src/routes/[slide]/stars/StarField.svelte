<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';
	import type GeoJSON from 'geojson';
	import { create_sprite } from './sprite';
	import { load_stars } from './geometry/load_stars';
	import { load_milkyway } from './geometry/load_milkyway';

	let fov = $state(130);

	let geometry = $state.raw<{
		stars: THREE.BufferGeometry;
		milkyway: THREE.BufferGeometry[];
	}>();

	async function load() {
		const [stars, milkyway] = await Promise.all([load_stars(), load_milkyway()]);

		geometry = {
			stars,
			milkyway
		};
	}

	$effect(() => {
		load();
	});

	const sprite = new THREE.TextureLoader().load(create_sprite());
	sprite.colorSpace = THREE.SRGBColorSpace;

	const material = new THREE.PointsMaterial({
		transparent: true,
		depthWrite: false,
		map: sprite
	});

	material.onBeforeCompile = (params) => {
		params.vertexShader = 'attribute float brightness;' + params.vertexShader;
		params.vertexShader = 'attribute vec3 color; varying vec3 diffuse;' + params.vertexShader;
		params.fragmentShader = params.fragmentShader.replace(
			'uniform vec3 diffuse',
			'varying vec3 diffuse'
		);

		params.vertexShader = params.vertexShader.replace(
			'gl_PointSize = size;',
			`
				gl_PointSize = size * brightness;
				diffuse = color;
			`
		);
	};

	useTask((delta) => {
		camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), delta * -0.005);
	});

	let camera = $state.raw() as THREE.PerspectiveCamera;
</script>

<svelte:window
	onmousemove={(e) => {
		// camera.rotation.set(
		// 	camera.rotation.x,
		// 	camera.rotation.y,
		// 	(Math.PI * 2 * e.clientX) / window.innerWidth
		// );
	}}
	onwheel={(e) => {
		fov = fov * 1 + 0.1 * e.deltaY;
		fov = Math.min(140, Math.max(90, fov));
		console.log(fov);
		// console.log(e.deltaY);
	}}
/>

<T.PerspectiveCamera
	bind:ref={camera}
	makeDefault
	position={[0, 0, 0]}
	rotation={[Math.PI / 2, 0, 0, 'XYZ']}
	{fov}
	oncreate={(camera) => {
		// camera.lookAt(0.00789922374986603, 0.999917518533295, 0.01012711184727926);
	}}
></T.PerspectiveCamera>

{#if geometry}
	{#each geometry.milkyway as layer}
		<T.Mesh>
			<T is={layer} />

			<T.MeshBasicMaterial
				color="white"
				opacity={0.025}
				transparent
				depthWrite={false}
				depthTest={false}
			/>
		</T.Mesh>
	{/each}

	<T.Points>
		<T is={geometry.stars} />
		<T is={material} size={0.0001} color="#ffffff" opacity={1} />
	</T.Points>
{/if}
