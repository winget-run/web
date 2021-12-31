<script lang="ts" context="module">
	import Wingetdotrun from "$lib/api/wingetdotrun";
	import Button from "$lib/components/Button.svelte";
	import Package from "$lib/components/package.svelte";
	import SectionTitle from "$lib/components/section_title.svelte";
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { api } from "$lib/stores/api";
	import { updatedPackages } from "$lib/stores/packages";
	import type { IResponse } from "$lib/types/package";
	import IconSpinner from "~icons/uil/spinner";
	import type { Load } from "@sveltejs/kit";
	import { flip } from "svelte/animate";
	import { backOut, circOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import konamicode from "$lib/actions/use_konamicode";
	import { goto } from "$app/navigation";
	import IconStar from "~icons/uil/star";
	import IconClock from "~icons/uil/clock";
	import { t } from "svelte-intl-precompile";

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
	let loading = false;

	export let featured: IResponse;

	$: flyAmount = $prefersReducedMotion ? 0 : 20;

	function getMore() {
		loading = true;
		page = page + 1;
		$api
			.packages({
				sort: "UpdatedAt",
				order: "-1",
				page: page.toString(),
				take: limit.toString(),
			})
			.then((e: IResponse) => {
				loading = false;
				updatedPackages.update((x) => ({ ...x, Packages: [...x.Packages, ...e.Packages] }));
			});
	}
</script>

<svelte:head>
	<title>{$t("home.title")}</title>
	<meta name="description" content={$t("home.desc")} />
	<meta name="twitter:description" content={$t("home.desc")} />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			"url": "https://winget.run/",
			"potentialAction": {
				"@type": "SearchAction",
				"target": {
					"@type": "EntryPoint",
					"urlTemplate": "https://winget.run/search?query={search_term_string}&utm_source=schemaSearch"
				},
				"query-input": "required name=search_term_string"
			}
		}
	</script>
</svelte:head>

<svelte:body use:konamicode={() => goto("/search?query=touch+grass")} />

{#if featured}
	<SectionTitle icon={IconStar} class="my-6">
		<h2>{$t("home.featured_packages")}</h2>
	</SectionTitle>
	<div class="packages-grid mb-14">
		{#each featured.Packages as pack, i (pack.Id)}
			<div
				in:fly={{
					y: flyAmount,
					delay: $prefersReducedMotion ? 0 : i * 50,
					easing: backOut,
				}}
				animate:flip={{ duration: 250, easing: circOut }}
				class="max-w-md"
			>
				<Package {pack} />
			</div>
		{/each}
	</div>
{/if}
<SectionTitle icon={IconClock} class="my-6">
	<h2>{$t("home.recently_updated_packages")}</h2>
</SectionTitle>
{#if $updatedPackages}
	<div class="packages-grid">
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
				class="max-w-md"
			>
				<Package {pack} />
			</div>
		{/each}
	</div>
	{#if $updatedPackages.Packages.length < $updatedPackages.Total}
		<div
			in:fly={{
				y: flyAmount,
				delay: $prefersReducedMotion ? 0 : ($updatedPackages.Packages.length + 1) * 50,
				easing: backOut,
			}}
			class="flex justify-center my-8"
		>
			{#if loading}
				<Button disabled outlined let:iconSize>
					<IconSpinner class="mr-2 animate-spin" width={iconSize} height={iconSize} />
					{$t("ctas.loading")}
				</Button>
			{:else}
				<Button on:click={getMore} outlined let:iconSize>
					{$t("ctas.load_more_packages")}
				</Button>
			{/if}
		</div>
	{/if}
{/if}
