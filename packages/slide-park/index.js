import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { marked } from 'marked';

const page_svelte = fs.readFileSync(
	url.fileURLToPath(new URL('assets/+page.svelte', import.meta.url))
);
const page_js = fs.readFileSync(
	url.fileURLToPath(new URL('assets/+page.js', import.meta.url))
);

/**
 * @typedef
 * {{
 *   key: string;
 *   value: string;
 * }}
 * Style
 */

/**
 * @typedef
 * {{
 *   steps: number;
 *   words: number;
 *   component: string;
 * }}
 * Slide
 */

/**
 *
 * @param {Slide[]} slides
 */
const index = (slides) => `export const slides = [
	${slides
		.map(
			(slide, i) => `{
		steps: ${slide.steps},
		words: ${slide.words},
		load: () => import(${JSON.stringify(`./${i}.svelte`)})
	}`
		)
		.join(',\n\t')}
];`;

/**
 * @param {string} file
 * @param {boolean} is_build
 * @returns {{ slides: Slide[] }}
 */
function load(file, is_build) {
	const markdown = fs.readFileSync(file, 'utf-8');

	const slides = markdown.split(/^#+ /m).slice(1);

	return {
		slides: slides.map((content, i) => {
			content = content.trim();

			const pattern =
				/(.+)\n*((?:> [^\n]+\n?)+)?(?:\n([\s\S]+?))?(?:\n+```svelte\n*([\s\S]+)\n*```)?$/;

			const match = pattern.exec(content);

			if (!match) {
				throw new Error(`Invalid slide: \n---\n${content}\n---`);
			}

			const title = match[1].trim();

			let classnames = '';
			let steps = 1;

			/** @type {Style[]>} */
			const styles = [];

			if (match[2]) {
				for (const line of match[2].trim().split('\n')) {
					const [key, value] = line
						.slice(2)
						.split(':')
						.map((str) => str.trim());

					if (key.startsWith('--')) {
						if (value.startsWith('url(')) {
							// TODO extract relative URLs
						}

						styles.push({ key, value });
					} else if (key === 'steps') {
						steps = Number(value);
					} else if (key === 'class') {
						classnames = value;
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

				if (is_build) throw new Error(message);

				console.error(`\u001B[1m\u001B[31m${message}\u001B[39m\u001B[22m`);
				component = `<h1 style="color: hotpink">${title}</h1>`;
			}

			const metadata = JSON.stringify({
				text: marked(text),
				title,
				classnames,
				styles
			});

			component = `<script context="module">export const metadata = ${metadata};</script>\n\n${component}`;

			/** @type {Slide} */
			const slide = {
				steps,
				words: text.split(/\s+/).length,
				component
			};

			return slide;
		})
	};
}

/** @type {(opts: { input: string, output?: string }) => import('vite').Plugin} */
export function slides({ input, output = 'src/routes' }) {
	if (!input) {
		throw new Error('input not specified');
	}

	input = path.resolve(input);
	const dest = path.resolve(output, '[slide]/.slides');

	fs.rmSync(dest, { recursive: true, force: true });
	fs.cpSync(input, dest, { recursive: true });

	const cache = new Map();

	/**
	 * @param {string} file
	 * @param {string | Buffer} contents
	 */
	function write(file, contents) {
		const cached = cache.get(file);

		if (cached && cached.length === contents.length) {
			let identical = true;
			for (let i = 0; i < cached.length; i += 1) {
				if (cached[i] !== contents[0]) {
					identical = false;
					break;
				}
			}

			if (identical) return;
		}

		try {
			fs.mkdirSync(path.dirname(file), { recursive: true });
		} catch {}

		fs.writeFileSync(file, contents);
		cache.set(file, contents);
	}

	/** @param {boolean} is_build */
	async function render(is_build) {
		const { slides } = load(`${input}/content.md`, is_build);

		for (let i = 0; i < slides.length; i += 1) {
			const slide = slides[i];
			write(`${dest}/${i}.svelte`, slide.component);
		}

		write(`${dest}/index.js`, index(slides));
		write(`${output}/[slide]/+page.svelte`, page_svelte);
		write(`${output}/[slide]/+page.js`, page_js);
	}

	const base = path.resolve(input) + path.sep;
	const doc = base + 'content.md';

	let is_build = false;

	return {
		name: 'slides',

		configResolved(config) {
			is_build = config.command === 'build';
		},

		buildStart() {
			render(is_build);
		},

		configureServer(vite) {
			vite.watcher.on('add', (file) => {
				const relative = path.relative(input, file);
				const resolved = path.join(dest, relative);

				try {
					fs.mkdirSync(path.dirname(resolved), { recursive: true });
				} catch {}

				fs.copyFileSync(file, path.join(dest, relative));
			});

			vite.watcher.on('unlink', (file) => {
				const relative = path.relative(input, file);
				fs.unlinkSync(path.join(dest, relative));
			});

			vite.watcher.on('change', (file) => {
				if (!file.startsWith(input + path.sep)) return;

				if (file === doc) {
					render(false);
				} else {
					const relative = path.relative(input, file);
					fs.copyFileSync(file, path.join(dest, relative));
				}
			});
		}
	};
}
