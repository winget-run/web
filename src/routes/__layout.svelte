<script lang="ts">
	import EmptyBox from "$lib/animations/empty_box.svelte";
	import Button from "$lib/components/Button.svelte";
	import Download from "$lib/components/download.svelte";
	import Search from "$lib/components/search.svelte";
	import SectionTitle from "$lib/components/section_title.svelte";
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { downloads } from "$lib/stores/packages";
	import { searchOpen } from "$lib/stores/search";
	import clipboardNotes from "@iconify/icons-uil/clipboard-notes";
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";
	import { backOut, quadOut } from "svelte/easing";
	import { crossfade, fade, fly } from "svelte/transition";
	import "virtual:windi.css";

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

	let mounted = false;

	$: {
		if (mounted) {
			localStorage.setItem("winget_downloads", JSON.stringify($downloads));
		}
	}

	onMount(() => {
		const local = localStorage.getItem("winget_downloads");

		if (local) {
			$downloads = JSON.parse(local);
		}

		mounted = true;
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
	<link
		type="application/opensearchdescription+xml"
		rel="search"
		href="https://winget.run/opensearch.xml"
	/>
	<meta name="theme-color" content="#327080" />
	<meta name="twitter:image" content="https://winget.run/img/twitter_card.jpg" />
	<meta
		name="keywords"
		content="winget, winget packages, winget online, windows, windows package manager, run winget, winget run, wingetdotrun, windows 10 package manager, windows 10"
	/>
</svelte:head>

<div class="flex flex-col h-screen overflow-hidden p-4">
	{#if $searchOpen}
		<div
			transition:fade={{ duration: 250 }}
			class="fixed h-full w-full top-0 left-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-[2px] z-20 pointer-events-none"
		/>
	{/if}

	<nav class="pb-4">
		<div class="flex w-full items-center justify-between h-full w-full bg-primary rounded-xl p-4">
			<h1 class="font-bold text-white text-3xl pl-4">
				<a href="/"> wingetdotrun </a>
			</h1>
			<Search />
			<div class="flex items-center">
				<a
					href="https://github.com/winget-run/wingetdotrun"
					class="w-11 h-11 mr-3 inline-flex items-center justify-center rounded-lg focus:outline-none | bg-white bg-opacity-10 hover:bg-grey-10 transition-colors text-white font-semibold text-lg"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M10 0C4.475 0 0 4.475 0 10C0 14.425 2.8625 18.1625 6.8375 19.4875C7.3375 19.575 7.525 19.275 7.525 19.0125C7.525 18.775 7.5125 17.9875 7.5125 17.15C5 17.6125 4.35 16.5375 4.15 15.975C4.0375 15.6875 3.55 14.8 3.125 14.5625C2.775 14.375 2.275 13.9125 3.1125 13.9C3.9 13.8875 4.4625 14.625 4.65 14.925C5.55 16.4375 6.9875 16.0125 7.5625 15.75C7.65 15.1 7.9125 14.6625 8.2 14.4125C5.975 14.1625 3.65 13.3 3.65 9.475C3.65 8.3875 4.0375 7.4875 4.675 6.7875C4.575 6.5375 4.225 5.5125 4.775 4.1375C4.775 4.1375 5.6125 3.875 7.525 5.1625C8.325 4.9375 9.175 4.825 10.025 4.825C10.875 4.825 11.725 4.9375 12.525 5.1625C14.4375 3.8625 15.275 4.1375 15.275 4.1375C15.825 5.5125 15.475 6.5375 15.375 6.7875C16.0125 7.4875 16.4 8.375 16.4 9.475C16.4 13.3125 14.0625 14.1625 11.8375 14.4125C12.2 14.725 12.5125 15.325 12.5125 16.2625C12.5125 17.6 12.5 18.675 12.5 19.0125C12.5 19.275 12.6875 19.5875 13.1875 19.4875C15.1726 18.8173 16.8976 17.5414 18.1197 15.8395C19.3418 14.1375 19.9994 12.0952 20 10C20 4.475 15.525 0 10 0Z"
							fill="currentColor"
						/>
					</svg>
				</a>
				<a
					href="https://ko-fi.com/wingetdotrun"
					class="w-11 h-11 mr-3 inline-flex items-center justify-center rounded-lg focus:outline-none | bg-white bg-opacity-10 hover:bg-grey-10 transition-colors text-white font-semibold text-lg"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19.9008 7.45665C19.2566 4.05248 15.8516 3.62915 15.8516 3.62915H0.602462C0.0991289 3.62915 0.0366289 4.29415 0.0366289 4.29415C0.0366289 4.29415 -0.0317044 10.3975 0.0182956 14.1458C0.154962 16.1658 2.1733 16.3725 2.1733 16.3725C2.1733 16.3725 9.06246 16.3533 12.145 16.3317C14.1766 15.9767 14.3808 14.1933 14.36 13.22C17.9866 13.42 20.545 10.8608 19.9008 7.45665ZM10.6825 10.3825C9.64413 11.5933 7.33996 13.6958 7.33996 13.6958C7.33996 13.6958 7.23913 13.795 7.08163 13.715C7.0183 13.6675 6.99163 13.64 6.99163 13.64C6.62246 13.2725 4.18496 11.0992 3.62996 10.345C3.03913 9.54082 2.76246 8.09498 3.55413 7.25332C4.34663 6.41165 6.0583 6.34832 7.18996 7.59248C7.18996 7.59248 8.49413 6.10748 10.08 6.78998C11.6666 7.47332 11.6066 9.29915 10.6825 10.3825ZM15.8266 10.7808C15.0533 10.8775 14.425 10.8042 14.425 10.8042V6.06998H15.9C15.9 6.06998 17.5425 6.52915 17.5425 8.26832C17.5425 9.86248 16.7216 10.4908 15.8266 10.7808Z"
							fill="currentColor"
						/>
					</svg>
				</a>
				<a
					href="ms-appinstaller:?source=https://aka.ms/getwinget"
					class="h-11 inline-flex px-4 items-center justify-center rounded-lg focus:outline-none | bg-white hover:bg-grey-10 transition-colors text-primary hover:text-primary-dark font-semibold text-lg"
				>
					Install winget
				</a>
			</div>
		</div>
	</nav>
	<div class="flex-1 flex overflow-hidden">
		<main class="w-full flex flex-col justify-between px-4 overflow-auto">
			<div class="">
				<slot />
			</div>
			<!-- <footer class="pt-4 bg-primary p-4 rounded-xl h-52" /> -->
		</main>
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

					<div class="overflow-y-scroll overflow-x-visible flex-1 h-full w-full hide-scrollbar">
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

						<Button class="w-full mb-2" size="lg" let:iconSize>
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
	</div>
</div>

<style global>
	@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap");
	* {
		letter-spacing: -0.03em;
	}

	body {
		overflow: hidden;
	}

	.hide-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
