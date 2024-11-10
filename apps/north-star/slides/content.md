# this space intentionally left blank

Arrow keys to go forward/back

Shift-P to toggle presenter mode

Open in a separate window to have presenter/viewer modes simultaneously

```svelte

```

# Intro

I was a real space nerd as a child. I had an encyclopedic knowledge of the cosmos; I could tell you the orbital periods of the planets in our system; the chemical composition of Jupiter's atmosphere; the distances to our nearest stars. I dreamt of travelling to strange new worlds and meeting the strange beings that lived there. I loved coming to places like this.

I have fond memories from childhood of going, with my father, into the garden behind our house on crisp cloudless nights and learning how to read the sky. He taught me the names of the stars and the constellations. He taught me that the things that seem most fixed are not fixed, but that through careful observation you can begin to predict their movements. And he taught me how to find the North Star.

If you were to draw an imaginary line from the south pole to the north pole and keep going, you would eventually pass right by this star, Polaris. It is the fixed point about which the heavens turn. On a clear night, if you can find this constellation — the Big Dipper — then you can extend this line a little further to find the North Star. Ancient mariners used Polaris to cross the oceans; in the early United States, escaped slaves followed it to freedom.

Today we don't tend to rely on celestial navigation. But I've been thinking a lot lately about how this concept, of being able to orient ourselves in an otherwise uncertain environment, applies to other areas of our lives.

```svelte
TODO
```

# Hello!

> steps: 2

My name is Rich Harris and like many of you I write software for a living. More specifically I work on a user interface framework called Svelte. I started working on it eight years and three days ago <commit?>. Sometimes it feels surprising to me that we’re still relevant enough that I still get invited to conferences like this one, but I think that’s because we’ve evolved quite substantially in that time.

```svelte
<script>
	import { blur } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let { step } = $props();
</script>

<header transition:blur={{ duration: 2500, easing: quintOut, amount: 50 }}>
	<h1>North Star</h1>
	<p>@rich-harris.dev / 18 November 2024</p>
</header>

{#if step === 2}
	<enhanced:img
		class="initial-commit"
		src="./images/initial-commit.png"
		alt="Screenshot of Svelte's initial commit"
		style:mix-blend-mode="screen"
		style:filter="grayscale(1) brightness(1.5)"
	/>
{/if}
```

# Evolution

## Svelte 1

Version 1 of Svelte was more of an experiment than anything. TK description (compiler-centric, small bundle size). (make sure to explain what svelte is!) export default {...} might look familiar if you’re used to Vue, there’s a reason for that

## Svelte 2

Version 2 TK dropped double curlies, etc

## Svelte 3

Version 3 was when we started to go mainstream. TK hooks-inspired, reactivity-in-the-language, rethinking reactivity

## SvelteKit 1

SvelteKit version 1 — TK covid tracker anecdote

## Svelte 4

Svelte 4 — TK modernise

During this time we’ve consistently led developer satisfaction surveys. TK lots of caveats, won’t last forever, but it’s pretty cool. Influenced everyone else — Vue <script setup> etc, angular templates, people copied our tutorial, we were the first major FW to go all-in on vite, etc. even React is becoming a compiler-based framework

## Svelte 5

Last month, we released Svelte 5. On one level it’s very much a continuation of Svelte 3 and 4 — it’s a backwards compatible release which you can drop into an existing project with minimal disruption — but on another it’s the most radical change the project has undergone in its eight years.

Over the last year and a half we’ve been in the process of rewriting the entire framework from the ground up.

# TODO

- write the dang talk
  - evolving narrative
  - tenets
  - software is broken
- background
  - twinkling stars
  - other DSOs
  - constellations
  - shooting stars
  - brightness control?
  - disable zoom
- slide park
  make reading speed configurable
  show a countdown timer
