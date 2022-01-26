<script lang="ts">
	import EmptyBox from "$lib/animations/empty_box.svelte";
	import Download from "$lib/components/download.svelte";
	import { prefersReducedMotion } from "svaria";
	import { downloads } from "$lib/stores/packages";
	import { sidebarOpen } from "$lib/stores/sidebar";
	import { mapDownloadsToCommands } from "$lib/utils/downloads";
	import clsx from "clsx";
	import { t } from "svelte-intl-precompile";
	import { flip } from "svelte/animate";
	import { backOut, quadOut } from "svelte/easing";
	import { crossfade, fade, fly } from "svelte/transition";
	import IconDownload from "~icons/uil/download-alt";
	import IconPackage from "~icons/uil/package";
	import Codeblock from "./codeblock.svelte";
	import PackageIcon from "./package_icon.svelte";

	const transitionLength = 250;
	$: transitionAmount = $prefersReducedMotion ? 0 : 20;

	$: emptyText = [
		$t("sidebar.empty_captions.1"),
		$t("sidebar.empty_captions.2"),
		$t("sidebar.empty_captions.3"),
		$t("sidebar.empty_captions.4"),
	];
	$: clipboardText = mapDownloadsToCommands($downloads);

	$: [send, recieve] = crossfade({
		fallback(node) {
			const style = getComputedStyle(node);
			const transform = style.transform === "none" ? "" : style.transform;

			return {
				duration: transitionLength,
				easing: backOut,
				css: (t, u) =>
					$prefersReducedMotion
						? `opacity: ${t}`
						: `
					transform: ${transform} scale(${1 - 0.2 * u});
					opacity: ${t}
				`,
			};
		},
	});
</script>

<!-- Spacer -->
<div class="h-full w-[5.25rem] mr-10" />

<div class="w-full h-full absolute left-0 pb-4 z-40 pointer-events-none flex">
	<div
		on:mouseenter={() => sidebarOpen.set(true)}
		on:mouseleave={() => sidebarOpen.set(false)}
		on:focus={() => sidebarOpen.set(true)}
		on:blur={() => sidebarOpen.set(false)}
		class="flex h-full pointer-events-auto"
	>
		<!-- Sidebar -->
		<aside
			class={clsx(
				"h-full mr-5 p-5 rounded-[1.25rem] bg-primary-20 dark:bg-dark-700 h-full flex flex-col items-center",
				$prefersReducedMotion ? "" : "transition-all duration-[250ms]",
				$sidebarOpen ? "w-96" : "w-[5.25rem]"
			)}
		>
			<div class="flex flex-col w-full text-primary-60 dark:text-primary">
				<div class="flex items-center overflow-hidden">
					<div class="w-8 h-8 ml-1.5">
						<IconDownload width="2rem" height="2rem" />
					</div>
					{#if $sidebarOpen}
						<p
							in:fly={{ x: $prefersReducedMotion ? 0 : -10, delay: 150 }}
							out:fly={{ x: 0 }}
							class="ml-2.5 pt-0.5 uppercase text-2xl font-bold whitespace-nowrap overflow-clip"
						>
							{$t("sidebar.x_downloads", { values: { count: $downloads.length } })}
						</p>
					{/if}
				</div>
			</div>

			<!-- Items -->
			<div class="flex-1 h-full w-full relative mt-8">
				{#if $sidebarOpen}
					{#if $downloads.length > 0}
						<div
							class="absolute top-0 left-0 h-full w-full overflow-y-auto overflow-x-hidden scrollbar"
						>
							{#each $downloads as download (download.package.Id)}
								<div
									class="mb-4"
									in:recieve={{ key: download.package.Id }}
									out:send={{ key: download.package.Id }}
									animate:flip={{
										duration: $prefersReducedMotion ? 0 : 250,
										easing: quadOut,
										delay: $prefersReducedMotion ? 250 : 0,
									}}
								>
									<Download {download} />
								</div>
							{/each}
						</div>
					{:else}
						<div
							class="flex flex-col items-center h-full px-4 text-primary-60 dark:text-primary"
							in:fade={{
								delay: transitionLength,
								duration: transitionLength,
							}}
						>
							<EmptyBox />
							<h3 class="text-2xl font-semibold text-center">
								{emptyText[Math.floor(Math.random() * emptyText.length)]}
							</h3>
							<p class="text-body dark:text-body-dark text-center max-w-72 mt-2.5">
								{@html $t("sidebar.add_some_packages")}
							</p>
						</div>
					{/if}
				{:else}
					<div class="absolute top-0 left-0 h-full w-full overflow-hidden">
						{#each $downloads as download (download.package.Id)}
							<div
								class="not-last:mb-5"
								in:recieve={{ key: download.package.Id }}
								out:send={{ key: download.package.Id }}
								animate:flip={{
									duration: $prefersReducedMotion ? 0 : 250,
									easing: quadOut,
									delay: $prefersReducedMotion ? 250 : 0,
								}}
							>
								<div class="p-1.5 rounded-lg bg-white dark:bg-dark-800 w-auto">
									<PackageIcon
										logo={download.package.Logo}
										homepage={download.package.Latest.Homepage}
										size={32}
									/>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</aside>
		<!-- Options -->
		{#if $sidebarOpen && $downloads.length > 0}
			<div
				in:fly={{
					x: $prefersReducedMotion ? 0 : transitionAmount * -1,
					delay: transitionLength / 2,
					duration: transitionLength,
				}}
				out:fly={{
					x: $prefersReducedMotion ? 0 : transitionAmount * -1,
					duration: transitionLength,
				}}
				class="flex-1"
			>
				<div class="max-w-full w-3xl h-full bg-primary-10 dark:bg-dark-800 p-5 rounded-[1.25rem]">
					<Codeblock code={clipboardText} />
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.scrollbar {
		&::-webkit-scrollbar {
			width: 6px;
			height: 6px;
		}
		&::-webkit-scrollbar-thumb {
			@apply bg-primary-40 dark:bg-dark-800;
			border-radius: 30px;
		}
		&::-webkit-scrollbar-thumb:hover {
			@apply bg-primary-50 dark:bg-dark-700;
		}
		&::-webkit-scrollbar-track {
			@apply bg-primary-20 dark:bg-dark-900;
			border-radius: 30px;
		}
	}
</style>
