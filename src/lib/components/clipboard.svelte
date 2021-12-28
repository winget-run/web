<script lang="ts">
	import type { IDownload } from "$lib/stores/packages";
	import { mapDownloadsToCommands } from "$lib/utils/downloads";
	import { onDestroy } from "svelte";
	import { t } from "svelte-intl-precompile";
	import IconClipboard from "~icons/uil/clipboard-notes";
	import Tooltip from "./tooltip.svelte";

	export let download: IDownload;

	$: tooltipText = $t("ctas.copy_to_clipboard");
	let timeout: NodeJS.Timeout;

	async function copyToClipboard() {
		await navigator.clipboard.writeText(mapDownloadsToCommands([download]));
		const oldText = tooltipText;

		tooltipText = $t("ctas.copied_to_clipboard");

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
