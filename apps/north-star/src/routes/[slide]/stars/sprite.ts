export function create_sprite() {
	const canvas = document.createElement('canvas');

	const d = 256;
	const r = d / 2;

	canvas.width = d;
	canvas.height = d;
	const ctx = canvas.getContext('2d')!;

	let halo = ctx.createRadialGradient(r, r, 0, r, r, r);
	halo.addColorStop(0, 'rgb(255 255 255 / 0.2)');
	halo.addColorStop(1, 'rgb(255 255 255 / 0)');
	ctx.fillStyle = halo;
	ctx.fillRect(0, 0, d, d);

	let dot = ctx.createRadialGradient(r, r, 0, r, r, d * 0.1);
	dot.addColorStop(0, 'rgb(255 255 255 / 1)');
	dot.addColorStop(0.8, 'rgb(255 255 255 / 1)');
	dot.addColorStop(1, 'rgb(255 255 255 / 0)');
	ctx.fillStyle = dot;
	ctx.fillRect(0, 0, d, d);

	return canvas.toDataURL();
}
