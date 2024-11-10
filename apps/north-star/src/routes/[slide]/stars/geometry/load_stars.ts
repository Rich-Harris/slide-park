import * as THREE from 'three';
import stars_url from './data/stars.14.json?url';
import type GeoJSON from 'geojson';
import { bv_to_rgb } from './bv';
import { project } from './utils';

// https://en.wikipedia.org/wiki/Apparent_magnitude
const n = 100 ** 0.2;

export async function load_stars() {
	const response = await fetch(stars_url);
	const stars = (await response.json()) as GeoJSON.FeatureCollection<
		GeoJSON.Point,
		{ mag: number; bv: string }
	>;

	const position = [];
	const brightness = [];
	const color = [];

	const tmp: number[] = [];

	for (const feature of stars.features) {
		const apparent_magnitude = feature.properties.mag;
		const scale = 1e3 / n ** (apparent_magnitude / 2);
		const point = feature.geometry;

		const [lng, lat] = point.coordinates;

		if (lat < 10) continue;

		project(lng, lat, 1, tmp);

		const [r, g, b] = bv_to_rgb(+feature.properties.bv);

		position.push(tmp[0], tmp[1], tmp[2]);
		brightness.push(scale);
		color.push(r ** 10, g ** 10, b ** 10);
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
	geometry.setAttribute('brightness', new THREE.Float32BufferAttribute(brightness, 1));
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));

	return geometry;
}
