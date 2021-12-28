<script lang="ts">
	import Tooltip from "$lib/components/tooltip.svelte";
	import { downloads } from "$lib/stores/packages";
	import type { IPackage } from "$lib/types/package";
	import { t } from "svelte-intl-precompile";
	import VirtualList from "svelte-tiny-virtual-list";
	import { get } from "svelte/store";
	import IconPen from "~icons/uil/pen";
	import IconPlus from "~icons/uil/plus";
	import Clipboard from "./clipboard.svelte";

	export let pack: IPackage;
	$: selected = $downloads.find((x) => x.package.Id === pack.Id);

	function addToSelected(version: string) {
		if (selected) {
			let newDownloads = get(downloads);
			const index = newDownloads.findIndex((x) => x.package.Id === pack.Id);
			newDownloads[index] = { ...newDownloads[index], version };
			downloads.set(newDownloads);
		} else {
			downloads.update((x) => [...x, { package: pack, version }]);
		}
	}
</script>

<div class="list {$$props.class}">
	<VirtualList
		width="100%"
		height={Math.min(32 * 6, Math.max(2, pack.Versions.length) * 32)}
		itemCount={pack.Versions.length}
		itemSize={32}
	>
		<div
			role="listitem"
			slot="item"
			let:index
			let:style
			class="flex items-center justify-between px-2.5 pr-1.5 py-1 text-body dark:text-body-dark hover:bg-grey-10 dark:hover:bg-dark-600 rounded"
			{style}
		>
			<p class="truncate text-sm">{pack.Versions[index]}</p>
			<div class="flex items-center">
				<!-- TODO: Package manifest -->
				<!-- <Tooltip wrapperClass="flex items-center justify-center" content="Package manifest">
					<button class="px-1 h-full hover:text-primary focus:outline-none">
						<IconPackage width={20} height={20} />
					</button>
				</Tooltip> -->

				<Clipboard download={{ package: pack, version: pack.Versions[index] }} />

				<Tooltip
					wrapperClass="flex items-center justify-center"
					content={selected ? $t("ctas.change_to_this_version") : $t("ctas.add_this_version")}
				>
					<button
						class="px-1 hover:text-primary focus:outline-none"
						on:click={() => addToSelected(pack.Versions[index])}
					>
						{#if selected}
							<IconPen width={20} height={20} />
						{:else}
							<IconPlus width={20} height={20} />
						{/if}
					</button>
				</Tooltip>
			</div>
		</div>
	</VirtualList>
</div>

<style lang="scss">
	.list :global(.virtual-list-wrapper) {
		overflow-x: hidden;
		&::-webkit-scrollbar {
			width: 6px;
			height: 6px;
		}
		&::-webkit-scrollbar-thumb {
			background: #d4d4d4;
			border-radius: 30px;
		}
		&::-webkit-scrollbar-thumb:hover {
			background: #888888;
		}
		&::-webkit-scrollbar-track {
			background: #f5f5f5;
			border-radius: 30px;
		}
	}
</style>
