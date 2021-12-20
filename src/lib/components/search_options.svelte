<script lang="ts">
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { backOut } from "svelte/easing";
	import { fly } from "svelte/transition";

	export let delay = 0;
</script>

<div
	in:fly={{
		y: $prefersReducedMotion ? 0 : 10,
		easing: backOut,
		delay,
	}}
	class="bg-primary-10 dark:bg-dark-800 rounded-xl h-full w-full border dark:border-dark-700 p-5 shadow-card {$$props.class}"
>
	<h2 class="font-semibold text-lg text-primary dark:text-white mb-2">Advanced search options</h2>
	<table class="text-body dark:text-body-dark">
		<tr>
			<td class="pr-3 pb-2 align-top font-mono font-semibold text-title dark:text-sub-dark"
				>name:</td
			>
			<td class="pb-2 align-top">Searches only the package names.</td>
		</tr>
		<tr>
			<td class="pr-3 pb-2 align-top font-mono font-semibold text-title dark:text-sub-dark"
				>publisher:</td
			>
			<td class="pb-2 align-top">Searches for packages by a publisher.</td>
		</tr>
		<tr>
			<td class="pr-3 pb-2 align-top font-mono font-semibold text-title dark:text-sub-dark"
				>description:</td
			>
			<td class="pb-2 align-top">Searches only for keywords in the description.</td>
		</tr>
		<tr>
			<td class="pr-3 align-top font-mono font-semibold text-title dark:text-sub-dark">tags:</td>
			<td class="align-top">
				Searches for packages with a specific tags
				<br />
				(comma separated).
			</td>
		</tr>
	</table>
</div>
