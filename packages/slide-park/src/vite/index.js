/** @import { SlideStub, Step } from './types.js' */
import * as fs from 'node:fs';
import * as url from 'node:url';
import { marked } from 'marked';

const asset_dir = url.fileURLToPath(new URL('.', import.meta.url));

const template = fs.readFileSync(`${asset_dir}/template.js`, 'utf-8');

const pattern =
	/(.+)\n+(?:([^`][\s\S]+?))?(?:\n+```svelte\n*([\s\S]+)\n*```)?[\s\n]*$/;

/**
 * @param {string} file
 * @returns {Promise<SlideStub[]>}
 */
async function load(file) {
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

		const imported = new Set();

		/** @type {Step[]} */
		const steps = [];

		for (const content of text.split(/\n+---\n+/)) {
			const match = /^((?:> .+\n)*\n+)?([^]+)/m.exec(content.trim());
			if (!match) throw new Error('an impossible situation occurred');

			const [_, config, markdown] = match;

			/**
			 * @type {Record<string, any}
			 */
			const state = {};

			if (config) {
				for (const line of config.trim().split('\n')) {
					const match = /^> ([^=\s]+)(?:\s*=\s*(.+))?$/.exec(line);
					if (!match) throw new Error('an impossible situation occurred');

					const [_, key, value] = match;

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

			steps.push({
				state,
				words: await marked(markdown)
			});
		}

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
	}

	return slides;
}

/**
 * @returns {import('vite').PluginOption[]}
 */
export function slides() {
	/** @type {Map<string, SlideStub[]>} */
	let lookup = new Map();

	return [
		// transform `content.md?slide-park` to a module that exposes `getIndex` and `getSlide` functions
		{
			name: 'slide-park',

			load: {
				filter: {
					id: /\?slide-park/
				},

				async handler(id) {
					const [file] = id.split('?');
					const slides = await load(file);

					lookup.set(file, slides);

					const loaders = slides.map((slide, i) => {
						const load = `() => import('virtual:slide-park${file}/${i}.svelte')`;
						const load_next = slides[i + 1]
							? `() => import('virtual:slide-park${file}/${i + 1}.svelte')`
							: 'undefined';

						return `{ num_steps: ${slide.num_steps}, num_words: ${slide.num_words}, load: ${load}, load_next: ${load_next} }`;
					});

					const index = template.replace('SLIDES', `[${loaders.join(',\n')}]`);

					return {
						code: index,
						map: null
					};
				}
			},

			configureServer(server) {
				server.watcher.on('change', async (file) => {
					if (!lookup.has(file)) return;

					const old_slides = /** @type {SlideStub[]} */ (lookup.get(file));
					const slides = await load(file);

					lookup.set(file, slides);

					const length = Math.max(slides.length, old_slides.length);

					for (let i = 0; i < length; i += 1) {
						if (JSON.stringify(old_slides[i]) === JSON.stringify(slides[i])) {
							continue;
						}

						const id = `virtual:slide-park${file}/${i}.svelte`;
						const mod = server.moduleGraph.getModuleById(id);
						if (mod) server.reloadModule(mod);
					}
				});
			}
		},

		// load `virtual:slide-park/path/to/content.md/1.svelte` as a Svelte component
		// containing the contents of the relevant part of `content.md`
		{
			name: 'slide-park:slide',

			resolveId: {
				filter: {
					id: {
						include: /virtual:slide-park/,
						exclude: /[?&]svelte&type=style&lang.css$/
					}
				},

				handler(id) {
					return id;
				}
			},

			load: {
				filter: {
					id: {
						include: /virtual:slide-park/,
						exclude: /[?&]svelte&type=style&lang.css$/
					}
				},

				handler(id) {
					const parts = id.slice('virtual:slide-park'.length).split('/');
					const [index] = /** @type {string} */ (parts.pop()).split('.');

					const file = parts.join('/');

					const slides = /** @type {SlideStub[]} */ (lookup.get(file));
					const slide = slides[+index];

					return {
						code: slide.component,
						map: null
					};
				}
			}
		},

		// resolve any imports inside `virtual:slide-path/path/to/content.md/1.svelte`
		// relative to the original `content.md` file
		{
			name: 'slide-park:asset',

			resolveId: {
				async handler(id, importer) {
					if (!importer?.startsWith('virtual:slide-park')) {
						return;
					}

					const file = importer
						.slice('virtual:slide-park'.length)
						.split('/')
						.slice(0, -1)
						.join('/');

					return await this.resolve(id, file);
				}
			}
		}
	];
}
