<script lang="ts">
	import Tooltip from "$lib/components/tooltip.svelte";
	import { downloads } from "$lib/stores/packages";
	import type { IPackage } from "$lib/types/package";
	import clipboardNotes from "@iconify/icons-uil/clipboard-notes";
	import packageIcon from "@iconify/icons-uil/package";
	import plus from "@iconify/icons-uil/plus";
	import pen from "@iconify/icons-uil/pen";
	import Icon from "@iconify/svelte";
	import VirtualList from "svelte-tiny-virtual-list";
	import { get } from "svelte/store";

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
		height={Math.min(32 * 6, pack.Versions.length * 32)}
		itemCount={pack.Versions.length}
		itemSize={32}
	>
		<div
			role="listitem"
			slot="item"
			let:index
			let:style
			class="flex items-center justify-between px-2.5 pr-1.5 py-1 text-body hover:bg-grey-10 rounded"
			{style}
		>
			<p class="truncate text-sm">{pack.Versions[index]}</p>
			<div class="flex items-center">
				<Tooltip content="Package manifest">
					<button class="px-1 hover:text-primary">
						<Icon icon={packageIcon} width={20} height={20} />
					</button>
				</Tooltip>

				<Tooltip content="Copy to clipboard">
					<button class="px-1 hover:text-primary">
						<Icon icon={clipboardNotes} width={20} height={20} />
					</button>
				</Tooltip>

				<Tooltip
					content={selected
						? "Change version in selected packages"
						: "Add version to selected packages"}
				>
					<button
						class="px-1 hover:text-primary"
						on:click={() => addToSelected(pack.Versions[index])}
					>
						<Icon icon={selected ? pen : plus} width={20} height={20} />
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
