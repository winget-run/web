<script lang="ts">
	import { prefersReducedMotion } from "$lib/stores/a11y";
	import { t } from "svelte-intl-precompile";
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
	<h2 class="font-semibold text-lg text-primary dark:text-white mb-2">
		{$t("search.advanced.title")}
	</h2>
	<table class="text-body dark:text-body-dark">
		<tr>
			<td class="pr-3 pb-2 align-top font-mono font-semibold text-title dark:text-sub-dark">
				name:</td
			>
			<td class="pb-2 align-top">
				{$t("search.advanced.name")}
			</td>
		</tr>
		<tr>
			<td class="pr-3 pb-2 align-top font-mono font-semibold text-title dark:text-sub-dark"
				>publisher:</td
			>
			<td class="pb-2 align-top">
				{$t("search.advanced.publisher")}
			</td>
		</tr>
		<tr>
			<td class="pr-3 pb-2 align-top font-mono font-semibold text-title dark:text-sub-dark">
				description:
			</td>
			<td class="pb-2 align-top">
				{$t("search.advanced.description")}
			</td>
		</tr>
		<tr>
			<td class="pr-3 align-top font-mono font-semibold text-title dark:text-sub-dark"> tags: </td>
			<td class="align-top">
				{$t("search.advanced.tags")}
				<br />
				({$t("search.advanced.comma_separated")}).
			</td>
		</tr>
	</table>
</div>
