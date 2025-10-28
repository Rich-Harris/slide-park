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

	/** @type {SlideStub | null} */
	let prev = null;

	for (let content of markdown.split(/^#+ /m).slice(1)) {
		const match = pattern.exec(content);

		if (!match) {
			throw new Error(`Invalid slide: \n---\n${content}\n---`);
		}

		let [_, title, text = '', component = ''] = match;

		if (text === '' && component === '') continue;

		const imported = new Set();

		const steps = text.split(/\n+---\n+/).map((content) => {
			const [_, config, markdown] = /^((?:> .+\n)*\n+)?([^]+)/m.exec(
				content.trim()
			);

			const state = {};

			if (config) {
				for (const line of config.trim().split('\n')) {
					const [_, key, value] = /^> ([^=\s]+)(?:\s*=\s*(.+))?$/.exec(line);

					let parsed;

					if (value) {
						if (value.startsWith('./')) {
							parsed = value;
							imported.add(value);
						} else {
							parsed = JSON.parse(value);
						}
					} else {
						parsed = true;
					}

					state[key] = parsed;
				}
			}

			return {
				state,
				words: marked(markdown)
			};
		});

		if (component) {
			// extract all <enhanced:img> (TODO and <img> etc) and make them preloadable
			const images = [];

			for (const match of component.matchAll(
				/<enhanced:img([\s\S]+?)(\/>|<\/enhanced:img>)/g
			)) {
				const src = /src=(?:(['"])(?!\1)+\1|[^\s]+)/.exec(match[1]);
				images.push(`<enhanced:img ${src}></enhanced:img>`);
			}

			component += `{#snippet __images()}<div hidden>${images.join('')}</div>{/snippet} {@render __images()}`;
		} else {
			const message = `Missing component for slide ${slides.length + 1} ("${title}")`;

			console.error(`\u001B[1m\u001B[31m${message}\u001B[39m\u001B[22m`);
			component = `<h1 style="color: hotpink">${title}</h1> {#snippet __images()}{/snippet}`;
		}

		let steps_declaration = JSON.stringify(steps);

		let imports = [...imported]
			.map((source, i) => {
				const name = `__import_${i}`;
				steps_declaration = steps_declaration.replaceAll(`"${source}"`, name);
				return `import * as ${name} from '${source}';`;
			})
			.join('');

		component = `<script module>${imports}export const title = ${JSON.stringify(title)}; export const steps = ${steps_declaration}; export { __images }</script>\n\n${component}`;

		const slide = {
			num_steps: steps.length,
			num_words: steps.reduce((t, s) => t + s.words.split(/\s+/).length, 0),
			component
		};

		slides.push(slide);

		prev = slide;
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

		async configResolved(config) {
			svelte_plugin =
				config.plugins.find((p) => p.name === 'vite-plugin-svelte:compile') ??
				config.plugins.find((p) => p.name === 'vite-plugin-svelte');

			if (!svelte_plugin) {
				throw new Error(
					`Could not find vite-plugin-svelte:compile or vite-plugin-svelte`
				);
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

					const loaders = slides.map((slide, i) => {
						const load = `() => import('${file}?slide-park&slide=${i}')`;
						const load_next = slides[i + 1]
							? `() => import('${file}?slide-park&slide=${i + 1}')`
							: 'undefined';

						return `{ num_steps: ${slide.num_steps}, num_words: ${slide.num_words}, load: ${load}, load_next: ${load_next} }`;
					});

					const index = template.replace('SLIDES', `[${loaders.join(',\n')}]`);

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
						const transform =
							svelte_plugin.transform.handler ?? svelte_plugin.transform;

						const transformed = await transform.call(
							this,
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
