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
	import Tooltip from "$lib/components/tooltip.svelte";
	import Versions from "$lib/components/versions.svelte";
	import { downloads } from "$lib/stores/packages";
	import { theme } from "$lib/stores/a11y";
	import type { IResponseSingle } from "$lib/types/package";
	import type { IStatsResponse } from "$lib/types/stats";
	import { padDate } from "$lib/utils/helpers";
	import type { Load } from "@sveltejs/kit";
	import { backOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import IconCalendar from "~icons/uil/calendar-alt";
	import IconExternalLink from "~icons/uil/external-link-alt";
	import IconPlus from "~icons/uil/plus";
	import IconStar from "~icons/uil/star";
	import { date, t } from "svelte-intl-precompile";

	export let response: IResponseSingle;
	export let stats: IStatsResponse;
	export let publisher: string;

	$: selected = $downloads.find((x) => x.package.Id === pack.Id);
	$: gradient =
		$theme === "light"
			? "linear-gradient(180deg, rgba(242, 247, 249, 0.65) 0%, #F2F7F9 100%)"
			: "linear-gradient(180deg, rgba(37, 41, 58, 0.65) 0%, #25293A 100%)";

	function addOrRemove() {
		if (selected) {
			downloads.update((x) => x.filter((y) => y.package.Id !== selected.package.Id));
		} else {
			downloads.update((x) => [...x, { package: pack, version: "latest" }]);
		}
	}

	let graphWidth: number;

	$: dates = padDate(stats.Stats.Data, 1000 * 60 * 60 * 24, 14);

	let selectedDateIdx: number = null;

	$: pack = response.Package;
</script>

<svelte:head>
	<title>{$t("package.title", { values: { name: pack.Latest.Name } })}</title>
	<meta
		name="description"
		content={pack.Latest.Description || $t("package.desc", { values: { name: pack.Latest.Name } })}
	/>
	<meta
		name="twitter:title"
		content={$t("package.twitter_title", { values: { name: pack.Latest.Name } })}
	/>
	<meta
		name="twitter:description"
		content={pack.Latest.Description || $t("package.desc", { values: { name: pack.Latest.Name } })}
	/>
</svelte:head>

{#key pack}
	<header
		in:fly={{ y: 20, duration: 500, easing: backOut }}
		class="
		max-w-7xl mx-auto rounded-[1.25rem] pb-8 mb-8 bg-cover bg-center bg-no-repeat
		{pack.Banner ? 'pt-32' : 'pt-16'}
		"
		style="background-image: {gradient}, url({pack.Banner});"
	>
		<div class="w-full max-w-[1178px] mx-auto flex">
			<img
				class="w-24 h-24"
				src={pack.Logo ??
					`https://www.google.com/s2/favicons?sz=96&domain_url=${pack.Latest.Homepage}`}
				alt=""
				width={96}
				height={96}
			/>
			<div class="ml-8">
				<h1 class="font-semibold text-5xl text-title dark:text-white mt-2 leading-none">
					{pack.Latest.Name}
					{#if pack.Featured}
						<Tooltip wrapperClass="inline-block align-top" content={$t("package.featured_package")}>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M22.0005 9.6699C21.9373 9.48699 21.8224 9.32633 21.6698 9.2074C21.5171 9.08848 21.3333 9.0164 21.1405 8.9999L15.4505 8.1699L12.9005 2.9999C12.8186 2.83083 12.6907 2.68824 12.5316 2.58847C12.3724 2.48871 12.1883 2.43579 12.0005 2.43579C11.8126 2.43579 11.6286 2.48871 11.4694 2.58847C11.3102 2.68824 11.1824 2.83083 11.1005 2.9999L8.55047 8.1599L2.86047 8.9999C2.67539 9.02621 2.50139 9.10386 2.35822 9.22406C2.21504 9.34425 2.10843 9.50218 2.05047 9.6799C1.99741 9.85358 1.99265 10.0384 2.03669 10.2146C2.08074 10.3908 2.17192 10.5516 2.30047 10.6799L6.43047 14.6799L5.43047 20.3599C5.39477 20.5474 5.41346 20.7412 5.48434 20.9184C5.55522 21.0955 5.67532 21.2488 5.83047 21.3599C5.98168 21.468 6.16004 21.5318 6.34551 21.5442C6.53099 21.5566 6.71624 21.517 6.88047 21.4299L12.0005 18.7599L17.1005 21.4399C17.2408 21.5191 17.3993 21.5604 17.5605 21.5599C17.7723 21.5607 17.9789 21.4941 18.1505 21.3699C18.3056 21.2588 18.4257 21.1055 18.4966 20.9284C18.5675 20.7512 18.5862 20.5574 18.5505 20.3699L17.5505 14.6899L21.6805 10.6899C21.8248 10.5676 21.9316 10.4068 21.9882 10.2262C22.0448 10.0457 22.0491 9.85278 22.0005 9.6699Z"
									fill="#ECB22E"
								/>
							</svg>
						</Tooltip>
					{/if}
				</h1>
				<a
					href="/pkg/{publisher}"
					class="inline-block font-medium italic text-2xl text-sub dark:text-sub-dark mt-2 leading-none"
				>
					{pack.Latest.Publisher}
				</a>
			</div>
		</div>
	</header>
	<div class="w-full max-w-[1178px] mx-auto">
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
					{selected ? $t("ctas.remove_this_package") : $t("ctas.add_this_package")}
				</Button>

				{#if pack.Latest.Homepage}
					<Button href={pack.Latest.Homepage} class="w-full -mt-2 mb-5" outlined let:iconSize>
						<IconExternalLink class="mr-2" width={iconSize} height={iconSize} />
						{$t("ctas.visit_website")}
					</Button>
				{/if}

				<div
					class="bg-white dark:bg-dark-700 rounded-xl w-full transition-all shadow-card flex flex-col mb-5"
				>
					{#if pack.Latest.Tags?.length > 0}
						<section class="mb-10 pt-5 px-5">
							<h2 class="font-semibold text-xl text-title dark:text-white mb-2 leading-tight">
								{$t("package.tags")}
							</h2>
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
					<section bind:offsetWidth={graphWidth} class="pt-5">
						{#if selectedDateIdx !== null}
							<h2 class="px-5 font-semibold text-xl text-title dark:text-white leading-tight">
								{$t("package.x_views", { values: { count: dates[selectedDateIdx].Value } })}
							</h2>
							<h3 class="px-5 font-medium italic text-sm text-sub dark:text-sub-dark">
								{$date(new Date(dates[selectedDateIdx].Period), { dateStyle: "medium" })}
							</h3>
						{:else}
							<h2 class="px-5 font-semibold text-xl text-title dark:text-white leading-tight">
								{$t("package.x_views", {
									values: { count: dates.reduce((a, c) => a + c.Value, 0) },
								})}
							</h2>
							<h3 class="px-5 font-medium italic text-sm text-sub dark:text-sub-dark">
								{$t("package.in_last_x_days", { values: { count: 14 } })}
							</h3>
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

				<div class="bg-white dark:bg-dark-700 rounded-xl w-full transition-all shadow-card">
					<h2 class="font-semibold text-xl text-title dark:text-white mb-2 leading-tight p-5 pb-1">
						{$t("package.versions")}
					</h2>
					<Versions {pack} class="px-2.5 pb-5" />
				</div>
			</div>
			<div class="col-span-7">
				<!-- Code snippet -->
				<section class="mb-10">
					<h2 class="font-semibold text-2xl text-title dark:text-white mb-2 leading-tight">
						{$t("package.how_to_install")}
					</h2>
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
						<h2 class="font-semibold text-2xl text-title dark:text-white mb-2 leading-tight">
							{$t("ctas.about")}
						</h2>
						<p class="text-body dark:text-body-dark">{pack.Latest.Description}</p>
					</section>
				{/if}

				<section class="mb-10">
					<h2 class="font-semibold text-2xl text-title dark:text-white mb-2 leading-tight">
						{$t("package.other_details")}
					</h2>
					<!-- Updated Date -->
					<p class="text-body dark:text-body-dark flex items-center mb-3">
						<IconCalendar class="mr-2" width={16} height={16} />
						{$t("package.last_updated_on", { values: { date: new Date(pack.UpdatedAt) } })}
					</p>

					<!-- License -->
					{#if pack.Latest.LicenseUrl}
						<a
							href={pack.Latest.LicenseUrl}
							rel="nofollow"
							class="text-body dark:text-body-dark flex items-center mb-3 hover:(underline text-primary)"
						>
							<IconExternalLink class="mr-2" width={16} height={16} />
							{pack.Latest.License || $t("package.license")}
						</a>
					{:else if pack.Latest.License}
						<p class="text-body dark:text-body-dark flex mb-3">
							{pack.Latest.License}
						</p>
					{/if}
				</section>
			</div>
		</div>
	</div>
{/key}
