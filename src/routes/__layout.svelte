<script context="module" lang="ts">
	import { page } from "$app/stores";
	import darkmode from "$lib/actions/use_darkmode";
	import Footer from "$lib/components/footer.svelte";
	import Nav from "$lib/components/nav.svelte";
	import Sidebar from "$lib/components/sidebar.svelte";
	import { downloads } from "$lib/stores/packages";
	import { searchOpen, sidebarOpen } from "$lib/stores/ui";
	import { LOCALES } from "$lib/utils/constants";
	import type { Load } from "@sveltejs/kit";
	import { IShortcut, shortcut } from "svaria";
	import { onMount } from "svelte";
	import { getLocaleFromNavigator, init, register, waitLocale } from "svelte-intl-precompile";
	import { fade } from "svelte/transition";
	import "virtual:windi.css";

	// @ts-ignore
	register("en", () => import("$locales/en"));
	// @ts-ignore
	register("es", () => import("$locales/es"));
	// @ts-ignore
	register("ko", () => import("$locales/ko"));
	// @ts-ignore
	register("pt", () => import("$locales/pt"));

	export const load: Load = async ({ session }) => {
		init({
			fallbackLocale: "en",
			initialLocale: session.storedLocale || session.acceptedLanguage || getLocaleFromNavigator(),
		});
		await waitLocale();
		return {};
	};
</script>

<script lang="ts">
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

	const globalShortcuts: IShortcut[] = [
		{
			key: "k",
			ctrlKey: true,
			callback: () => searchOpen.set(true),
		},
	];
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
	<link
		type="application/opensearchdescription+xml"
		rel="search"
		href="https://winget.run/opensearch.xml"
	/>
	<meta
		name="keywords"
		content="winget, winget packages, winget online, windows, windows package manager, run winget, winget run, wingetdotrun, windows 10 package manager, windows 10"
	/>
	<meta name="theme-color" content="#327080" />
	<meta name="twitter:image" content="https://winget.run/img/twitter_card.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@wingetdotrun" />
	<meta name="twitter:title" content="winget.run" />
	{#each Object.keys(LOCALES).filter((x) => x !== "en") as hreflang}
		<link rel="alternate" href="https://{$page.host}{$page.path}?lang={hreflang}" {hreflang} />
	{/each}
</svelte:head>

<svelte:body use:darkmode use:shortcut={globalShortcuts} />

<div class="flex flex-col h-screen overflow-hidden p-4 pb-0 bg-primary-10 dark:bg-dark-900">
	{#if $searchOpen || $sidebarOpen}
		<div
			transition:fade={{ duration: 250 }}
			class="fixed h-full w-full top-0 left-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-[2px] z-20"
		/>
	{/if}

	<Nav />
	<div class="flex-1 flex overflow-hidden relative">
		<Sidebar />
		<main class="w-full flex flex-col justify-between px-4 overflow-auto pb-4">
			<div class="">
				<slot />
			</div>
			<Footer />
		</main>
	</div>
</div>

<style lang="scss" global>
	@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap");
	* {
		letter-spacing: -0.03em;
	}

	body {
		overflow: hidden;
	}

	input[type="text"]::-ms-clear {
		display: none;
		width: 0;
		height: 0;
	}
	input[type="text"]::-ms-reveal {
		display: none;
		width: 0;
		height: 0;
	}
	input[type="search"]::-webkit-search-decoration,
	input[type="search"]::-webkit-search-cancel-button,
	input[type="search"]::-webkit-search-results-button,
	input[type="search"]::-webkit-search-results-decoration {
		display: none;
	}

	main {
		&::-webkit-scrollbar {
			width: 6px;
			height: 6px;
		}
		&::-webkit-scrollbar-thumb {
			@apply bg-primary-30 dark:bg-dark-800;
			border-radius: 30px;
		}
		&::-webkit-scrollbar-thumb:hover {
			@apply bg-primary-40 dark:bg-dark-700;
		}
		&::-webkit-scrollbar-track {
			@apply bg-primary-10 dark:bg-dark-900;
			border-radius: 30px;
		}
	}

	.packages-grid {
		display: grid;
		width: 100%;
		grid-gap: 2rem;
		grid-template-columns: repeat(auto-fill, minmax(20rem, auto));
	}
</style>
