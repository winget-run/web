<script lang="ts">
	import clipboardNotes from "@iconify/icons-uil/clipboard-notes";

	import Icon from "@iconify/svelte";
	import { onDestroy } from "svelte";
	import Tooltip from "./tooltip.svelte";

	export let code: string;
	let tooltipText = "Copy to clipboard";

	let timeout: NodeJS.Timeout;

	async function copyToClipboard() {
		await navigator.clipboard.writeText(code);
		const oldText = tooltipText;

		tooltipText = "Copied to clipboard!";

		timeout = setTimeout(() => {
			tooltipText = oldText;
		}, 2000);
	}

	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

<code class="relative bg-grey-10 rounded-lg p-5 leading-none flex items-center {$$props.class}">
	<span class="truncate flex-1">{code}</span>
	<Tooltip content={tooltipText} offset={[0, 4]}>
		<button on:click={copyToClipboard} class="focus:outline-none hover:text-primary">
			<Icon icon={clipboardNotes} width={22} height={22} />
		</button>
	</Tooltip>
</code>

<style>
	code::before {
		content: ">";
		margin-right: 0.5rem;
	}
</style>
