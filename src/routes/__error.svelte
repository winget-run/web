<script lang="ts" context="module">
	import type { ErrorLoad } from "@sveltejs/kit";
	import { t } from "svelte-intl-precompile";

	export const load: ErrorLoad = async ({ status, error }) => {
		const api = new Wingetdotrun();

		const res = await api.featured({
			take: "3",
		});

		const featured =
			res.Packages.length > 0 ? res.Packages.sort((a, b) => 0.5 - Math.random()) : [];

		return {
			props: {
				status,
				error,
				featured: featured.slice(0, 3),
			},
		};
	};
</script>

<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import IconHome from "~icons/uil/home";
	import Wingetdotrun from "$lib/api/wingetdotrun";
	import type { IPackage, IResponse } from "$lib/types/package";
	import { fly } from "svelte/transition";
	import { prefersReducedMotion } from "svaria";
	import { backOut } from "svelte/easing";
	import Package from "$lib/components/package.svelte";
	import Codeblock from "$lib/components/codeblock.svelte";

	export let error: Error;
	export let status: number;
	export let featured: IPackage[];

	$: flyAmount = $prefersReducedMotion ? 0 : 20;
</script>

<div class="max-w-[1178px] mx-auto flex flex-col items-center my-20">
	<h1 class="text-center text-primary font-bold text-[9rem]">
		{#if status !== 404}
			{status}
		{:else}
			<span class="sr-only">404</span>
			<svg
				class="inline-block max-w-full"
				width="281"
				height="144"
				viewBox="0 0 281 144"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7.056 103.28V83.408L52.56 18.32H80.064V81.968H91.872V103.28H80.064V122H55.44V103.28H7.056ZM57.168 45.392L32.976 81.968H57.168V45.392ZM189.807 103.28V83.408L235.311 18.32H262.815V81.968H274.623V103.28H262.815V122H238.191V103.28H189.807ZM239.919 45.392L215.727 81.968H239.919V45.392Z"
					fill="#3F9CB4"
				/>
				<path
					d="M179.971 52.8907C180.01 52.6107 180.01 52.3267 179.971 52.0467V51.7251C179.902 51.5008 179.808 51.285 179.691 51.082C179.639 50.9663 179.572 50.8581 179.491 50.7605L179.091 50.238L178.771 49.9968L178.291 49.6351L142.305 29.5385C141.697 29.1857 141.007 29 140.305 29C139.603 29 138.914 29.1857 138.306 29.5385L102.319 49.6351L101.959 49.9164L101.519 50.238C101.403 50.3694 101.309 50.5187 101.24 50.6801C101.112 50.7954 101.004 50.9312 100.92 51.082C100.816 51.2584 100.735 51.4475 100.68 51.6447C100.657 51.7778 100.657 51.9136 100.68 52.0467C100.405 52.2849 100.175 52.5708 100 52.8907V85.0453C100.005 85.7615 100.201 86.4633 100.566 87.0781C100.932 87.6929 101.454 88.1983 102.079 88.5421L138.066 108.639C138.231 108.736 138.405 108.816 138.586 108.88H138.986C139.643 109.04 140.328 109.04 140.985 108.88H141.385L141.945 108.639L177.932 88.5421C178.549 88.1931 179.064 87.6854 179.422 87.071C179.78 86.4566 179.97 85.7575 179.971 85.0453V52.8907ZM139.985 68.4455L112.236 52.8907L123.272 46.7814L150.582 62.4567L139.985 68.4455ZM139.985 37.4163L167.735 52.8907L158.779 57.9149L131.469 42.1993L139.985 37.4163ZM107.997 59.7236L135.987 75.4793V98.309L107.997 82.6739V59.7236ZM143.984 98.309V75.4793L155.98 68.7268V81.0259L163.977 77.0066V64.2252L171.974 59.7638V82.6739L143.984 98.309Z"
					fill="#3F9CB4"
				/>
			</svg>
		{/if}
	</h1>
	<h2 class="text-center text-4xl font-bold my-3 text-primary-60 dark:text-primary-40">
		{status === 404 ? $t("errors.404_message") : $t("errors.message")}
	</h2>

	{#if status !== 404}
		<Codeblock class="my-5 w-full" code={error.message} />
	{/if}

	<Button href="/" class="inline-block mt-8" outlined let:iconSize>
		<IconHome class="mr-3" width={iconSize} height={iconSize} />
		{$t("errors.return_home")}
	</Button>

	{#if featured?.length > 0}
		<p class="font-medium text-lg text-sub dark:text-sub-dark mt-16 ">
			{$t("errors.try_packages")}
		</p>
		<div class="packages-grid mt-5">
			{#each featured as pack, i (pack.Id)}
				<div
					in:fly={{
						y: flyAmount,
						delay: $prefersReducedMotion ? 0 : i * 50,
						easing: backOut,
					}}
					class="max-w-md"
				>
					<Package {pack} />
				</div>
			{/each}
		</div>
	{/if}
</div>
