<script lang="ts">
	import { prefersReducedMotion } from "$lib/stores/a11y";

	import { downloads, IDownload } from "$lib/stores/packages";
	import clsx from "clsx";
	import { t } from "svelte-intl-precompile";
	import { get } from "svelte/store";
	import IconPlus from "~icons/uil/plus";
	import Dropdown from "./dropdown.svelte";
	import PackageIcon from "./package_icon.svelte";

	export let download: IDownload;

	function remove() {
		downloads.update((x) => x.filter((y) => y.package.Id !== download.package.Id));
	}

	function changeVersion(version: string) {
		let newDownloads = get(downloads);
		const index = newDownloads.findIndex((x) => x.package.Id === download.package.Id);
		newDownloads[index] = { ...newDownloads[index], version };
		downloads.set(newDownloads);
	}

	$: [publisher, ...name] = download.package.Id.split(".");

	let items = [
		{
			value: "latest",
			label: $t("package.latest_version"),
		},
		...download.package.Versions.map((x) => ({
			value: x,
			label: x,
		})),
	];
</script>

<article
	class={clsx(
		"bg-white dark:bg-dark-800 rounded-xl h-auto w-full border p-5 shadow-card-selected border-primary",
		$prefersReducedMotion ? "transition-none" : "transition-all"
	)}
>
	<div class="flex items-center">
		<PackageIcon
			logo={download.package.Logo}
			homepage={download.package.Latest.Homepage}
			size={32}
		/>
		<div class="flex-1 px-2.5">
			<h2 class="font-semibold text-title dark:text-white text-lg line-clamp-1 leading-tight">
				<a sveltekit:prefetch href="/pkg/{publisher}/{name.join('.')}" class="hover:text-primary">
					{download.package.Latest.Name}
				</a>
			</h2>
			<p class="font-medium italic text-sub dark:text-sub-dark text-xs line-clamp-1 leading-tight">
				<a
					href="/pkg/{publisher}"
					class="font-medium italic text-sub dark:text-sub-dark text-xs line-clamp-1 leading-tight hover:text-primary"
					>{download.package.Latest.Publisher}</a
				>
			</p>
		</div>
		<button
			on:click={remove}
			class="rounded-full w-8 h-8 flex items-center justify-center focus:outline-none transform transition bg-primary text-white rotate-45"
		>
			<IconPlus width={24} height={24} />
		</button>
	</div>
	<Dropdown
		class="mt-5 w-full"
		grey
		{items}
		selected={items.findIndex((x) => x.value === download.version)}
		on:change={({ detail }) => changeVersion(detail)}
	/>
</article>
