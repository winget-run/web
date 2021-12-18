<script lang="ts">
	import EmptyBox from "$lib/animations/empty_box.svelte";
	import Button from "$lib/components/Button.svelte";
	import Download from "$lib/components/download.svelte";
	import SectionTitle from "$lib/components/section_title.svelte";
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { downloads } from "$lib/stores/packages";
	import { mapDownloadsToCommands } from "$lib/utils/downloads";
	import clipboardNotes from "@iconify/icons-uil/clipboard-notes";
	import Icon from "@iconify/svelte";
	import { flip } from "svelte/animate";
	import { backOut, quadOut } from "svelte/easing";
	import { crossfade, fly } from "svelte/transition";

	const transitionLength = 250;
	$: transitionAmount = $prefersReducedMotion ? 0 : 20;

	const emptyText = ["Looking pretty empty...", "Tumbleweed...", "Nothing here!", "Top Text"];

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

<aside class="ml-4 w-lg bg-primary-10 py-4 rounded-xl">
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
				<!-- <div
          class="h-4 w-full absolute -top-2 left-0 transform -translate-y-full bg-gradient-to-t from-primary-10 to-transparent"
        /> -->

				<Button
					on:click={async () => await navigator.clipboard.writeText(mapDownloadsToCommands())}
					class="w-full mb-2"
					size="lg"
					let:iconSize
				>
					<Icon class="mr-3" icon={clipboardNotes} width={iconSize} height={iconSize} />
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
			<EmptyBox />
			<h3 class="text-2xl font-semibold text-primary text-center">
				{emptyText[Math.floor(Math.random() * emptyText.length)]}
			</h3>
			<p class="text-body text-center max-w-72 mt-2.5">
				Add some packages by clicking on the <b>+</b> button anywhere you see it
			</p>
		</div>
	{/if}
</aside>

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
