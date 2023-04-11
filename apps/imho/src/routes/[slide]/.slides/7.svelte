<script context="module">export const metadata = {"text":"<p>This is something I see with things like Lighthouse. It&#39;s an example of Goodhart&#39;s Law — &quot;When a measure becomes a target, it ceases to be a good measure&quot; — we&#39;re incentivised to chase the green 100 at any cost.</p>\n","title":"Lighthouse","classnames":"","styles":[]};</script>

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
