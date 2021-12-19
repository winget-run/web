<script lang="ts">
	import { goto } from "$app/navigation";

	import EmptyBox from "$lib/animations/empty_box.svelte";
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { searchOpen, searchResults } from "$lib/stores/search";
	import { clickoutside } from "$lib/utils/actions";
	import { parseTags } from "$lib/utils/helpers";
	import angleDown from "@iconify/icons-uil/angle-down";
	import arrowRight from "@iconify/icons-uil/arrow-right";
	import search from "@iconify/icons-uil/search";
	import Icon from "@iconify/svelte";
	import { flip } from "svelte/animate";
	import { backOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import Package from "./package.svelte";
	import SearchOptions from "./search_options.svelte";

	let input: HTMLInputElement;
	let content: HTMLDivElement;
	let value: string;

	let moreOptionsOpen = false;

	let timeout = undefined;
	let calling = false;

	function debounce(fn: Function) {
		if (calling) return;
		calling = true;
		timeout = setTimeout(() => {
			fn();
			calling = false;
		}, 400);
	}

	$: contentHTML = value
		? value.replace(
				/(name|publisher|description|tags):/g,
				"<span class='bg-highlighter rounded'>$1:</span>"
		  )
		: "";

	$: {
		if (value?.length > 2) {
			debounce(() => performSearch(value));
		} else {
			searchResults.set(null);
		}
	}

	$: {
		if ($searchOpen) input.focus();
	}

	function handleInputScroll(
		e: UIEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		content.scrollLeft = e.currentTarget.scrollLeft;
	}

	function performSearch(query: string) {
		const { order, ...tags } = parseTags(query);

		const params = new URLSearchParams({
			ensureContains: "true",
			partialMatch: "true",
			take: "3",
			...tags,
		});

		fetch(`https://api.winget.run/v2/packages?${params.toString()}`).then(async (e) => {
			if (e.ok) {
				searchResults.set(await e.json());
			}
		});
	}

	function viewAllResults() {
		const { order, sort, ...tags } = parseTags(value);
		const params = new URLSearchParams({
			...tags,
		});
		searchOpen.set(false);
		goto(`/search?${params.toString()}`);
	}

	$: flyAmount = $prefersReducedMotion ? 0 : 10;
</script>

<div
	use:clickoutside={() => searchOpen.set(false)}
	class="w-full h-11 max-w-xl flex items-center px-5 bg-white rounded-lg z-40 relative"
>
	<Icon icon={search} width={24} height={24} class="text-primary mr-3" />
	<div class="flex-1 relative">
		<div
			class="w-full h-full absolute left-0 top-0 text-transparent overflow-hidden whitespace-nowrap | font-medium"
			tabindex={-1}
			bind:this={content}
		>
			{@html contentHTML}
		</div>
		<form on:submit|preventDefault={viewAllResults}>
			<input
				bind:this={input}
				class="w-full h-full text-title focus:outline-none relative bg-transparent | font-medium"
				bind:value
				on:focus={() => searchOpen.set(true)}
				on:blur={() => !value && searchOpen.set(false)}
				on:scroll={handleInputScroll}
				type="search"
				placeholder="Search 2700+ packages"
				spellcheck="false"
				autocomplete="false"
			/>
		</form>
		{#if !$searchOpen}
			<kbd
				class="text-xs text-sub bg-white font-semibold leading-none rounded px-1.5 py-1 border border-b-2 border-sub | absolute right-0 top-1/2 transform -translate-y-1/2"
			>
				CTRL + K
			</kbd>
		{/if}
	</div>

	{#if $searchOpen}
		<div class="absolute max-h-screen w-full -bottom-2 left-0 transform translate-y-full">
			{#if $searchResults}
				{#each $searchResults.Packages as pack, i (pack.Id)}
					<div
						class="mb-2"
						in:fly={{
							y: flyAmount,
							delay: $prefersReducedMotion ? 0 : i * 50,
							easing: backOut,
						}}
						animate:flip={{
							duration: $prefersReducedMotion ? 0 : 250,
							easing: backOut,
						}}
					>
						<Package {pack} highlights={parseTags(value)} />
					</div>
				{/each}

				{#if $searchResults.Total === 0}
					<div
						in:fly={{
							y: flyAmount,
							easing: backOut,
						}}
						class="bg-white rounded-xl h-full w-full border p-5 shadow-card mb-2 text-center flex flex-col items-center"
					>
						<EmptyBox class="text-primary" />
						<h3 class="text-2xl font-semibold text-primary">No packages found</h3>
						<p class="text-body text-center max-w-96 mt-2.5">
							Try searching for another term, or narrow down your search using the filters below.
						</p>
					</div>
					<SearchOptions delay={50} />
				{:else}
					<div class="grid grid-cols-2 gap-2">
						<button
							on:click={() => (moreOptionsOpen = !moreOptionsOpen)}
							in:fly={{
								y: flyAmount,
								delay: $prefersReducedMotion ? 0 : $searchResults.Packages.length * 50 + 50,
								easing: backOut,
							}}
							class="w-full h-11 px-4 inline-flex items-center justify-center rounded-lg focus:outline-none | bg-white hover:bg-primary-10 transition-colors text-primary font-semibold text-lg shadow-card"
						>
							{moreOptionsOpen ? "Less options" : "More options"}
							<Icon
								class="ms-3 transform {moreOptionsOpen && 'rotate-180'}"
								icon={angleDown}
								width={24}
								height={24}
							/>
						</button>
						<button
							on:click={() => {
								$searchResults.Total === 1 ? null : viewAllResults();
							}}
							in:fly={{
								y: flyAmount,
								delay: $prefersReducedMotion ? 0 : $searchResults.Packages.length * 50 + 100,
								easing: backOut,
							}}
							class="w-full h-11 px-4 inline-flex items-center justify-center rounded-lg focus:outline-none | bg-primary hover:bg-primary-dark transition-colors text-white font-semibold text-lg shadow-card"
						>
							{#if $searchResults.Total === 1}
								View result
							{:else}
								View all {$searchResults.Total} results
							{/if}
							<Icon class="ms-3" icon={arrowRight} width={24} height={24} />
						</button>
						{#if moreOptionsOpen}
							<SearchOptions class="col-span-2" />
						{/if}
					</div>
				{/if}
			{:else}
				<SearchOptions />
			{/if}
		</div>
	{/if}
</div>
