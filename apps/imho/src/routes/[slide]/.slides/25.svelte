<script context="module">export const metadata = {"text":"<p>That&#39;s basically what Svelte is — we&#39;ve augmented HTML with state and control flow, we&#39;ve augmented CSS with scoped styles, and we&#39;ve augmented JavaScript with reactivity.</p>\n<p>Some people are really put off by this, and that&#39;s totally fine. But for people who aren&#39;t anti-DSL, we&#39;ve found that this hits a sweet spot between familiarity and novelty — we&#39;re using languages you already know, but we&#39;re extending them in useful ways, and like with the Lucy example we&#39;re able to express UI much more concisely this way.</p>\n","title":"Svelte","classnames":"","styles":[]};</script>

<script>
	import Prism from 'prismjs';
	import 'prism-svelte';

	export let step;

	const SCRIPT = 'script';
	const STYLE = 'style';

	const svelte = (code) => Prism.highlight(code, Prism.languages.svelte, 'svelte');
</script>

<pre><code
		>{@html svelte(`<${SCRIPT}>
	let count = 0;

	function increment() {
		count += 1;
	}
</${SCRIPT}>

<button on:click={() => count += 1}>
	clicks: {count}
</button>

<${STYLE}>
	button {
		font-size: 100px;
	}
</${STYLE}>`)}</code
	></pre>

<style>
	code {
		font-size: 2rem;
	}

	span {
		transition: opacity 0.2s;
	}

	.faded {
		opacity: 0.3;
	}
</style>
