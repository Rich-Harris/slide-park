<script context="module">export const metadata = {"text":"<p>Back in the 80s people were calling the wisdom of this idea into question. This 1988 paper by Andrew Tanenbaum called &#39;A Critique of the Remote Procedure Call Paradigm&#39; is very much of its time, but it&#39;s still worth reading. Some arguments can&#39;t be serialized correctly — serializing closures is particularly hairy. If the server mutates arguments, that mutation won&#39;t be respected on the client. Network errors and logic errors kind of get smushed together. All these things are easy to deal with if you&#39;re not hiding the implementation details.</p>\n","title":"Critique","classnames":"","styles":[]};</script>

<img
	alt="Abstract of 'A Critique of the Remote Procedure Call Paradigm'"
	src="./images/rpc-1.png"
	style="width: 50rem; transform: translate(-14em, -2em) rotate(-2deg)"
/>

<img
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
