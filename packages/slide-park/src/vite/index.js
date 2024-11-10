/** @import { SlideStub } from './types.js' */
import * as fs from 'node:fs';
import * as url from 'node:url';
import { marked } from 'marked';

const asset_dir = url.fileURLToPath(new URL('.', import.meta.url));

const template = fs.readFileSync(`${asset_dir}/template.js`, 'utf-8');

const pattern =
	/(.+)\n+(?:([^`][\s\S]+?))?(?:\n+```svelte\n*([\s\S]+)\n*```)?[\s\n]*$/;

/**
 * @param {string} file
 * @returns {SlideStub[]}
 */
function load(file) {
	const markdown = fs.readFileSync(file, 'utf-8');

	/** @type {SlideStub[]} */
	const slides = [];

	for (let content of markdown.split(/^#+ /m).slice(1)) {
		const match = pattern.exec(content);

		if (!match) {
			throw new Error(`Invalid slide: \n---\n${content}\n---`);
		}

		let [_, title, text = '', component = ''] = match;

		if (text === '' && component === '') continue;

		const steps = text.split(/\n+---\n+/).map((content) => {
			const [_, config, markdown] = /^((?:> .+\n)*\n+)?([^]+)/m.exec(
				content.trim()
			);

			const state = {};

			if (config) {
				for (const line of config.trim().split('\n')) {
					const match = /^> ([^=]+)(?:\s*=\s*(.+))?$/.exec(line);
					state[match[1]] = match[2] ? JSON.parse(match[2]) : true;
				}
			}

			return {
				state,
				words: marked(markdown)
			};
		});

		if (!component) {
			const message = `Missing component for slide ${slides.length + 1} ("${title}")`;

			console.error(`\u001B[1m\u001B[31m${message}\u001B[39m\u001B[22m`);
			component = `<h1 style="color: hotpink">${title}</h1>`;
		}

		component = `<script context="module">export const title = ${JSON.stringify(title)}; export const steps = ${JSON.stringify(steps)};</script>\n\n${component}`;

		slides.push({
			num_steps: steps.length,
			num_words: steps.reduce((t, s) => t + s.words.split(/\s+/).length, 0),
			component
		});
	}

	return slides;
}

/**
 * @returns {import('vite').PluginOption}
 */
export function slides() {
	/** @type {Map<string, SlideStub[]>} */
	let lookup = new Map();
	let svelte_plugin;

	return {
		name: 'slide-park',

		configResolved(config) {
			svelte_plugin = config.plugins.find(
				(plugin) => plugin.name === 'vite-plugin-svelte'
			);

			if (!svelte_plugin) {
				throw new Error(`Could not find vite-plugin-svelte`);
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
									`{ num_steps: ${slide.num_steps}, num_words: ${slide.num_words}, load: () => import('${file}?slide-park&slide=${i}') }`
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
