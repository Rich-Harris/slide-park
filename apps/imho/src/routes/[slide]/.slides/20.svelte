<script context="module">export const metadata = {"text":"<p>So on the SvelteKit side we use client-side routing by default. Unlike some frameworks we don&#39;t use a <code>&lt;Link&gt;</code> component, we just intercept clicks on anchor tags. (next) If you want to disable client-side routing for some reason, you can do it on an individual link by adding a <code>data-sveltekit-reload</code> attribute, or (next) you can do it for a whole group of links or even the entire document.</p>\n<p>One thing people have rightly criticised SPAs for is that they encourage longer sessions, meaning it&#39;s more likely that a new version of the app will be deployed while you were using the old one, which can cause client-side routing to fail, because files have moved around. In SvelteKit, if we detect that case we will fall back to a full page navigation, which usually fixes it, but (next) we also make it easy to proactively detect new deployments and disable client-side routing when that happens.</p>\n","title":"How SvelteKit straddles the divide","classnames":"","styles":[]};</script>

<script>
	import Prism from 'prismjs';
	import 'prismjs/components/prism-markup.js';
	import 'prismjs/components/prism-diff.js';

	export let step;
</script>

{#if step === 0}
	<pre><code
			>&lt;body>
	&lt;nav>
		&lt;a href="/">home&lt;/a>
		&lt;a href="/about">about&lt;/a>
		&lt;a href="/contact">contact&lt;/a>
	&lt;/nav>
&lt;/body></code
		></pre>
{/if}

{#if step === 1}
	<pre><code
			>&lt;body>
	&lt;nav>
		&lt;a href="/" <span class="new">data-sveltekit-reload</span>>home&lt;/a>
		&lt;a href="/about">about&lt;/a>
		&lt;a href="/contact">contact&lt;/a>
	&lt;/nav>
&lt;/body></code
		></pre>
{/if}

{#if step === 2}
	<pre><code
			>&lt;body <span class="new">data-sveltekit-reload</span>>
	&lt;nav>
		&lt;a href="/">home&lt;/a>
		&lt;a href="/about">about&lt;/a>
		&lt;a href="/contact">contact&lt;/a>
	&lt;/nav>
&lt;/body></code
		></pre>
{/if}

{#if step === 3}
	<pre><code style="font-size: 2.6rem"
			>&lt;script>
	<span class="new">import &#123; updated } from '$app/stores';</span>
&lt;/script>

&lt;body <span class="new">data-sveltekit-reload=&#123;$updated ? '' : 'off'}</span>>
	&lt;nav>
		&lt;a href="/">home&lt;/a>
		&lt;a href="/about">about&lt;/a>
		&lt;a href="/contact">contact&lt;/a>
	&lt;/nav>
&lt;/body></code
		></pre>
{/if}

<style>
	pre {
		width: 80rem;
	}

	.new {
		color: var(--green);
	}
</style>
