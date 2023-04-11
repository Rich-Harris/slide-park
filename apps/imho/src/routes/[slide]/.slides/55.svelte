<script context="module">export const metadata = {"text":"<p>And yet interestingly if you look at the people who complain most vociferously that our industry prizes DX over UX, and then look at the people who want to get rid of build tooling, there&#39;s a striking overlap. It&#39;s hard not to conclude that it comes more from a reflexively anti-tooling mindset than a genuine concern for users.</p>\n","title":"Venn diagram","classnames":"","styles":[]};</script>

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
