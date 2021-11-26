<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ page }) => {
		const publisher = page.params["publisher"];
		const app = page.params["package"];

		const api = new Wingetdotrun();
		const response = await api.package(publisher, app).catch(console.error);

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
	import type { IResponseSingle } from "$lib/types/package";
	import Button from "$lib/components/Button.svelte";
	import { fly } from "svelte/transition";
	import { backOut } from "svelte/easing";
	import external from "@iconify/icons-uil/external-link-alt";
	import Icon from "@iconify/svelte";
	import type { IStatsResponse } from "$lib/types/stats";
	import Wingetdotrun from "$lib/api/wingetdotrun";
	import Graph from "$lib/components/graph.svelte";
	import { api } from "$lib/stores/api";
	import clipboardNotes from "@iconify/icons-uil/clipboard-notes";
	import calendar from "@iconify/icons-uil/calendar-alt";
	import plus from "@iconify/icons-uil/plus";
	import { padDate } from "$lib/utils/helpers";

	export let response: IResponseSingle;
	export let stats: IStatsResponse;
	export let publisher: string;

	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
	});

	let graphWidth: number;

	$: dates = padDate(stats.Stats.Data, 1000 * 60 * 60 * 24, 14);

	let selectedDateIdx: number = null;

	$: pack = response.Package;
</script>

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
				{pack.Latest.Name}
				<span class="font-medium italic text-2xl text-sub ml-2">{pack.Versions[0]}</span>
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
			{#if pack.Latest.Homepage}
				<Button href={pack.Latest.Homepage} class="w-full mb-3" outlined let:iconSize>
					<Icon class="mr-2" icon={external} width={iconSize} height={iconSize} />Visit Website
				</Button>
			{/if}

			<div class="bg-white rounded-xl w-full border transition-all shadow-card">
				{#if pack.Latest.Tags?.length > 0}
					<section class="mb-10 px-5 mt-5">
						<h2 class="font-semibold text-2xl text-title mb-2 leading-tight">Tags</h2>
						<div class="-mb-2">
							{#each pack.Latest.Tags as tag}
								<a
									href="/search?tags={tag}"
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
						class="w-full"
						stats={dates}
						bind:selected={selectedDateIdx}
						verticalPadding={20}
						height={120}
						width={graphWidth}
					/>
				</section>
			</div>
		</div>
		<div class="col-span-7">
			<section class="mb-10">
				<h2 class="font-semibold text-2xl text-title mb-2 leading-tight">How to install</h2>
				<code class="code bg-grey-10 rounded-lg p-5 leading-none block truncate w-full mb-3">
					winget install -e --id {pack.Id}
				</code>
				<div class="flex items-center">
					<Button class="" size="lg" outlined let:iconSize>
						<Icon class="mr-3" icon={plus} width={iconSize} height={iconSize} />
						Add to selected packages
					</Button>
					<p class="mx-4 text-body">or</p>
					<Button class="truncate" size="lg" let:iconSize>
						<Icon class="mr-3" icon={clipboardNotes} width={iconSize} height={iconSize} />
						Copy to clipboard
					</Button>
				</div>
			</section>

			{#if pack.Latest.Description}
				<section class="mb-10">
					<h2 class="font-semibold text-2xl text-title mb-2 leading-tight">About</h2>
					<p class="text-body">{pack.Latest.Description}</p>
				</section>
			{/if}

			{#if pack.Latest.LicenseUrl}
				<section class="mb-10">
					<h2 class="font-semibold text-2xl text-title mb-2 leading-tight">Licensed under</h2>
					{#if pack.Latest.LicenseUrl}
						<a
							href={pack.Latest.LicenseUrl}
							rel="nofollow"
							class="text-body inline-flex items-center"
						>
							<Icon class="mr-2" icon={external} width={16} height={16} />
							{pack.Latest.License}
						</a>
					{:else}
						<p class="text-body">
							{pack.Latest.License}
						</p>
					{/if}
				</section>
				<section>
					<p class="text-body inline-flex items-center">
						<Icon class="mr-3" icon={calendar} width={16} height={16} />
						Last updated on {dateFormatter.format(new Date(pack.UpdatedAt))}
					</p>
				</section>
			{/if}
		</div>
	</div>
</div>

<style>
	.code::before {
		content: ">";
		margin-right: 0.5rem;
	}
</style>
