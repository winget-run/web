<script lang="ts">
	import EmptyBox from "$lib/animations/empty_box.svelte";
	import Button from "$lib/components/Button.svelte";
	import Download from "$lib/components/download.svelte";
	import SectionTitle from "$lib/components/section_title.svelte";
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { downloads } from "$lib/stores/packages";
	import { mapDownloadsToCommands } from "$lib/utils/downloads";
	import IconClipboard from "~icons/uil/clipboard-notes";
	import IconDownload from "~icons/uil/download-alt";
	import IconPackage from "~icons/uil/package";

	import { flip } from "svelte/animate";
	import { backOut, quadOut } from "svelte/easing";
	import { crossfade, fade, fly, slide } from "svelte/transition";
	import { sidebarOpen } from "$lib/stores/sidebar";
	import { searchOpen } from "$lib/stores/search";
	import Codeblock from "./codeblock.svelte";

	const transitionLength = 250;
	$: transitionAmount = $prefersReducedMotion ? 0 : 20;

	const emptyText = ["Looking pretty empty...", "Nothing here!", "It's empty!", "Dust..."];

	$: clipboardText = mapDownloadsToCommands($downloads);

	const [send, recieve] = crossfade({
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
			class="
			h-full mr-5 p-5 rounded-[1.25rem] bg-primary-20 dark:bg-dark-700 h-full flex flex-col items-center transition-all duration-[250ms]
			{$sidebarOpen ? 'w-96' : 'w-[5.25rem]'}
		"
		>
			<div class="flex flex-col w-full text-primary-60 dark:text-primary">
				<div class="flex items-center overflow-hidden">
					<div class="w-8 h-8 ml-1.5">
						<IconDownload width="2rem" height="2rem" />
					</div>
					{#if $sidebarOpen}
						<p
							in:fly={{ x: -10, delay: 150 }}
							out:fly={{ x: 0 }}
							class="ml-2.5 pt-0.5 uppercase text-2xl font-bold whitespace-nowrap overflow-clip"
						>
							{$downloads.length} Downloads
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
							out:fade={{ duration: transitionLength / 2 }}
						>
							<EmptyBox />
							<h3 class="text-2xl font-semibold text-center">
								{emptyText[Math.floor(Math.random() * emptyText.length)]}
							</h3>
							<p class="text-body text-center max-w-72 mt-2.5">
								Add some packages by clicking on the <b>+</b> button anywhere you see it
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
								<div class="p-1.5 rounded-lg bg-white w-auto">
									{#if download.package.Latest.Homepage}
										<img
											class="w-8 h-8"
											src={download.package.Latest.Homepage
												? `https://www.google.com/s2/favicons?sz=32&domain_url=${download.package.Latest.Homepage}`
												: "/favicon.ico"}
											alt=""
										/>
									{:else}
										<IconPackage class="text-primary" width="2rem" height="2rem" />
									{/if}
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
					x: transitionAmount * -1,
					delay: transitionLength / 2,
					duration: transitionLength,
				}}
				out:fly={{ x: transitionAmount * -1, duration: transitionLength }}
				class="flex-1"
			>
				<div class="max-w-full w-3xl h-full bg-primary-10 dark:bg-dark-800 p-5 rounded-[1.25rem]">
					<Codeblock code={clipboardText} />
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- <aside class="mr-4 mb-4 w-lg bg-primary-10 py-4 rounded-xl">
	{#if $downloads?.length > 0}
		<div
			class="flex flex-col items-center h-full"
			in:fly={{ x: transitionAmount, delay: transitionLength, duration: transitionLength }}
			out:fly={{ x: transitionAmount, duration: transitionLength }}
		>
			<SectionTitle class="mb-2 px-4">
				<h2>Selected Packages ({$downloads.length})</h2>
			</SectionTitle>

			<div class="overflow-y-scroll overflow-x-hidden flex-1 h-full w-full relative scrollbar">
				{#each $downloads as download (download.package.Id)}
					<div
						class="mb-4 px-4"
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

			<div class="mt-2 w-full px-4 relative">
				<Button
					on:click={async () => await navigator.clipboard.writeText(mapDownloadsToCommands())}
					class="w-full mb-2"
					size="lg"
					let:iconSize
				>
					<IconClipboard class="mr-3" width={iconSize} height={iconSize} />
					Copy to clipboard
				</Button>
				<Button class="w-full" size="lg" outlined>More options</Button>
			</div>
		</div>
	{:else}
		<div
			class="flex flex-col items-center h-full px-4"
			in:fly={{ x: transitionAmount * -1, delay: transitionLength, duration: transitionLength }}
			out:fly={{ x: transitionAmount * -1, duration: transitionLength }}
		>
			<SectionTitle class="mb-8"><h2>Selected Packages</h2></SectionTitle>
			<EmptyBox class="text-primary" />
			<h3 class="text-2xl font-semibold text-primary text-center">
				{emptyText[Math.floor(Math.random() * emptyText.length)]}
			</h3>
			<p class="text-body text-center max-w-72 mt-2.5">
				Add some packages by clicking on the <b>+</b> button anywhere you see it
			</p>
		</div>
	{/if}
</aside> -->
<style lang="scss">
	.scrollbar {
		&::-webkit-scrollbar {
			width: 6px;
			height: 6px;
		}
		&::-webkit-scrollbar-thumb {
			background: #d4d4d4;
			border-radius: 30px;
		}
		&::-webkit-scrollbar-thumb:hover {
			background: #888888;
		}
		&::-webkit-scrollbar-track {
			background: #ecf6f8;
			border-radius: 30px;
		}
	}
</style>
