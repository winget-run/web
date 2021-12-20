<script lang="ts" context="module">
	export const load: Load = async ({ page }) => {
		const publisher = page.params["publisher"];
		const app = page.params["package"];

		const api = new Wingetdotrun();
		const response = await api.package(publisher, app);

		if (!response?.Package) {
			return {
				status: 404,
				error: "No package found",
			};
		}

		const before = new Date();
		before.setUTCDate(before.getDate() - 1);
		const after = new Date();
		after.setUTCDate(after.getDate() - 14 - 1);

		const stats = await api.stats({
			packageId: `${publisher}.${app}`,
			resolution: "day",
			before: before.toUTCString(),
			after: after.toUTCString(),
		});

		return {
			props: {
				response,
				publisher,
				stats,
			},
		};
	};
</script>

<script lang="ts">
	import Wingetdotrun from "$lib/api/wingetdotrun";
	import Button from "$lib/components/Button.svelte";
	import Codeblock from "$lib/components/codeblock.svelte";
	import Graph from "$lib/components/graph.svelte";
	import Versions from "$lib/components/versions.svelte";
	import { downloads } from "$lib/stores/packages";
	import type { IResponseSingle } from "$lib/types/package";
	import type { IStatsResponse } from "$lib/types/stats";
	import { padDate } from "$lib/utils/helpers";
	import type { Load } from "@sveltejs/kit";
	import { backOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import IconCalendar from "~icons/uil/calendar-alt";
	import IconExternalLink from "~icons/uil/external-link-alt";
	import IconPlus from "~icons/uil/plus";

	export let response: IResponseSingle;
	export let stats: IStatsResponse;
	export let publisher: string;

	$: selected = $downloads.find((x) => x.package.Id === pack.Id);

	function addOrRemove() {
		if (selected) {
			downloads.update((x) => x.filter((y) => y.package.Id !== selected.package.Id));
		} else {
			downloads.update((x) => [...x, { package: pack, version: "latest" }]);
		}
	}

	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
	});

	let graphWidth: number;

	$: dates = padDate(stats.Stats.Data, 1000 * 60 * 60 * 24, 14);

	let selectedDateIdx: number = null;

	$: pack = response.Package;
</script>

<svelte:head>
	<title>Download and install {pack.Latest.Name} with winget</title>
	<meta
		name="description"
		content={pack.Latest.Description ||
			`Download and install ${pack.Latest.Name} and other packages with winget`}
	/>
	<meta name="twitter:title" content={`${pack.Latest.Name} on winget.run`} />
	<meta
		name="twitter:description"
		content={pack.Latest.Description ||
			`Download and install ${pack.Latest.Name} and other packages with winget`}
	/>
</svelte:head>

{#key pack}
	<div class="w-full max-w-[1178px] mx-auto">
		<header in:fly={{ y: 20, duration: 500, easing: backOut }} class="flex my-16">
			<img
				class="w-24 h-24"
				src={pack.Logo ??
					`https://www.google.com/s2/favicons?sz=96&domain_url=${pack.Latest.Homepage}`}
				alt=""
				width={96}
				height={96}
			/>
			<div class="ml-8">
				<h1 class="font-semibold text-5xl text-title mt-2 leading-none">
					<span class="mr-2">{pack.Latest.Name}</span>
					<span class="font-medium italic text-2xl text-sub">{pack.Versions[0]}</span>
				</h1>
				<a
					href="/pkg/{publisher}"
					class="inline-block font-medium italic text-2xl text-sub mt-2 leading-none"
					>{pack.Latest.Publisher}</a
				>
			</div>
		</header>

		<div
			in:fly={{ y: 20, duration: 500, delay: 250, easing: backOut }}
			class="grid grid-cols-10 gap-8"
		>
			<div class="col-span-3">
				<Button on:click={addOrRemove} class="w-full mb-5" outlined={!selected} let:iconSize>
					<IconPlus
						class="mr-2 transform {selected && 'rotate-45'}"
						width={iconSize}
						height={iconSize}
					/>
					{selected ? "Remove this package" : "Add this package"}
				</Button>

				{#if pack.Latest.Homepage}
					<Button href={pack.Latest.Homepage} class="w-full -mt-2 mb-5" outlined let:iconSize>
						<IconExternalLink class="mr-2" width={iconSize} height={iconSize} />
						Visit Website
					</Button>
				{/if}

				<div class="bg-white rounded-xl w-full border transition-all shadow-card mb-5">
					{#if pack.Latest.Tags?.length > 0}
						<section class="mb-10 px-5 mt-5">
							<h2 class="font-semibold text-2xl text-title mb-2 leading-tight">Tags</h2>
							<div class="-mb-2">
								{#each pack.Latest.Tags as tag}
									<a
										href="/search?tags={encodeURIComponent(tag)}"
										rel="nofollow"
										class="inline-block rounded border border-primary px-2.5 py-2 not-last:mr-2 mb-2 | leading-none whitespace-nowrap text-primary font-medium text-sm transition-colors hover:(text-white bg-primary)"
									>
										{tag}
									</a>
								{/each}
							</div>
						</section>
					{/if}
					<section bind:offsetWidth={graphWidth} class="mt-5">
						{#if selectedDateIdx !== null}
							<h2 class="px-5 font-semibold text-2xl text-title leading-tight">
								{dates[selectedDateIdx].Value} views
							</h2>
							<h3 class="px-5 font-medium italic text-sm text-sub">
								{dateFormatter.format(new Date(dates[selectedDateIdx].Period))}
							</h3>
						{:else}
							<h2 class="px-5 font-semibold text-2xl text-title leading-tight">
								{dates.reduce((a, c) => a + c.Value, 0)} views
							</h2>
							<h3 class="px-5 font-medium italic text-sm text-sub">in the last 14 days</h3>
						{/if}

						<Graph
							class="w-full rounded-b-xl text-primary"
							stats={dates}
							bind:selected={selectedDateIdx}
							verticalPadding={20}
							height={120}
							width={graphWidth}
						/>
					</section>
				</div>

				<div class="bg-white rounded-xl w-full border transition-all shadow-card">
					<h2 class="font-semibold text-2xl text-title mb-2 leading-tight p-5 pb-1">Versions</h2>
					<Versions {pack} class="px-2.5 mb-5" />
				</div>
			</div>
			<div class="col-span-7">
				<!-- Code snippet -->
				<section class="mb-10">
					<h2 class="font-semibold text-2xl text-title mb-2 leading-tight">How to install</h2>
					<Codeblock code="winget install -e --id {pack.Id}" class="w-full mb-3" />
					<!-- <div class="flex items-center">
					<Button on:click={() => alert("bruh")} size="lg" outlined={!selected} let:iconSize>
						<Icon
							class="mr-3 transform {selected && 'rotate-45'}"
							icon={plus}
							width={iconSize}
							height={iconSize}
						/>
						{selected ? "Remove from selected packages" : "Add to selected packages"}
					</Button>
					<p class="mx-4 text-body">or</p>
					<Button class="truncate" size="lg" let:iconSize>
						<Icon class="mr-3" icon={clipboardNotes} width={iconSize} height={iconSize} />
						Copy to clipboard
					</Button>
				</div> -->
				</section>

				<!-- Description -->
				{#if pack.Latest.Description}
					<section class="mb-10">
						<h2 class="font-semibold text-2xl text-title mb-2 leading-tight">About</h2>
						<p class="text-body">{pack.Latest.Description}</p>
					</section>
				{/if}

				<section class="mb-10">
					<h2 class="font-semibold text-2xl text-title mb-2 leading-tight">Other details</h2>
					<!-- Updated Date -->
					<p class="text-body flex items-center mb-3">
						<IconCalendar class="mr-2" width={16} height={16} />
						Last updated on {dateFormatter.format(new Date(pack.UpdatedAt))}
					</p>

					<!-- License -->
					{#if pack.Latest.LicenseUrl}
						<a
							href={pack.Latest.LicenseUrl}
							rel="nofollow"
							class="text-body flex items-center mb-3 hover:(underline text-primary)"
						>
							<IconExternalLink class="mr-2" width={16} height={16} />
							{pack.Latest.License}
						</a>
					{:else}
						<p class="text-body flex mb-3">
							{pack.Latest.License}
						</p>
					{/if}
				</section>
			</div>
		</div>
	</div>
{/key}
