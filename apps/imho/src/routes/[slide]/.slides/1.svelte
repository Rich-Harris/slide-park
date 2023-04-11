<script context="module">export const metadata = {"text":"<p>Hi everyone. Thank you all for being here.</p>\n<p>This talk is called In My Humble Opinion, and it&#39;s a collection of loosely-connected thoughts about recent trends in front end development. There&#39;s a lot of really interesting and innovative stuff going on in the front end world at the moment, and this is as good a time as any to try and take stock of it.</p>\n<p>(next)</p>\n<p>So. I&#39;m going to share some opinions, of varying levels of spiciness, and talk about how those opinions shape the design of Svelte and SvelteKit. I&#39;m not trying to convince you of anything — you&#39;ll probably find lots to disagree with me about — but hopefully this will give you some insight into how we think about our role as toolmakers.</p>\n<p>(next)</p>\n<p>It takes a certain lack of humility to stand in front of a room full of people and talk for half an hour as if my words matter. Having said that, I&#39;m very aware that some of the ideas I&#39;ll be talking about tonight have come from far smarter and more accomplished minds than my own, so take everything I say with a grain of salt — these are Humble Opinions.</p>\n<p>(next)</p>\n<p>Finally, while I think the Svelte team would mostly agree with the things I&#39;ll say tonight, I&#39;m not claiming to speak for them. I&#39;m also not speaking for Vercel, which is a healthily pluralistic company, even if we all dress the same. These are My Humble Opinions.</p>\n<p>(TODO note to self: need to include some cool examples of stuff you can do in SvelteKit. <code>$page.data.component</code> etc)</p>\n","title":"IMHO","classnames":"centered","styles":[]};</script>

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
		filter: drop-shadow(0 0 0.2em black) drop-shadow(0 0 0.2em black) drop-shadow(0 0 0.2em black) drop-shadow(
				0 0 0.2em black
			);
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
