# this space intentionally left blank

Arrow keys to go forward/back

Shift-P to toggle presenter mode

Open in a separate window to have presenter/viewer modes simultaneously

# IMHO

> steps: 4
> class: centered

Hi everyone. Thank you all for being here.

This talk is called In My Humble Opinion, and it's a collection of loosely-connected thoughts about recent trends in front end development. There's a lot of really interesting and innovative stuff going on in the front end world at the moment, and this is as good a time as any to try and take stock of it.

(next)

So. I'm going to share some opinions, of varying levels of spiciness, and talk about how those opinions shape the design of Svelte and SvelteKit. I'm not trying to convince you of anything — you'll probably find lots to disagree with me about — but hopefully this will give you some insight into how we think about our role as toolmakers.

(next)

It takes a certain lack of humility to stand in front of a room full of people and talk for half an hour as if my words matter. Having said that, I'm very aware that some of the ideas I'll be talking about tonight have come from far smarter and more accomplished minds than my own, so take everything I say with a grain of salt — these are Humble Opinions.

(next)

Finally, while I think the Svelte team would mostly agree with the things I'll say tonight, I'm not claiming to speak for them. I'm also not speaking for Vercel, which is a healthily pluralistic company, even if we all dress the same. These are My Humble Opinions.

(TODO note to self: need to include some cool examples of stuff you can do in SvelteKit. `$page.data.component` etc)

```svelte
<script>
	import { scale } from 'svelte/transition';
	import SpiceFall from './components/SpiceFall.svelte';

	export let step;
	export let slide;
</script>

<SpiceFall />
<h1 in:scale={{ start: 0.8 }}>
	<span>&nbsp;</span>
	<span>I</span><span aria-current={step === 3 ? 'true' : undefined}>M</span><span
		aria-current={step === 2 ? 'true' : undefined}>H</span
	><span aria-current={step === 1 ? 'true' : undefined}>O</span>
	<span>&nbsp;</span>
</h1>

<style>
	h1 {
		font-size: 12em;
		font-family: 'Sue Ellen Francisco';
		filter: drop-shadow(0 0 0.2em black) drop-shadow(0 0 0.2em black) drop-shadow(0 0 0.2em black)
			drop-shadow(0 0 0.2em black);
	}

	span {
		transition: all 0.2s;
		display: inline-block;
	}

	span:first-child,
	span:last-child {
		font-size: 1.2em;
	}

	span[aria-current='true'] {
		color: var(--red);
		transform: scale(1.2);
	}
</style>
```

# Your framework is fine (even if you're not using Svelte)

I'm going to start with a fairly non-spicy opinion.

There's too much thought leadership that would have you believe that JavaScript frameworks are the root of all that is wrong with the web...

```svelte
<h1>your framework is fine</h1>
<p>(even if you're not using Svelte)</p>
<p class="spice-level">
	<span>🌶️</span>
	<span class="faded">🌶️</span>
	<span class="faded">🌶️</span>
	<span class="faded">🌶️</span>
</p>
```

## The world if people used better frameworks

...and if only people would make better technology choices, the web would be perfect.

The only problem is that it's absolute horseshit. When you last went on a recipe website and had to fight through a gauntlet of ads and newsletter modals and cookie consent banners and the recipe author's story about her childhood memories of Aunt Beryl's butter pecan cookies are you left thinking 'man, if only they'd used a different abstraction for creating DOM elements'?

Of course not.

```svelte
<enhanced:img alt="Society if..." src="./images/society-if.jpg" />

<style>
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
```

## The web doesn't suck because of frameworks

The web doesn't suck because of JavaScript frameworks, it sucks because of capitalism. On some level we all know this.

And so I've come to believe that as framework authors, the most impactful thing we can do isn't fixating on a kilobyte here or a millisecond there, it's empowering developers — through things like education and diagnostics and sensible defaults — to do the right thing in the face of structural forces that bend the web towards suckiness. The other stuff matters, but probably less than we think.

```svelte
<div>
	<p>the web doesn't suck because of <strong>frameworks</strong></p>
	<p>the web sucks because of <strong>capitalism</strong></p>
</div>

<style>
	p {
		font-size: 4em;
	}

	strong {
		font-weight: inherit;
		color: var(--red);
	}
</style>
```

## But the data!

Of course, every now and then someone will show some data that proves some frameworks deliver better experiences than others. This is a chart that shows how the main JavaScript-centric application frameworks score on Core Web Vitals measurements — you can see that only Astro and SvelteKit outperform the average website.

But we have to be careful how we interpret this. For example, Astro explicitly markets itself as being designed for content sites that don't require much interactivity, so it has a natural advantage over frameworks that are typically used for more demanding workloads.

All of which is to say that as much as we love to talk about technology choices, for the most part you shouldn't feel pressured, by me or anybody else, to switch away from whatever makes you productive at shipping software.

```svelte
<enhanced:img alt="Core Web Vitals report screenshot" src="./images/cwv.png" />

<style>
	img {
		height: 100%;
	}
</style>
```

# 0kb JS is not a goal

Something I've seen more and more of lately is people talking about 'zero kilobytes of JS', as in 'this framework ships 0kb of JS by default'. The implication is that JavaScript is inherently bad, and so a framework that doesn't serve JavaScript is inherently good.

But 0kb of JavaScript is not a goal. The goal is to meet some user need (or if you're cynical, to meet some business need by way of meeting a user need). sometimes, performance is a factor in how effectively you can meet that need — we've all seen the studies showing that every millisecond delay costs Amazon a billion dollars or whatever.

And sometimes you can improve _startup_ performance by reducing the amount of JavaScript on the page. But doing so is always in service of some other objective. Collectively, we're in danger of mistaking the means for the ends. As we'll see later, if you want the best possible performance, JavaScript is actually essential.

```svelte
<h1>0kb JS is not a goal</h1>
<p class="spice-level">
	<span>🌶️</span>
	<span>🌶️</span>
	<span class="faded">🌶️</span>
	<span class="faded">🌶️</span>
</p>
```

## Lighthouse

This is something I see with things like Lighthouse. It's an example of Goodhart's Law — "When a measure becomes a target, it ceases to be a good measure" — we're incentivised to chase the green 100 at any cost.

```svelte
<div class="lighthouse">
	<span>100</span>
	<span>100</span>
	<span>100</span>
	<span>100</span>
</div>

<blockquote>
	“When a measure becomes a target, it ceases to be a good measure” <small>— Goodhart</small>
</blockquote>

<style>
	.lighthouse {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1em;
	}

	.lighthouse span {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3em;
		width: 3em;
		aspect-ratio: 1;
		font-family: monospace;
		color: rgb(36, 205, 111);
		background: rgba(245, 250, 231, 0.1);
		border: 0.1em solid rgb(36, 205, 111);
		border-radius: 50%;
	}

	blockquote {
		font-size: 3em;
		max-width: 50rem;
		text-indent: -0.5em;
	}

	small {
		text-align: right;
		margin-top: 1em;
	}
</style>
```

## Diagnostic tool

But that's not how Lighthouse was originally supposed to be used. It's a diagnostic tool to help us identify and fix issues, it's not a scorecard.

```svelte
<div>
	<p>lighthouse is a <strong>diagnostic tool</strong></p>
	<p>it is not a <strong>scorecard</strong></p>
</div>

<style>
	p {
		font-size: 4em;
	}

	strong {
		font-weight: inherit;
		color: var(--red);
	}
</style>
```

## learn.svelte.dev

This is learn.svelte.dev, our interactive platform for learning Svelte and SvelteKit. It gets a pretty lousy performance score, because in order to work it needs to download and install Node inside your browser along with SvelteKit and Vite, and then it needs to start a development server. It's doing a lot of work, and it does it pretty quickly, but not quickly enough for Lighthouse. We could get a better score by only doing that work when you start interacting with the app, but that would be a pretty serious regression in user experience. I see this pattern over and over again across all different kinds of sites.

A single number simply can't capture that nuance, and you should be wary of people who use those numbers to try and convince you of something.

```svelte
<div class="grid">
	<div class="performance">
		<enhanced:img alt="A Lighthouse score of 61" src="./images/61.png" style="width: 10em" />
	</div>

	<a rel="noreferrer" target="_blank" href="https://learn.svelte.dev">
		<enhanced:img
			alt="Screenshot of learn.svelte.dev"
			src="./images/learn.png"
			style="width: 70em"
		/>
	</a>
</div>

<style>
	.grid {
		display: flex;
	}

	.performance {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
	}
</style>
```

# Most sites should work without JavaScript

This might seem like it directly contradicts the previous claim, but it doesn't. These two things are both true:

- JavaScript is necessary to deliver the best possible user experience
- Sometimes, you can't rely on JavaScript

```svelte
<h1>Most sites should work without JavaScript</h1>
<p class="spice-level">
	<span>🌶️</span>
	<span>🌶️</span>
	<span class="faded">🌶️</span>
	<span class="faded">🌶️</span>
</p>
```

## Everyone has JS?

A website I reference constantly is https://www.kryogenix.org/code/browser/everyonehasjs.html. Those of us who live in New York are very familiar with the experience of loading a page while at a subway station, but losing connectivity before JavaScript loads. It really sucks! I believe that most web apps should be mostly functional with or without JS.

```svelte
<a
	rel="noreferrer"
	target="_blank"
	href="https://www.kryogenix.org/code/browser/everyonehasjs.html"
>
	<enhanced:img
		alt="Screenshot of Everyone Has JS, Right?"
		src="./images/kryogenix.png"
		style="width: 90em"
	/>
</a>
```

## Google Calendar

Take https://calendar.google.com/calendar/ for example. Obviously JavaScript is useful here, but is it essential? Can I really not see my appointments and create new ones without it? The likely answer is 'we could, but the increased development cost isn't worth it'. And I'm not blaming the developers for being lazy or their product managers for having the wrong priorities, but I do think it's a shame that the tooling used to build apps like this one doesn't make it easy enough to build progressively enhanced apps.

```svelte
<a rel="noreferrer" target="_blank" href="https://calendar.google.com/calendar">
	<enhanced:img
		alt="Screenshot of Google Calendar"
		src="./images/calendar.png"
		style="width: 90em"
	/>
</a>
```

## Svelte

Ideally, you should get an app that works without JavaScript 'for free', and that's something that we on the SvelteKit team strive for. For example we server render everything by default, and we spend a lot of time thinking about how to make it as easy or easier to use forms, which work without JavaScript, than to use `fetch`.

```svelte
<enhanced:img alt="Svelte logo" src="./images/svelte-logo.svg" style="width: 40em" />
```

## Kim Kardashian

Another reason this is close to my heart is that in my past career as a journalist I've seen how fragile the web can be as an archival medium when it depends on JavaScript.

This is Kim Karddashian's Instagram page at various points over the last decade. Early on, the site was basically just text and images, and we can look at a snapshot today and it's perfectly preserved. By 2019, you can no longer see the actual images. They're still there, on her account, but because they're rendered with JavaScript they're not part of the archive. Finally, by 2020 the growth hackers got involved and you can no longer see anything on Instagram without logging in.

Maybe you don't care about what Kim Kardashian was wearing in 2017. But so much of modern culture is mediated through ephemeral digital platforms that there's a real possibility that future historians will have an easier time answering the question 'what was it like to live through the space race?' than 'what was it like to live through the AI revolution?'. That's a tragedy.

2016 is an interesting case, because the content is actually there when you first load the page. But when the JS loads, it looks up at the URL bar, says 'hey, this isn't Kim Kardashian's profile', and nukes the entire page. Now we can't go back to 2016 and fix that, and frankly if we could go back to 2016 then we would probably have more urgent priorities, but what we _can_ do is ensure that our tools today are flexible enough to continue working when unexpected things happen.

```svelte
<div class="grid">
	<a
		rel="noreferrer"
		target="_blank"
		href="https://web.archive.org/web/20140706044202/https://www.instagram.com/kimkardashian/"
	>
		<div>
			<enhanced:img
				alt="Kim Kardashian's Instagram account in 2014"
				src="./images/kardashian/2014.png"
			/>
		</div>
		<span>2014</span>
	</a>

	<a
		rel="noreferrer"
		target="_blank"
		href="https://web.archive.org/web/20150704180035/https://instagram.com/kimkardashian/"
	>
		<div>
			<enhanced:img
				alt="Kim Kardashian's Instagram account in 2015"
				src="./images/kardashian/2015.png"
			/>
		</div>
		<span>2015</span>
	</a>

	<a
		rel="noreferrer"
		target="_blank"
		href="https://web.archive.org/web/20160710225649/https://www.instagram.com/kimkardashian/"
	>
		<div>
			<enhanced:img
				alt="Kim Kardashian's Instagram account in 2016"
				src="./images/kardashian/2016.png"
			/>
		</div>
		<span>2016</span>
	</a>

	<a
		rel="noreferrer"
		target="_blank"
		href="https://web.archive.org/web/20180607144953/https://www.instagram.com/kimkardashian/"
	>
		<div>
			<enhanced:img
				alt="Kim Kardashian's Instagram account in 2018"
				src="./images/kardashian/2018.png"
			/>
		</div>
		<span>2018</span>
	</a>

	<a
		rel="noreferrer"
		target="_blank"
		href="https://web.archive.org/web/20190707000543/https://www.instagram.com/kimkardashian/"
	>
		<div>
			<enhanced:img
				alt="Kim Kardashian's Instagram account in 2019"
				src="./images/kardashian/2019.png"
			/>
		</div>
		<span>2019</span>
	</a>

	<a
		rel="noreferrer"
		target="_blank"
		href="https://web.archive.org/web/20221013050249/https://www.instagram.com/kimkardashian/"
	>
		<div>
			<enhanced:img
				alt="Kim Kardashian's Instagram account in 2022"
				src="./images/kardashian/2022.png"
			/>
		</div>
		<span>2022</span>
	</a>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: 1em;
		width: 100%;
		height: 100%;
		padding: 2em 10em;
	}

	figure,
	a {
		display: flex;
		flex-direction: column;
	}

	a div {
		width: 100%;
		height: 100%;
		flex: 1;
	}

	img {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	span {
		text-align: center;
		font-size: 2em;
	}
</style>
```

## IPFS

So this is something SvelteKit actually does out of the box — the client-side router will gracefully figure out the base URL when it starts up.

To demonstrate this, I've deployed a version of our docs to The InterPlanetary File System, which is a peer-to-peer network for sharing files and static websites. The catch is that an IPFS URL begins with a hash that is computed from the contents, so you can't know your app's base URL at build time, but with SvelteKit it doesn't actually matter.

This is the SvelteKit website running on IPFS, and you'll notice that the client-side routing still works, the images still work, the TypeScript toggle still works, the search still works — almost everything works. There are some wrinkles — we can't dynamically generate content because IPFS, and we would have to configure trailing slashes if we wanted deep links to work, otherwise you get a directory listing when you reload the page. But you get the idea — SvelteKit is flexible enough to work in these somewhat hostile environments.

```svelte
<div class="grid">
	<div class="left">
		<enhanced:img alt="IPFS logo" src="./images/ipfs.svg" style="width: 10em" />
	</div>

	<a
		rel="noreferrer"
		target="_blank"
		href="https://ipfs.io/ipfs/QmXUZqcRoSMSkudF5eWbdL7TvjMHaHcmVdQb8yr9id2gq5"
	>
		<enhanced:img
			alt="Screenshot of kit.svelte.dev running on IPFS"
			src="./images/ipfs.png"
			style="width: 60em"
		/>
	</a>
</div>

<style>
	.grid {
		display: flex;
	}

	.left {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
	}
</style>
```

# MPAs are dead

Okay, we're getting a little spicier. This is the first opinion that's probably going to make people yell at me when the recording goes on YouTube: MPAs are dead.

```svelte
<h1>MPAs are dead</h1>
<p class="spice-level">
	<span>🌶️</span>
	<span>🌶️</span>
	<span>🌶️</span>
	<span class="faded">🌶️</span>
</p>
```

## MPAs vs SPAs

> steps: 8

So for those of you who are not captives of web dev Twitter, let me quickly offer some definitions. A multi-page app or MPA is what people used to call a 'website' — it's an app where every page is rendered by the server, and if you navigate between pages the browser will go back to the server, retrieve some fresh HTML, unload the current document, and create a new document from the new HTML.

In contrast a single-page app or SPA doesn't unload the document when you navigate — instead, a client-side router will fetch any code and data it needs to render the new page, and update the document in-place, just like any non-navigation state change.

Advocates of the multi-page app approach have made the following claims:

- MPAs are faster, because you don't need to load JavaScript
- MPAs are more accessible
- MPAs are less buggy
- MPAs work without JavaScript

In return, the single-page app camp says that

- SPAs are faster, because even though you do need to load JavaScript, you were probably going to have to load some anyway, and this way you only have to load your analytics code or whatever on the first page load. Subsequent navigations are certainly going to be faster, because it's much easier to smartly preload data, and you're not recreating a document from scratch on every navigation.
- SPAs allow you to preserve state between navigations, such as the scroll position of a sidebar, or the video that's currently playing
- In an SPA, navigation is just like any other state change, so you can do things like continuous transitions. There's a view transitions API coming to the web platform that helps with this, and it's a wonderful addition, but it only covers stuff you can do with CSS. You couldn't, for example, tween a numeric value in a progress indicator, like this
- SPAs give you a unified development model — instead of having one language or framework for your HTML and another for your DOM, SPAs are much more cohesive.

Looking at these two lists you might say 'the stuff on the right is nice, but the stuff on the left is non-negotiable', and you'd be right. But the reality is that this list is very out of date — modern frameworks like Next and Remix and SvelteKit don't suffer from the problems that afflicted early SPAs, and as we've seen, the claim that MPAs are faster than modern SPAs is highly suspect.

```svelte
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
```

## Transitional apps

I've tried to argue in the past that the distinction is rather unhelpful since modern frameworks use techniques from both sides, and I've taken to calling them 'transitional apps' because we don't need any more moronic acronyms. But this isn't why I'm saying MPAs are dead.

```svelte
<a rel="noreferrer" target="_blank" href="https://www.youtube.com/watch?v=860d8usGC0o">
	<enhanced:img
		alt="'Transitional Apps' on YouTube"
		src="./images/transitional-apps.png"
		style="width: 75em"
	/>
</a>
```

## Astro killed them

I'm saying MPAs are dead because Astro killed them. My Astro friends will be mad at me for saying this but here's the proof — as of last week, Astro's roadmap includes a client-side router that would turn your Astro app into an SPA. In the words of Nate Moore,

"UI Persistence has surfaced as a clear missing piece in the full Astro story. Client-side routing is currently the only way to achieve UI persistence across navigations."

Now they'll be quick to point out that this is opt-in, not the default, but here's what's going to happen — they're going to build this thing and they're going to knock it out of the park. And if it's a simple configuration change, then people will try it even if they don't need UI persistence, and they'll discover that for the very small price of a client-side router, their apps suddenly have a nicer user experience. I would not be surprised if the default was reversed in Astro 3 or 4.

```svelte
<a rel="noreferrer" target="_blank" href="https://github.com/withastro/roadmap/issues/532">
	<enhanced:img
		alt="Astro client-side routing proposal"
		src="./images/astro-killed-mpas.png"
		style="width: 75em"
	/>
</a>
```

## How SvelteKit straddles the divide

> steps: 4

So on the SvelteKit side we use client-side routing by default. Unlike some frameworks we don't use a `<Link>` component, we just intercept clicks on anchor tags. (next) If you want to disable client-side routing for some reason, you can do it on an individual link by adding a `data-sveltekit-reload` attribute, or (next) you can do it for a whole group of links or even the entire document.

One thing people have rightly criticised SPAs for is that they encourage longer sessions, meaning it's more likely that a new version of the app will be deployed while you were using the old one, which can cause client-side routing to fail, because files have moved around. In SvelteKit, if we detect that case we will fall back to a full page navigation, which usually fixes it, but (next) we also make it easy to proactively detect new deployments and disable client-side routing when that happens.

```svelte
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
```

# Explicit DSLs are good

Domain-specific languages get a bad rap, but I like them. DSLs are in contrast to general purpose languages like JavaScript — HTML is a DSL, CSS is a DSL, JSON is a DSL, SQL is a DSL, regular expressions are a DSL, but we don't tend to think of them as such because they're already so pervasive, and people are fine with the DSLs they already know.

```svelte
<h1>explicit DSLs are good</h1>
<p class="spice-level">
	<span>🌶️</span>
	<span>🌶️</span>
	<span class="faded">🌶️</span>
	<span class="faded">🌶️</span>
</p>
```

## Lucy

But you can do some pretty cool things with DSLs. This is Lucy by Matthew Philips and it's one of my favourite examples from recent memory — it's a DSL for describing state machines, and you can clearly see how much more expressive the DSL version is than the general-purpose one. This is cool, and I want to see more stuff like this.

```svelte
<enhanced:img alt="https://lucylang.org screenshot" src="./images/lucy.png" style="width: 75em" />
```

## JS is a bad language for UI

Fundamentally, JavaScript is an event-driven language, which means that we predominantly write code in terms of things that are changing in response to things like user action. But when we build user interfaces we're thinking primarily in terms of state. This is the imperative/declarative split, or whatever you want to call it.

There's an impedance mismatch at the very foundation between the language that we're forced to use, and the task for which we're using it, and things like JSX and hooks and signals and all the other innovations of the front end world over the last decade or so are in some way an attempt to resolve that contradiction, by letting us write code that is 'state-first'.

```svelte
<div>
	<p>javascript is <strong>event-driven</strong></p>
	<p>ui is <strong>state-driven</strong></p>
</div>

<style>
	p {
		font-size: 4em;
	}

	strong {
		font-weight: inherit;
		color: var(--red);
	}
</style>
```

## HTML is clay

HTML, on the other hand, is a really good language for describing UI. There's no temporal aspect to it, it's almost a physical substance, like clay, or at least that's how I think of it. The catch, of course, is that HTML is static, so you can't use it to describe things with rich interactivity. But what if we use HTML as our starting point and create a new DSL?

```svelte
<pre><code>&lt;h1&gt;Hello world&lt;/h1&gt;</code></pre>
```

## Svelte

That's basically what Svelte is — we've augmented HTML with state and control flow, we've augmented CSS with scoped styles, and we've augmented JavaScript with reactivity.

Some people are really put off by this, and that's totally fine. But for people who aren't anti-DSL, we've found that this hits a sweet spot between familiarity and novelty — we're using languages you already know, but we're extending them in useful ways, and like with the Lucy example we're able to express UI much more concisely this way.

```svelte
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
```

# Implicit DSLs are... less good

So I'm pro-DSL but there is a crucial caveat — be honest about it. In the Svelte case we're using .svelte files — when you open a .svelte file you're entering a kind of liminal space where the normal rules of programming are briefly suspended. And again, some people want nothing to do with that, and that's fine, but I think most of us like having a little magic in our lives from time to time.

```svelte
<h1>implicit DSLs are...<br />less good</h1>
<p class="spice-level">
	<span>🌶️</span>
	<span>🌶️</span>
	<span>🌶️</span>
	<span class="faded">🌶️</span>
</p>
```

## Worrying trend

But here's where it starts to get a bit too weird for me — if you start changing the semantics of JavaScript inside JavaScript files, I'm out. This has been a recurring theme recently, across a whole bunch of different projects, and it's a phenomenon that I think deserves a little more critical scrutiny than it's currently getting.

```svelte
<a
	rel="noreferrer"
	target="_blank"
	href="https://twitter.com/Rich_Harris/status/1626014033705852933"
>
	<enhanced:img
		alt="An ill-advised tweet"
		src="./images/tweets/semantics.png"
		style="width: 60em"
	/>
</a>
```

## Story time

Before I give you an example of this, I'm going to tell a little story. Back in 2015, I was working on Rollup, the JavaScript module bundler, and I implemented a heuristic that I thought was very clever — if you weren't using the imports from a given module, Rollup simply wouldn't add it to the module graph. As an escape hatch, if you needed to add the module to the graph _anyway_, because it had certain side-effects, then you could do the import without any specifiers. I was young and naive and this seemed like a really smart optimisation.

Around the same time, the D3 community had browbeaten Mike Bostock into using a module bundler, and he had said 'FINE, I'll rewrite everything in CommonJS and use browserify'. I was horrified by this, because that meant D3 bundles would be horribly bloated and much slower to initialise, so I cold-emailed him and said 'hey, I really think you should use native JavaScript modules for this. The tooling isn't quite there yet but here's a thing I'm working on.'

That was on May 27 2015. On May 29 he started filing issues on the Rollup repo, like this one. Mike is the nicest, most wonderful man, and he is much too kind to put it like this, but what he's saying in this issue is 'JavaScript doesn't work like that, you numpty'.

And he's right. It doesn't. You can't just remove modules from the graph without fundamentally altering the semantics of the code.

```svelte
<a rel="noreferrer" target="_blank" href="https://github.com/rollup/rollup/issues/13">
	<enhanced:img alt="Screenshot of GitHub issue" src="./images/mike.png" style="width: 90em" />
</a>
```

## Remix/Next co-located loaders

> steps: 2

Fast-forward a few years, and some frameworks have decided that ignoring the semantics of JavaScript isn't just okay, it's actually a core selling point of the framework.

I'm going to use Remix as an example, but it's not the only one — prior to version 13 and the introduction of the App Router, Next.js did something very similar, for example.

This is a Remix route. The idea is that your server code, which loads data, can be co-located with your view code. When the client app is built, the `loader` and anything it depends on is 'tree-shaken' away. But this is not tree-shaking, it's made-up, non-standard JavaScript semantics. You might think 'alright, pedant, who made you the JavaScript hall monitor?' Touché.

```svelte
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
```

## Gotchas

But it does have real world impacts — there's actually a whole page in the Remix docs about working around the problems created by this design. And aside from the practical impacts, there's something about the blurring of boundaries between server and client that I think is inherently confusing. I've heard multiple people say that they're often not entirely sure where their code is going to end up running.

```svelte
<a rel="noreferrer" target="_blank" href="https://remix.run/docs/en/main/guides/constraints">
	<enhanced:img alt="Remix documentation" src="./images/remix.png" style="width: 90em" />
</a>
```

## Security

More alarming to me is the possibility that you could end up with server code in your client bundle. Even Michael, who invented Remix, acknowledges that this is a real world problem — you're one sleep-deprived mistake away from accidentally including something sensitive in the JavaScript you serve to users.

```svelte
<a rel="noreferrer" target="_blank" href="https://twitter.com/mjackson/status/1630627605631344640">
	<enhanced:img
		alt="Michael Jackson tweeting about Remix"
		src="./images/tweets/mj.png"
		style="width: 50em"
	/>
</a>
```

## Sourcemaps

Even if you don't make that mistake, you're still prohibited from using sourcemaps to debug your app in production, because the sourcemaps will contain the entire module, including your database queries or whatever.

```svelte
<enhanced:img alt="Remix sourcemaps" src="./images/sourcemaps.png" style="width: 90em" />
```

## SvelteKit

So why am I talking about other frameworks' design decisions? I'm not telling you 'don't use Remix', and I'm not saying the Remix team should make different choices — that's not my business. But oftentimes people will say 'other frameworks do X, should SvelteKit do the same thing?' and then it becomes my business.

The reason for that design choice is that it's convenient to colocate related pieces of code.

```svelte
<enhanced:img alt="Svelte logo" src="./images/svelte-logo.svg" style="width: 40em" />
```

## Ractive

Now you don't need to sell me on the benefits of colocation. I was doing single-file components back in 2014, before Vue or anyone else — I am Mr. Colocation. But colocating code that crosses a server-client boundary in a single file is too much for me. We've prototyped it in Svelte and it's always given us bad vibes.

```svelte
<a rel="noreferrer" target="_blank" href="https://github.com/ractivejs/ractive/issues/366">
	<enhanced:img
		alt="The Ractive issue where single-file components were invented"
		src="./images/ractive.png"
		style="width: 75em"
	/>
</a>
```

## Directory-based routing

So in SvelteKit, we don't just colocate in files, we colocate in directories. In a SvelteKit app, each directory is a route, and each route can contain server code for loading data, and view code that runs on both the server and the client. In this screenshot we're looking at a SvelteKit codebase — this is actually the demo app you get when you do `npm create svelte` — and inside `src/routes` we've got an `/about` route and a `/sverdle` route, which is a Wordle clone that works without JavaScript.

The page's server code goes in a `+page.server.js` file, and any file with that suffix cannot be imported into client-side code — your app will simply fail to build.

Directory-based routing is something we stole from Next.js, and it has a list of other benefits that's too long to get into right now, but I strongly believe that this is the way. One little Easter egg I'll show you is that on the right, in `+page.svelte`, on line 16 we're hovering over `data.guesses` and it's giving us the type and the inline documentation that we wrote on the left on line 9. So we get type safety across the network. This is the sort of thing that's made possible by embracing strong conventions.

```svelte
<enhanced:img
	alt="VSCode showing a SvelteKit project"
	src="./images/vscode.png"
	style="width: 90em"
/>
```

## Screens are wide but files are tall

Far from being a worse developer experience, I find I actually much prefer this — I'll often have my data loading server code open on one side, and the view code that uses it on the other. Screens are wide, but files are tall — so it's just a bad use of real estate to try and stack everything into one file.

```svelte
<div>
	<p>screens are <strong>wide</strong></p>
	<p>but files are <strong>tall</strong></p>
</div>

<style>
	p {
		font-size: 4em;
	}

	strong {
		font-weight: inherit;
		color: var(--red);
	}
</style>
```

## Qwik

Okay, another example of non-standard semantics, this time from the Qwik team. Qwik is a framework that transforms your code in such a way that it can lazily load individual functions when it needs them, and then recreate their lexical scope. It's extremely clever stuff and it's worth paying attention to, but I personally have some reservations about stuff like this.

If you move the `increment` function out of the block of JSX, the app breaks. If it was JavaScript that would be fine, but it's not JavaScript, it's Qwik — it's effectively a DSL for more granular code-splitting. By the same token you have to be careful about what values you reference inside that function, because in order to recreate the lexical scope the framework has to serialize it.

```svelte
<enhanced:img alt="Screenshot of Qwik code" src="./images/qwik.jpg" style="width: 90em" />
```

## Manu

I mentioned this on Twitter a while back and within a few hours Manu from the Qwik team had added a much more helpful error message so that you can diagnose the problem, because they're brilliant and dedicated, but this is really just one example of a more wide-ranging trend that I'm seeing, where in order to successfully work with JavaScript or TypeScript you have to understand some very sophisticated transformations that are happening behind the scenes. There are some other drawbacks to the lazy-loading approach, like you can't conditionally prevent an event default (which is something I do all the time) without opting out of the programming model altogether, but fundamentally it's this mismatch between what the code does and what it looks like it does that I get hung up on.

```svelte
<a
	rel="noreferrer"
	target="_blank"
	href="https://twitter.com/manucorporat/status/1626588991993831426"
>
	<enhanced:img
		alt="Manu tweeting about improved Qwik error messages"
		src="./images/tweets/manu.png"
		style="width: 60em"
	/>
</a>
```

## ChatGPT

For an experiment I asked ChatGPT to refactor the component, and at first it tried to enforce React idioms, but when I explained that we can't use `useState` here, it made the exact same mistake, because it thought it was dealing with JavaScript.

```svelte
<a rel="noreferrer" target="_blank" href="https://sharegpt.com/c/6dD13WF">
	<enhanced:img
		alt="A conversation with ChatGPT"
		src="./images/chatgpt-qwik.png"
		style="width: 80em"
	/>
</a>
```

## Solid

Another example, from Solid — it looks very much like these two components should behave the same way, based on our understanding of JSX and JavaScript, but they're actually very different. If you're familiar with Solid then this makes total sense, but there's no obvious signpost here, so will people with less familiarity be able to successfully maintain this codebase 5 years from now? I don't know. Maybe.

```svelte
<a
	rel="noreferrer"
	target="_blank"
	href="https://twitter.com/devongovett/status/1629545561635389440"
>
	<enhanced:img
		alt="Devon Govett tweeting about signals"
		src="./images/tweets/devon.png"
		style="width: 60em"
	/>
</a>
```

## Your scientists were so preoccupied

I don't mean to pick on these frameworks, because they're all doing really interesting and cool stuff — these are just particularly notable examples. And they would all point out elements of Svelte's programming model that they're not keen on.

Nor am I telling you what to think — I encourage you to play around with all of these frameworks and develop your own opinions. I'm just telling you what _I_ think, and what I think is that your scientists were so preoccupied with whether they could, they didn't stop to think if they should.

```svelte
<enhanced:img alt="Jeff Goldblum" src="./images/goldblum.avif" style="width: 80em" />
```

# Code should run close to the user

This doesn't feel like it should be a spicy take, but it does have some moderately spicy implications: other things being equal, code should run as close to the user as possible. The edge is better than a central server, but on-device is better than the edge.

Now other things are not always equal — sometimes you need to access your database, in which case your code should run close to your database, and sometimes you need access to sensitive information that can't be exposed to the client. But there's a lot of stuff that doesn't fall into that category. For example if I add a product to my shopping cart, I should be able to see that reflected immediately.

```svelte
<h1>code should run<br />close to the user</h1>
<p class="spice-level">
	<span>🌶️</span>
	<span>🌶️</span>
	<span class="faded">🌶️</span>
	<span class="faded">🌶️</span>
</p>
```

## GitHub

Another example that we're all familiar with — when you're writing a comment in GitHub, you can't preview it without sending the comment to the server so that it can render the markdown. Sometimes it's pretty slow! But you can _absolutely_ do markdown rendering and syntax highlighting in the browser — maybe you'd want to lazy load the grammars you're using, but it's a very solvable problem and it would provide a much nicer user experience.

```svelte
<script>
	import github from './github.mp4?url';
</script>

<video src={github} style="width: 80em" autoplay muted loop />
```

## Offline-first

This isn't just about latency, it's also about resilience. I travel by Amtrak a fair bit and every time I do I'm like 'great! three hours of uninterrupted work!'. But I keep running into things like that, because my connection is so flaky, and so most times I'll give up and read a book instead.

And it's not just Amtrak, it's also every time I'm on the subway, or even when I'm walking down the stairs to leave my flat, and my phone switches from wifi to cellular just as I'm trying to look up the details of where I'm supposed to be going. We're pretty bad at building things in an offline-first way.

```svelte
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 30em">
	<title>wifi-strength-alert-outline</title>
	<path
		fill="#eee"
		d="M12 3C7.8 3 3.7 4.4 .4 7C4.3 11.8 8.2 16.7 12 21.5C14.3 18.6 16.7 15.7 19 12.8V9.6L12 18.3L3.3 7.4C5.9 5.8 8.9 5 12 5C15.1 5 18.1 5.9 20.7 7.4L20.3 8H22.9C23.2 7.7 23.4 7.3 23.7 7C20.3 4.4 16.2 3 12 3M21 10V16H23V10M21 18V20H23V18"
	/>
</svg>
```

## React Server Components

All this is why I'm personally a little bit nervous about React Server Components. For those of you who aren't aware, RSC means that your UI is rendered on the server by default, and only components that have a special 'use client' annotation will run in the browser, and have access to things like `useState` and `useEffect`. Server components and client components have different APIs, they can use different hooks, and there are restrictions on how you can combine them, but the upshot is that by default your React app will render entirely on the server, and you'll opt in to client rendering for specific parts of your app.

Now clearly this has some very substantial benefits — this is hugely important work and it frankly blows my mind. But I do worry that we've become so paranoid about serving JavaScript to our users that we're overcorrecting. If the default is for interaction to require a server round-trip, and for client components to be implicitly regarded as something to avoid, then the net result could be slower and less resilient apps. I might just be fear-mongering here, I don't know. Dan Abramov will probably do a withering tweet thread on why I'm wrong. I'm very curious to see how all this looks in a couple of years with the benefit of hindsight.

# We'll regret reinventing RPC

RPC stands for Remote Procedure Call, and it's an idea that's been around since the 70s. Basically what it means is that instead of passing a message to a server and waiting for a response, you call a function on the server instead, and the RPC protocol takes care of the actual message passing. In effect, it allows you to pretend that a distributed system is not distributed — you're just calling functions.

```svelte
<h1>we will regret<br />reinventing RPC</h1>
<p class="spice-level">
	<span>🌶️</span>
	<span>🌶️</span>
	<span>🌶️</span>
	<span class="faded">🌶️</span>
</p>
```

## Critique

Back in the 80s people were calling the wisdom of this idea into question. This 1988 paper by Andrew Tanenbaum called 'A Critique of the Remote Procedure Call Paradigm' is very much of its time, but it's still worth reading. Some arguments can't be serialized correctly — serializing closures is particularly hairy. If the server mutates arguments, that mutation won't be respected on the client. Network errors and logic errors kind of get smushed together. All these things are easy to deal with if you're not hiding the implementation details.

```svelte
<enhanced:img
	alt="Abstract of 'A Critique of the Remote Procedure Call Paradigm'"
	src="./images/rpc-1.png"
	style="width: 50rem; transform: translate(-14em, -2em) rotate(-2deg)"
/>

<enhanced:img
	alt="Abstract of 'A Critique of the Remote Procedure Call Paradigm'"
	src="./images/rpc-2.png"
	style="width: 50rem; transform: translate(14em, 4em) rotate(2deg)"
/>

<style>
	img {
		position: absolute;
		filter: drop-shadow(1em 1em 2em black);
	}
</style>
```

## Server functions

Over the last few months, RPC has a bit of a renaissance in the front end world, except that now we call it 'server functions'. I first saw it in Solid Start. The idea is that you write code like this, and a compiler waves a magic wand and now you can call code on your server as though it were a local function. The ergonomics of this are undeniably very nice. And as far as TypeScript is concerned, it _is_ a local function, so we get type safety — we know that this argument here could be `name` or `qty`, for example.

## Jason Miller

A little while back Jason Miller tweeted something interesting. He said, in effect, that these abstractions are dangerous. I hope he's wrong, but... I think he's right.

```svelte
<a
	rel="noreferrer"
	target="_blank"
	href="https://twitter.com/_developit/status/1625721583095451648"
>
	<enhanced:img
		alt="Jason Miller tweeting about server functions"
		src="./images/tweets/jason.png"
		style="width: 60em"
	/>
</a>
```

## Drop table

This server function looks and feels like an internal implementation detail. It's not though — we've actually made an HTTP endpoint that anybody can call with any data. So TypeScript is telling us that `field` can be `name` or `qty`, but in reality it could be `name; DROP TABLE users`.

When you make an endpoint explicit and you're working with form data, you're aware on some level that the data is untrusted, and so I think you're much less likely to make this sort of error than if it looks like a private function call. Now you might be thinking 'Rich, I would never make that mistake', and I believe you. But look to your left and your right at the people around you — do you trust all them not to make that mistake.

Bear in mind also that if you use sourcemaps for debugging, and they contain the original server code, you're basically handing attackers a diagram of your defenses. This shit makes me very nervous.

```svelte
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
```

## SvelteKit

So people have asked us to add this to SvelteKit, and we've said no. Maybe one day once enough people have fucked around and found out, but not yet. We think that part of our responsibility as toolmakers is, to the extent that we're able, to help protect you and your users against these sorts of issues — so SvelteKit has built-in CSRF protection, it has CSP primitives, and we don't do things like this just because they feel convenient.

```svelte
<enhanced:img alt="Svelte logo" src="./images/svelte-logo.svg" style="width: 40em" />
```

# Build steps are good

I'm rating this low on the Scoville scale, even though it seems like an unpopular opinion, because I think this one is actually pretty obvious.

There's this idea that comes up every now and again in front end that build tools are the devil's work, and we would all be much better off without them.

```svelte
<h1>build steps are good</h1>
<p class="spice-level">
	<span>🌶️</span>
	<span class="faded">🌶️</span>
	<span class="faded">🌶️</span>
	<span class="faded">🌶️</span>
</p>
```

## Deno

This is a recent example that gained some traction from the Deno blog and it's one of the better versions of this argument that I've seen — normally they're a lot... angrier.

```svelte
<a rel="noreferrer" target="_blank" href="https://deno.com/blog/you-dont-need-a-build-step">
	<enhanced:img
		alt="You Don't Need A Build Step blogpost"
		src="./images/deno.png"
		style="width: 75em"
	/>
</a>

<style>
	a {
		width: 100%;
		height: 100%;
	}
</style>
```

## UX over DX

But the thing that often gets missed in discussions about build steps is that they primarily exist for our users' benefit, not ours.

Build steps let us minify code, combine 100 small modules into 10 coarse-grained chunks that load faster, they remove unused code from client-side bundles, they optimise images, they hash assets so that they can be cached immutably, the guard against bugs by typechecking and linting. This is all stuff that directly results in a better user experience.

It's true that build steps also benefit developers by letting us use non-standard dialects and easily import dependencies, and so on. But if you remove build steps, it's user experience that suffers more than developer experience.

```svelte
<h1>build tools are all about user experience</h1>
<ul>
	<li>✅ minifying code</li>
	<li>✅ bundling code</li>
	<li>✅ removing unused code</li>
	<li>✅ optimising images</li>
	<li>✅ hashing assets</li>
	<li>✅ preventing bugs</li>
</ul>
```

## Venn diagram

And yet interestingly if you look at the people who complain most vociferously that our industry prizes DX over UX, and then look at the people who want to get rid of build tooling, there's a striking overlap. It's hard not to conclude that it comes more from a reflexively anti-tooling mindset than a genuine concern for users.

```svelte
<h1>Venn diagram</h1>
<div class="grid">
	<div><p>people who think we over-prioritize DX</p></div>
	<div>
		<svg viewBox="0 0 120 100">
			<g transform="translate(60,50)">
				<circle style="fill: rgba(146, 201, 255, 0.1)" cx="-5" r="45" />
				<circle style="fill: rgba(120, 244, 110, 0.1)" cx="5" r="45" />
			</g>
		</svg>
	</div>
	<div><p>people who want to abolish build tools</p></div>
</div>

<style>
	.grid {
		display: grid;
		width: 100%;
		height: 80%;
		grid-template-columns: 3fr 4fr 3fr;
		padding: 2em;
	}

	.grid > div {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	p {
		font-size: 4em;
		font-family: 'Sue Ellen Francisco';
		max-width: 6em;
		line-height: 1.3;
	}

	circle {
		stroke: white;
	}
</style>
```

## Typechecked docs

Here's another example of a build step being really beneficial. All of the code snippets in SvelteKit's documentation are typechecked against the SvelteKit source code, and that unavoidably takes time — one of these pages might take several seconds to render on this M1 Macbook Pro. So we prerender this content at build time — as well as ensuring that we don't publish incorrect documentation, because if we do, the deployment will fail, it means that everyone visiting this site gets content instantly.

If we did that rendering on demand instead, then even if we had incredibly sophisticated caching, some users would end up having to wait multiple seconds for the page to load, and that's just not acceptable.

So: build steps — you might not need one, but you should probably have one anyway.

# None of this matters

Alright, my final take of the evening is that none of this matters.

```svelte
<h1>none of this matters</h1>
<p class="spice-level">
	<span>🌶️</span>
	<span>🌶️</span>
	<span>🌶️</span>
	<span>🌶️</span>
</p>
```

## AI

I don't think AI is going to take all our jobs, but I do think there's a better than even chance that it will change them beyond all recognition. It might not be long before talking about these sorts of code preferences feel as weird as talking about what implement you like to use to make holes in your punch cards.

So for the few weeks in which any of this is still relevant, let's have interesting debates and share our ideas, but let's not take ourselves too seriously, and let's have fun building stuff however we like to build stuff.

```svelte
<a
	rel="noreferrer"
	target="_blank"
	href="https://twitter.com/AdhamDannaway/status/1637098283418918913"
	style="width: 100%; height: 100%"
>
	<enhanced:img
		alt="The coming AI storm"
		src="./images/ai.jpg"
		style="width: 100%; height: 100%; object-fit: contain"
	/>
</a>
```

## Thank you!

Thank you!

```svelte
<enhanced:img alt="That's all folks" src="./images/thats-all-folks.jpg" style="width: 100%;" />
```
