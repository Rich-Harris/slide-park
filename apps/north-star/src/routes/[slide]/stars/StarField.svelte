<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';
	import data from './stars.14.json?url';
	import type GeoJSON from 'geojson';
	import disc from './disc.png';
	import { OrbitControls } from '@threlte/extras';
	import { create_sprite } from './sprite';
	import { bv_to_rgb } from './bv';

	// https://en.wikipedia.org/wiki/Apparent_magnitude
	const n = 100 ** 0.2;

	let fov = $state(130);

	let features = $state.raw<GeoJSON.Feature<GeoJSON.Point, { mag: number; bv: string }>[]>([]);
	let geometry = $state() as THREE.BufferGeometry;

	$effect(() => {
		fetch(data)
			.then((r) => r.json())
			.then((data) => {
				features = data.features;

				const position = [];
				const brightness = [];
				const color = [];

				for (const feature of features) {
					const apparent_magnitude = feature.properties.mag;
					const scale = 1e3 / n ** (apparent_magnitude / 2);
					const point = feature.geometry as GeoJSON.Point;

					const [lng, lat] = point.coordinates;

					// if (lat < 20) continue;

					const lng_rad = (lng * Math.PI) / 180;
					const lat_rad = (lat * Math.PI) / 180;

					let x = Math.sin(lng_rad);
					let z = Math.cos(lng_rad);
					let y = Math.tan(lat_rad);

					const mag = Math.sqrt(x * x + y * y + z * z);

					x /= mag;
					y /= mag;
					z /= mag;

					const [r, g, b] = bv_to_rgb(+feature.properties.bv);

					position.push(x, y, z);
					brightness.push(scale);
					color.push(r ** 10, g ** 10, b ** 10);
				}

				geometry = new THREE.BufferGeometry();
				geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
				geometry.setAttribute('brightness', new THREE.Float32BufferAttribute(brightness, 1));
				geometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
			});
	});

	const sprite = new THREE.TextureLoader().load(create_sprite());
	// const sprite = new THREE.TextureLoader().load(disc);
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
		camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.00005);
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

<T.Points>
	{#if geometry}
		<T is={geometry} />
	{/if}

	<T is={material} size={0.0001} color="#ffffff" opacity={1} />
</T.Points>
