<script lang="ts">
	import { page } from "$app/stores";
	import EmptyBox from "$lib/animations/empty_box.svelte";
	import Button from "$lib/components/Button.svelte";
	import Filters from "$lib/components/filters.svelte";
	import Package from "$lib/components/package.svelte";
	import SectionTitle from "$lib/components/section_title.svelte";
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { api } from "$lib/stores/api";
	import { searchResults } from "$lib/stores/packages";
	import type { IResponse } from "$lib/types/package";
	import { t } from "svelte-intl-precompile";
	import { flip } from "svelte/animate";
	import { backOut, circOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import IconSpinner from "~icons/uil/spinner";

	let currentPage = 0;
	let limit = 24;
	let loading = false;

	$: flyAmount = $prefersReducedMotion ? 0 : 20;

	$: filters = {
		sort: null,
		order: "1",
	};

	$: options = {
		query: $page.query.get("query"),
		name: $page.query.get("name"),
		publisher: $page.query.get("publisher"),
		description: $page.query.get("description"),
		tags: $page.query.get("tags"),
	};

	$: {
		$api
			.packages({
				...options,
				sort: filters.sort,
				order: filters.order,
				ensureContains: "true",
				partialMatch: "true",
				limit: limit.toString(),
			})
			.then((e: IResponse) => searchResults.set(e));
	}

	function getMore() {
		loading = true;
		currentPage = currentPage + 1;
		$api
			.packages({
				...options,
				sort: filters.sort,
				order: filters.order,
				ensureContains: "true",
				partialMatch: "true",
				limit: limit.toString(),
				page: currentPage.toString(),
			})
			.then((e: IResponse) => {
				searchResults.update((x) => ({ ...x, Packages: [...x.Packages, ...e.Packages] }));
				loading = false;
			});
	}
</script>

<svelte:head>
	<title>{$t("search.search_results")} | wingetdotrun</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<SectionTitle class="mt-2 mb-4">
	<h2>{$t("search.x_results", { values: { count: $searchResults?.Total ?? 0 } })}</h2>
</SectionTitle>
{#if $searchResults}
	<div class="flex justify-between items-end mb-8">
		<div>
			{#each Object.entries(options).filter((x) => x[0] !== "sort" && x[0] !== "order" && x[1]) as option}
				<div
					class="bg-primary-20 h-10 px-4 rounded-lg leading-none inline-flex items-center text-primary-60 mr-2 last:mr-0"
				>
					<b class="mr-1">{option[0]}:</b>{option[1]}
				</div>
			{/each}
		</div>
		<Filters bind:sort={filters.sort} bind:order={filters.order} />
	</div>
	{#if $searchResults.Total === 0}
		<div
			in:fly={{
				y: flyAmount,
				easing: backOut,
			}}
			class="text-center flex flex-col items-center justify-center my-14"
		>
			<EmptyBox class="text-primary" />
			<h3 class="text-2xl font-semibold text-primary">{$t("search.no_packages_found")}</h3>
			<p class="text-body text-center max-w-96 mt-2.5">
				{$t("search.no_packages_desc")}
			</p>
		</div>
	{:else}
		<div class="packages-grid">
			{#each $searchResults.Packages as pack, i (pack.Id)}
				<div
					in:fly={{
						y: flyAmount,
						delay: $prefersReducedMotion
							? 0
							: (i % limit) * 50 + ($searchResults.Packages.length <= limit ? 0 : 250),
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

	{#if $searchResults.Packages.length < $searchResults.Total}
		<div
			in:fly={{
				y: flyAmount,
				delay: $prefersReducedMotion ? 0 : ($searchResults.Packages.length + 1) * 50,
				easing: backOut,
			}}
			class="flex justify-center my-8"
		>
			{#if loading}
				<Button on:click={getMore} outlined let:iconSize>
					<IconSpinner class="mr-2 animate-spin" width={iconSize} height={iconSize} />
					{$t("ctas.loading")}
				</Button>
			{:else}
				<Button on:click={getMore} outlined>{$t("ctas.load_more_results")}</Button>
			{/if}
		</div>
	{/if}
{/if}
