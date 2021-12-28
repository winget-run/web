<script lang="ts">
	import IconPlus from "~icons/uil/plus";
	import IconPackage from "~icons/uil/package";
	import { downloads } from "$lib/stores/packages";

	import type { IPackage } from "$lib/types/package";
	import type { ISearchFilters } from "$lib/types/search";
	import { searchOpen } from "$lib/stores/search";
	import clsx from "clsx";

	export let pack: IPackage;
	export let highlights: ISearchFilters = null;

	$: selected = $downloads.find((x) => x.package.Id === pack.Id);
	$: [publisher, ...name] = pack.Id.split(".");

	function addOrRemove() {
		if (selected) {
			downloads.update((x) => x.filter((y) => y.package.Id !== selected.package.Id));
		} else {
			downloads.update((x) => [...x, { package: pack, version: "latest" }]);
		}
	}
</script>

<article
	class={clsx(
		"bg-white dark:bg-dark-800 rounded-xl h-full w-full border p-5 transition-all",
		selected ? "shadow-card-selected border-primary" : "shadow-card border-transparent"
	)}
>
	<div class="flex items-center">
		{#if pack.Latest.Homepage}
			<img
				class="w-8 h-8"
				src={pack.Latest.Homepage
					? `https://www.google.com/s2/favicons?sz=32&domain_url=${pack.Latest.Homepage}`
					: "/favicon.ico"}
				alt=""
			/>
		{:else}
			<IconPackage class="text-primary" width="2rem" height="2rem" />
		{/if}
		<div class="flex-1 px-2.5">
			<h2
				class="font-semibold text-title dark:text-white text-lg line-clamp-1 leading-tight break-all"
			>
				<a
					sveltekit:prefetch
					on:click={() => searchOpen.set(false)}
					href="/pkg/{publisher}/{name.join('.')}"
					class="hover:text-primary"
				>
					{#if highlights}
						{@html pack.Latest.Name.replace(
							new RegExp(`(${highlights?.name ?? highlights?.query})`, "gi"),
							"<span class='bg-highlighter dark:bg-highlighter-dark rounded'>$1</span>"
						)}
					{:else}
						{pack.Latest.Name}
					{/if}
				</a>
			</h2>
			<a
				on:click={() => searchOpen.set(false)}
				href="/pkg/{publisher}"
				class="font-medium italic text-sub dark:text-sub-dark text-xs line-clamp-1 leading-tight hover:text-primary"
			>
				{pack.Latest.Publisher}
			</a>
		</div>
		<button
			on:click={addOrRemove}
			class={clsx(
				"rounded-full w-8 h-8 flex items-center justify-center focus:outline-none transform transition bg-primary",
				selected ? "text-white rotate-45" : "bg-opacity-10 text-primary"
			)}
		>
			<IconPlus width={24} height={24} />
		</button>
	</div>
	{#if pack.Latest.Description}
		<p class="line-clamp-3 text-body dark:text-body-dark text-sm mt-5">
			{#if highlights}
				{@html pack.Latest.Description.replace(
					new RegExp(`(${highlights?.description ?? highlights?.query})`, "gi"),
					"<span class='bg-highlighter dark:bg-highlighter-dark rounded'>$1</span>"
				)}
			{:else}
				{pack.Latest.Description}
			{/if}
		</p>
	{/if}
</article>
