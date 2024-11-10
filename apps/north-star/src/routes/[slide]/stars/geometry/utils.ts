export function project(lng: number, lat: number, distance = 1, out = [0, 0, 0]) {
	const lng_rad = (lng * Math.PI) / 180;
	const lat_rad = (lat * Math.PI) / 180;

	let x = Math.sin(lng_rad);
	let z = Math.cos(lng_rad);
	let y = Math.tan(lat_rad);

	const mag = Math.sqrt(x * x + y * y + z * z);

	out[0] = (x * distance) / mag;
	out[1] = (y * distance) / mag;
	out[2] = (z * distance) / mag;

	return out;
}
