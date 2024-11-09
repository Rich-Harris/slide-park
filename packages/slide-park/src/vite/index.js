import * as fs from 'node:fs';
import * as url from 'node:url';
import { marked } from 'marked';

const asset_dir = url.fileURLToPath(new URL('.', import.meta.url));

const template = fs.readFileSync(`${asset_dir}/template.js`, 'utf-8');

/**
 * @param {string} file
 * @returns {Array<{ steps: number; words: number; component: string; }>}
 */
function load(file) {
	const markdown = fs.readFileSync(file, 'utf-8');

	const slides = markdown.split(/^#+ /m).slice(1);

	return slides.map((content, i) => {
		content = content.trim();

		const pattern =
			/(.+)\n*((?:> [^\n]+\n?)+)?(?:\n([\s\S]+?))?(?:\n+```svelte\n*([\s\S]+)\n*```)?$/;

		const match = pattern.exec(content);

		if (!match) {
			throw new Error(`Invalid slide: \n---\n${content}\n---`);
		}

		const title = match[1].trim();

		let steps = 1;

		if (match[2]) {
			for (const line of match[2].trim().split('\n')) {
				const [key, value] = line
					.slice(2)
					.split(':')
					.map((str) => str.trim());

				if (key === 'steps') {
					steps = Number(value);
				} else {
					throw new Error(`Unknown config key: ${key}`);
				}
			}
		}

		let text = match[3] ?? '';
		let component = match[4] ?? '';

		if (text.startsWith('```svelte')) {
			component = text.slice('```svelte\n'.length, -'```\n'.length).trim();
			text = '';
		}

		if (!component) {
			const message = `Missing component for slide ${i + 1} ("${title}")`;

			console.error(`\u001B[1m\u001B[31m${message}\u001B[39m\u001B[22m`);
			component = `<h1 style="color: hotpink">${title}</h1>`;
		}

		const metadata = JSON.stringify({
			text: marked(text),
			title
		});

		component = `<script context="module">export const metadata = ${metadata};</script>\n\n${component}`;

		return {
			steps,
			words: text.split(/\s+/).length,
			component
		};
	});
}

/**
 * @returns {import('vite').PluginOption}
 */
export function slides() {
	let lookup = new Map();
	let svelte_plugin;
	let is_build = false;

	return {
		name: 'slides',

		configResolved(config) {
			is_build = config.command === 'build';

			svelte_plugin = config.plugins.find(
				(plugin) => plugin.name === 'vite-plugin-svelte'
			);

			if (!svelte_plugin) {
				throw new Error(`Could not find vite-plugin-svelte`);
			}
		},

		resolveId(importee, importer) {
			if (importee === 'slide-park:Slide.svelte') {
				// TODO do we need to faff around with virtual paths? we can just expose it from the package i think
				return `${asset_dir}/Slide.svelte`;
			}
		},

		load(id) {
			const [file, params] = id.split('?');

			if (params) {
				const q = new URLSearchParams(params);

				if (q.has('slide-park')) {
					let slides = lookup.get(file);
					if (!slides) {
						slides = load(file);
						lookup.set(file, slides);
					}

					const i = q.get('slide');

					if (i !== null) {
						const slide = slides[i];

						return {
							code: slide.component,
							map: null
						};
					}

					lookup.set(file, slides);

					const index = template.replace(
						'SLIDES',
						`[${slides
							.map(
								(slide, i) =>
									`{ steps: ${slide.steps}, words: ${slide.words}, load: () => import('${file}?slide-park&slide=${i}') }`
							)
							.join(',\n')}]`
					);

					return {
						code: index,
						map: null
					};
				}
			}
		},

		async transform(code, id, opts) {
			const [file, params] = id.split('?');

			if (params) {
				const q = new URLSearchParams(params);

				if (q.has('slide-park')) {
					const i = q.get('slide');

					if (i !== null) {
						const transformed = await svelte_plugin.transform(
							code,
							`${file}.${i}.svelte`,
							opts
						);

						return {
							...transformed,
							map: null
						};
					}
				}
			}
		},

		configureServer(vite) {
			vite.watcher.on('change', (file) => {
				if (lookup.has(file)) {
					lookup.set(file, load(file));
				}
			});
		}
	};
}
