<script lang="ts">
	import Tooltip from "./tooltip.svelte";
	import IconClipboard from "~icons/uil/clipboard-notes";
	import { mapDownloadsToCommands } from "$lib/utils/downloads";
	import type { IDownload } from "$lib/stores/packages";
	import { onDestroy } from "svelte";

	export let download: IDownload;

	let tooltipText = "Copy to clipboard";
	let timeout: NodeJS.Timeout;

	async function copyToClipboard() {
		await navigator.clipboard.writeText(mapDownloadsToCommands([download]));
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

<Tooltip wrapperClass="flex items-center justify-center" content={tooltipText}>
	<button on:click={copyToClipboard} class="px-1 hover:text-primary focus:outline-none">
		<IconClipboard width={20} height={20} />
	</button>
</Tooltip>
