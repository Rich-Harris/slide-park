import * as THREE from 'three';
import earcut, { flatten } from 'earcut';
import mw_url from './data/mw.json?url';
import type GeoJSON from 'geojson';
import { project } from './utils';

export async function load_milkyway() {
	const response = await fetch(mw_url);
	const { features } = (await response.json()) as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;

	const layers: THREE.BufferGeometry[] = [];

	const tmp: number[] = [];

	for (const feature of features.slice(1)) {
		if (feature.geometry.coordinates.length !== 1) {
			throw new Error(`Unexpected`);
		}

		for (const ring of feature.geometry.coordinates[0]) {
			const position = [];
			const normal = []; // TODO do we need this given that the points are all on a sphere, or is there some shader trick we can do to invert the position?
			const index = [];
			const offset = position.length / 3;

			const data = flatten([ring]);
			const triangles = earcut(data.vertices, data.holes, data.dimensions);

			for (const coords of ring) {
				project(coords[0], coords[1], 1.1, tmp);

				position.push(tmp[0], tmp[2], tmp[1]);
				normal.push(-tmp[0], -tmp[2], -tmp[1]);
			}

			for (const i of triangles) {
				index.push(i - offset);
			}

			const geometry = new THREE.BufferGeometry();

			geometry.setIndex(triangles);
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
			geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));

			layers.push(geometry);
		}
	}

	return layers;
}
