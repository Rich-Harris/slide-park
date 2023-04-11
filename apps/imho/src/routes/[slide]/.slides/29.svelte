<script context="module">export const metadata = {"text":"<p>Fast-forward a few years, and some frameworks have decided that ignoring the semantics of JavaScript isn&#39;t just okay, it&#39;s actually a core selling point of the framework.</p>\n<p>I&#39;m going to use Remix as an example, but it&#39;s not the only one — prior to version 13 and the introduction of the App Router, Next.js did something very similar, for example.</p>\n<p>This is a Remix route. The idea is that your server code, which loads data, can be co-located with your view code. When the client app is built, the <code>loader</code> and anything it depends on is &#39;tree-shaken&#39; away. But this is not tree-shaking, it&#39;s made-up, non-standard JavaScript semantics. You might think &#39;alright, pedant, who made you the JavaScript hall monitor?&#39; Touché.</p>\n","title":"Remix/Next co-located loaders","classnames":"","styles":[]};</script>

<script>
	import Prism from 'prismjs';
	import 'prismjs/components/prism-jsx.js';

	export let step;

	const js = (code) => Prism.highlight(code, Prism.languages.jsx, 'jsx');
</script>

<pre><code
		>{@html js(`import { useLoaderData } from '@remix-run/react';`)}
<span class:faded={step === 1}
			>{@html js(`import { json } from '@remix-run/node';
import * as db from '../db';

export async function loader() {
	const answer = await db.getAnswer();
	return json({ answer });
}`)}</span
		>

{@html js(`export default function Page() {
	const data = useLoaderData();
	return <p>the answer is {data.answer}</p>;
}`)}</code
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
