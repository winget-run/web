<script lang="ts">
	import "virtual:windi.css";
	import Footer from "$lib/components/footer.svelte";
	import Search from "$lib/components/search.svelte";
	import Sidebar from "$lib/components/sidebar.svelte";
	import Github from "$lib/components/svg/github.svelte";
	import Kofi from "$lib/components/svg/kofi.svelte";
	import Logo from "$lib/components/svg/logo.svelte";
	import { downloads } from "$lib/stores/packages";
	import { searchOpen } from "$lib/stores/search";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

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

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.ctrlKey && e.key === "k") {
			e.preventDefault();
			searchOpen.set(true);
		}

		if ($searchOpen && e.key === "Escape") {
			searchOpen.set(false);
		}
	};
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
</svelte:head>

<svelte:body on:keydown={handleKeyDown} />

<div class="flex flex-col h-screen overflow-hidden p-4 bg-white dark:bg-dark-900">
	{#if $searchOpen}
		<div
			transition:fade={{ duration: 250 }}
			class="fixed h-full w-full top-0 left-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-[2px] z-20 pointer-events-none"
		/>
	{/if}

	<nav class="pb-4">
		<div class="flex w-full items-center justify-between h-full w-full bg-primary rounded-xl p-4">
			<h1 class="font-bold text-white text-3xl pl-4">
				<a aria-label="Home" href="/"> <Logo /> </a>
			</h1>
			<Search />
			<div class="flex items-center">
				<a
					href="https://github.com/winget-run/wingetdotrun"
					class="w-11 h-11 mr-3 inline-flex items-center justify-center rounded-lg focus:outline-none | bg-white bg-opacity-10 hover:(bg-primary-dark bg-opacity-100) transition-colors text-white font-semibold text-lg"
				>
					<Github />
				</a>
				<a
					href="https://ko-fi.com/wingetdotrun"
					class="w-11 h-11 mr-3 inline-flex items-center justify-center rounded-lg focus:outline-none | bg-white bg-opacity-10 hover:(bg-primary-dark bg-opacity-100) transition-colors text-white font-semibold text-lg"
				>
					<Kofi />
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
			<Footer />
		</main>
		<Sidebar />
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
			background: #d4d4d4;
			border-radius: 30px;
		}
		&::-webkit-scrollbar-thumb:hover {
			background: #888888;
		}
		&::-webkit-scrollbar-track {
			background: #fff;
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
