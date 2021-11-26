<script lang="ts" context="module">
	import Wingetdotrun from "$lib/api/wingetdotrun";
	import Package from "$lib/components/package.svelte";
	import SectionTitle from "$lib/components/section_title.svelte";
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { updatedPackages } from "$lib/stores/packages";
	import type { IResponse } from "$lib/types/package";
	import type { Load } from "@sveltejs/kit";
	import { flip } from "svelte/animate";
	import { backOut, circOut } from "svelte/easing";
	import { fly } from "svelte/transition";

	let limit = 24;
	export const load: Load = async ({ fetch }) => {
		const api = new Wingetdotrun();

		await api
			.packages({
				sort: "UpdatedAt",
				order: "-1",
				page: "0",
				take: limit.toString(),
			})
			.then(updatedPackages.set);
		const featured = await api.featured();

		return {
			props: {
				featured,
			},
		};
	};
</script>

<script lang="ts">
	let page = 0;
	export let featured: IResponse;

	$: flyAmount = $prefersReducedMotion ? 0 : 20;

	function getMore() {
		page = page + 1;
		fetch(`https://api.winget.run/v2/packages?sort=UpdatedAt&order=-1&page=${page}&take=${limit}`)
			.then((e) => e.json())
			.then((e: IResponse) =>
				updatedPackages.update((x) => ({ ...x, Packages: [...x.Packages, ...e.Packages] }))
			);
	}
</script>

<SectionTitle class="mt-2 mb-4"><h2>Featured Packages</h2></SectionTitle>
<div class="flex flex-wrap -mx-4 justify-start">
	{#if featured}
		{#each featured.Packages as pack, i (pack.Id)}
			<div
				in:fly={{
					y: flyAmount,
					delay: $prefersReducedMotion
						? 0
						: (i % limit) * 50 + ($updatedPackages.Packages.length <= limit ? 0 : 250),
					easing: backOut,
				}}
				animate:flip={{ duration: 250, easing: circOut }}
				class="px-4 mb-8 min-w-80 max-w-sm w-full"
			>
				<Package {pack} />
			</div>
		{/each}
	{/if}
</div>
<SectionTitle class="mt-2 mb-4"><h2>Recently Updated Packages</h2></SectionTitle>
<div class="flex flex-wrap -mx-4 justify-start">
	{#if $updatedPackages}
		{#each $updatedPackages.Packages as pack, i (pack.Id)}
			<div
				in:fly={{
					y: flyAmount,
					delay: $prefersReducedMotion
						? 0
						: (i % limit) * 50 + ($updatedPackages.Packages.length <= limit ? 0 : 250),
					easing: backOut,
				}}
				animate:flip={{ duration: 250, easing: circOut }}
				class="px-4 mb-8 min-w-80 max-w-sm w-full"
			>
				<Package {pack} />
			</div>
		{/each}
	{/if}
</div>
<button on:click={getMore}> get more bruh </button>
