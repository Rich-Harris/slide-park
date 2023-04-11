<script context="module">export const metadata = {"text":"<p>This server function looks and feels like an internal implementation detail. It&#39;s not though — we&#39;ve actually made an HTTP endpoint that anybody can call with any data. So TypeScript is telling us that <code>field</code> can be <code>name</code> or <code>qty</code>, but in reality it could be <code>name; DROP TABLE users</code>.</p>\n<p>When you make an endpoint explicit and you&#39;re working with form data, you&#39;re aware on some level that the data is untrusted, and so I think you&#39;re much less likely to make this sort of error than if it looks like a private function call. Now you might be thinking &#39;Rich, I would never make that mistake&#39;, and I believe you. But look to your left and your right at the people around you — do you trust all them not to make that mistake.</p>\n<p>Bear in mind also that if you use sourcemaps for debugging, and they contain the original server code, you&#39;re basically handing attackers a diagram of your defenses. This shit makes me very nervous.</p>\n","title":"Drop table","classnames":"","styles":[]};</script>

<script>
	import Prism from 'prismjs';
	import 'prismjs/components/prism-jsx.js';

	export let step;

	const js = (code) => Prism.highlight(code, Prism.languages.jsx, 'jsx');
</script>

<pre><code
		>{@html js(`import server$ from 'solid-start/server';
import * as db from '../db.js';

function Component() {
	// ...

	const getSortedData = server$(async (field: 'name' | 'qty') => {
		return await db.query(\`SELECT * FROM STUFF ORDER BY \${field} ASC\`);
	});

	const sort = async (field: 'name' | 'qty') => {
		const data = await getSortedData(field);
		setData(data);
	};

	return (
		<table>
			<thead>
				<tr>
					<button onClick={() => sort('name')}>name</button>
					<button onClick={() => sort('qty')}>quantity</button>
				</tr>
			</thead>
		</table>

		// etc...
	);
}
`)}</code
	></pre>

<style>
	code {
		font-size: 1.6rem;
	}

	span {
		transition: opacity 0.2s;
	}

	.faded {
		opacity: 0.3;
	}
</style>
