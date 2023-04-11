<script context="module">export const metadata = {"text":"<p>So this is something SvelteKit actually does out of the box — the client-side router will gracefully figure out the base URL when it starts up.</p>\n<p>To demonstrate this, I&#39;ve deployed a version of our docs to The InterPlanetary File System, which is a peer-to-peer network for sharing files and static websites. The catch is that an IPFS URL begins with a hash that is computed from the contents, so you can&#39;t know your app&#39;s base URL at build time, but with SvelteKit it doesn&#39;t actually matter.</p>\n<p>This is the SvelteKit website running on IPFS, and you&#39;ll notice that the client-side routing still works, the images still work, the TypeScript toggle still works, the search still works — almost everything works. There are some wrinkles — we can&#39;t dynamically generate content because IPFS, and we would have to configure trailing slashes if we wanted deep links to work, otherwise you get a directory listing when you reload the page. But you get the idea — SvelteKit is flexible enough to work in these somewhat hostile environments.</p>\n","title":"IPFS","classnames":"","styles":[]};</script>

<div class="grid">
	<div class="left">
		<img alt="IPFS logo" src="./images/ipfs.svg" style="width: 10em" />
	</div>

	<a
		rel="noreferrer"
		target="_blank"
		href="https://ipfs.io/ipfs/QmXUZqcRoSMSkudF5eWbdL7TvjMHaHcmVdQb8yr9id2gq5"
	>
		<img
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
