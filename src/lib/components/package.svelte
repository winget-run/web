<script lang="ts">
	import Icon from "@iconify/svelte";
	import plus from "@iconify/icons-uil/plus";
	import { downloads } from "$lib/stores/packages";

	import type { IPackage } from "$lib/types/package";
	import type { ISearchFilters } from "$lib/types/search";
	import { searchOpen } from "$lib/stores/search";

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
	class="bg-white rounded-xl h-full w-full border p-5 transition-all {selected
		? 'shadow-card-selected border-primary'
		: 'shadow-card'}"
>
	<div class="flex items-center">
		<img
			class="w-8 h-8"
			src="https://www.google.com/s2/favicons?sz=32&domain_url={pack.Latest.Homepage}"
			alt=""
		/>
		<div class="flex-1 px-2.5">
			<h2 class="font-semibold text-title text-lg line-clamp-1 leading-tight break-all">
				<a
					sveltekit:prefetch
					on:click={() => searchOpen.set(false)}
					href="/pkg/{publisher}/{name.join('.')}"
					class="hover:text-primary"
				>
					{#if highlights}
						{@html pack.Latest.Name.replace(
							new RegExp(`(${highlights?.name ?? highlights?.query})`, "gi"),
							"<span class='bg-highlighter rounded'>$1</span>"
						)}
					{:else}
						{pack.Latest.Name}
					{/if}
				</a>
			</h2>
			<a
				on:click={() => searchOpen.set(false)}
				href="/pkg/{publisher}"
				class="font-medium italic text-sub text-xs line-clamp-1 leading-tight hover:text-primary"
			>
				{pack.Latest.Publisher}
			</a>
		</div>
		<button
			on:click={addOrRemove}
			class="rounded-full w-8 h-8 flex items-center justify-center focus:outline-none transform transition {selected
				? 'bg-primary text-white rotate-45'
				: 'bg-primary-10 text-primary'}"
		>
			<Icon icon={plus} width={24} height={24} />
		</button>
	</div>
	{#if pack.Latest.Description}
		<p class="line-clamp-3 text-body text-sm mt-5">
			{#if highlights}
				{@html pack.Latest.Description.replace(
					new RegExp(`(${highlights?.description ?? highlights?.query})`, "gi"),
					"<span class='bg-highlighter rounded'>$1</span>"
				)}
			{:else}
				{pack.Latest.Description}
			{/if}
		</p>
	{/if}
</article>
