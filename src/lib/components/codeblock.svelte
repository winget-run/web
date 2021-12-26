<script lang="ts">
	import IconClipboard from "~icons/uil/clipboard-notes";

	import { onDestroy } from "svelte";
	import Tooltip from "./tooltip.svelte";

	export let code: string;
	export let multiline = false;

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

<code
	class="relative bg-primary-20 dark:bg-dark-700 rounded-lg p-5 leading-none flex items-center {$$props.class}"
>
	<span class="content flex-1 dark:text-primary" class:multiline>{code}</span>
	<Tooltip content={tooltipText} offset={[0, 4]}>
		<button
			on:click={copyToClipboard}
			class="focus:outline-none hover:text-primary dark:text-primary"
		>
			<IconClipboard width={22} height={22} />
		</button>
	</Tooltip>
</code>

<style lang="scss">
	.content::before {
		content: ">";
		margin-right: 0.5rem;
	}

	.content {
		&.multiline {
			max-lines: 7;
		}
	}
</style>
