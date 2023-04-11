<script context="module">export const metadata = {"text":"<p>So for those of you who are not captives of web dev Twitter, let me quickly offer some definitions. A multi-page app or MPA is what people used to call a &#39;website&#39; — it&#39;s an app where every page is rendered by the server, and if you navigate between pages the browser will go back to the server, retrieve some fresh HTML, unload the current document, and create a new document from the new HTML.</p>\n<p>In contrast a single-page app or SPA doesn&#39;t unload the document when you navigate — instead, a client-side router will fetch any code and data it needs to render the new page, and update the document in-place, just like any non-navigation state change.</p>\n<p>Advocates of the multi-page app approach have made the following claims:</p>\n<ul>\n<li>MPAs are faster, because you don&#39;t need to load JavaScript</li>\n<li>MPAs are more accessible</li>\n<li>MPAs are less buggy</li>\n<li>MPAs work without JavaScript</li>\n</ul>\n<p>In return, the single-page app camp says that</p>\n<ul>\n<li>SPAs are faster, because even though you do need to load JavaScript, you were probably going to have to load some anyway, and this way you only have to load your analytics code or whatever on the first page load. Subsequent navigations are certainly going to be faster, because it&#39;s much easier to smartly preload data, and you&#39;re not recreating a document from scratch on every navigation.</li>\n<li>SPAs allow you to preserve state between navigations, such as the scroll position of a sidebar, or the video that&#39;s currently playing</li>\n<li>In an SPA, navigation is just like any other state change, so you can do things like continuous transitions. There&#39;s a view transitions API coming to the web platform that helps with this, and it&#39;s a wonderful addition, but it only covers stuff you can do with CSS. You couldn&#39;t, for example, tween a numeric value in a progress indicator, like this</li>\n<li>SPAs give you a unified development model — instead of having one language or framework for your HTML and another for your DOM, SPAs are much more cohesive.</li>\n</ul>\n<p>Looking at these two lists you might say &#39;the stuff on the right is nice, but the stuff on the left is non-negotiable&#39;, and you&#39;d be right. But the reality is that this list is very out of date — modern frameworks like Next and Remix and SvelteKit don&#39;t suffer from the problems that afflicted early SPAs, and as we&#39;ve seen, the claim that MPAs are faster than modern SPAs is highly suspect.</p>\n","title":"MPAs vs SPAs","classnames":"","styles":[]};</script>

<script>
	import { spring } from 'svelte/motion';

	export let step;

	const progress = spring();

	$: p = Math.max(0, Math.min(100, (step - 1) * 20));
	$: progress.set(p);
</script>

<div class="grid">
	<div>
		<h2>Multi-Page Apps</h2>
		<ul>
			<li>faster</li>
			<li class:strikethrough={step === 7}>less buggy</li>
			<li class:strikethrough={step === 7}>more accessible</li>
			<li class:strikethrough={step === 7}>work without JS</li>
		</ul>
	</div>

	<span>vs</span>

	<div>
		<h2>Single-Page Apps</h2>
		<ul>
			<li>faster</li>
			<li>state preservation</li>
			<li>continuous transitions</li>
			<li>unified development model</li>
		</ul>
	</div>
</div>

<div class="progress" class:visible={step > 0 && step < 7}>
	{#each [0, 20, 40, 60, 80, 100] as n}
		<span class="bubble" style="left: {n}%" />
	{/each}

	<div class="indicator" style="left: {$progress}%">
		{Math.round($progress)}
	</div>
</div>

<style>
	.progress {
		position: absolute;
		bottom: 5rem;
		left: 10rem;
		width: 80rem;
		height: 0;
		border-bottom: 1px solid #999;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.visible {
		opacity: 1;
	}

	.indicator,
	.bubble {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3em;

		padding-top: 0.2em;
		border-radius: 50%;
		color: var(--green);
		line-height: 1;
	}

	.bubble {
		background: #aaa;
		width: 1em;
		height: 1em;
		left: -0.5em;
		top: -0.5em;
	}

	.indicator {
		background: #eee;
		width: 2em;
		height: 2em;
		left: -1em;
		top: -1em;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 6em 1fr;
		align-items: center;
		height: 100%;
		padding: 0 10em;
	}

	h2 {
		font-size: 4em;
		font-weight: 400;
	}

	li {
		list-style: inside;
		font-family: 'Sue Ellen Francisco';
		line-height: 1.2;
	}

	span {
		font-size: 2em;
	}

	.strikethrough {
		text-decoration: line-through;
		color: #666;
	}
</style>
