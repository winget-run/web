<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	let limit = 24;
	export const load: Load = async ({ page }) => {
		const publisher = page.params["publisher"];

		const api = new Wingetdotrun();
		const packages = await api.packages({ publisher });

		return {
			props: {
				publisher,
				packages,
			},
		};
	};
</script>

<script lang="ts">
	import type { IResponse } from "$lib/types/package";
	import Package from "$lib/components/package.svelte";
	import SectionTitle from "$lib/components/section_title.svelte";
	import { fly } from "svelte/transition";
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { backOut, circOut } from "svelte/easing";
	import { flip } from "svelte/animate";
	import Wingetdotrun from "$lib/api/wingetdotrun";

	export let publisher: string;
	export let packages: IResponse;

	$: flyAmount = $prefersReducedMotion ? 0 : 20;
</script>

<SectionTitle class="mt-2 mb-4"><h2>Packages by {publisher}</h2></SectionTitle>
<div class="flex flex-wrap -mx-4 justify-start">
	{#each packages.Packages as pack, i (pack.Id)}
		<div
			in:fly={{
				y: flyAmount,
				delay: $prefersReducedMotion
					? 0
					: (i % limit) * 50 + (packages.Packages.length <= limit ? 0 : 250),
				easing: backOut,
			}}
			animate:flip={{ duration: 250, easing: circOut }}
			class="px-4 mb-8 min-w-80 max-w-sm w-full"
		>
			<Package {pack} />
		</div>
	{/each}
</div>
