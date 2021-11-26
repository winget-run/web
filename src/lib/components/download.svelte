<script lang="ts">
	import { downloads, IDownload } from "$lib/stores/packages";
	import plus from "@iconify/icons-uil/plus";
	import Icon from "@iconify/svelte";
	import Dropdown from "./dropdown.svelte";

	export let download: IDownload;

	function remove() {
		downloads.update((x) => x.filter((y) => y.package.Id !== download.package.Id));
	}

	let items = [
		{
			value: "latest",
			label: "Latest Version",
		},
		...download.package.Versions.map((x) => ({
			value: x,
			label: x,
		})),
	];
</script>

<article
	class="bg-white rounded-xl h-auto w-full border p-5 transition shadow-card-selected border-primary"
>
	<div class="flex items-center">
		<img
			class="w-8 h-8"
			src="https://www.google.com/s2/favicons?sz=32&domain_url={download.package.Latest.Homepage}"
			alt=""
		/>
		<div class="flex-1 px-2.5">
			<h2 class="font-semibold text-title text-lg line-clamp-1 leading-tight">
				{download.package.Latest.Name}
			</h2>
			<p class="font-medium italic text-sub text-xs line-clamp-1 leading-tight">
				{download.package.Latest.Publisher}
			</p>
		</div>
		<button
			on:click={remove}
			class="rounded-full w-8 h-8 flex items-center justify-center focus:outline-none transform transition bg-primary text-white rotate-45"
		>
			<Icon icon={plus} width={24} height={24} />
		</button>
	</div>
	<Dropdown class="mt-5 w-full" {items} selected={0} />
</article>
