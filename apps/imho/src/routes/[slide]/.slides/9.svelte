<script context="module">export const metadata = {"text":"<p>This is learn.svelte.dev, our interactive platform for learning Svelte and SvelteKit. It gets a pretty lousy performance score, because in order to work it needs to download and install Node inside your browser along with SvelteKit and Vite, and then it needs to start a development server. It&#39;s doing a lot of work, and it does it pretty quickly, but not quickly enough for Lighthouse. We could get a better score by only doing that work when you start interacting with the app, but that would be a pretty serious regression in user experience. I see this pattern over and over again across all different kinds of sites.</p>\n<p>A single number simply can&#39;t capture that nuance, and you should be wary of people who use those numbers to try and convince you of something.</p>\n","title":"learn.svelte.dev","classnames":"","styles":[]};</script>

<div class="grid">
	<div class="performance">
		<img alt="A Lighthouse score of 61" src="./images/61.png" style="width: 10em" />
	</div>

	<a rel="noreferrer" target="_blank" href="https://learn.svelte.dev">
		<img alt="Screenshot of learn.svelte.dev" src="./images/learn.png" style="width: 70em" />
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
