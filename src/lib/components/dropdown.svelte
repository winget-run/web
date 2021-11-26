<script lang="ts">
	import { prefersReducedMotion } from "$lib/stores/a11y";

	import { clickoutside } from "$lib/utils/actions";
	import check from "@iconify/icons-uil/check";
	import sort from "@iconify/icons-uil/sort";
	import Icon from "@iconify/svelte";
	import { createEventDispatcher } from "svelte";
	import { backOut, cubicOut } from "svelte/easing";
	import { fade, fly } from "svelte/transition";

	const dispatch = createEventDispatcher();

	let expanded = false;
	export let selected: number;

	export let items: {
		label: string;
		value: any;
	}[];
</script>

<div class="relative" use:clickoutside={() => (expanded = false)}>
	<button
		on:click={() => (expanded = true)}
		class="bg-grey-10 px-4 py-3 rounded-lg leading-none text-left text-sm font-semibold inline-flex items-center justify-between focus:outline-none {$$props.class}"
		aria-haspopup="listbox"
		id="button"
	>
		<span class="flex-1 truncate">{items[selected].label}</span>
		<Icon icon={sort} width={14} height={14} class="ms-4" />
	</button>
	{#if expanded}
		<ul
			in:fly={{
				y: $prefersReducedMotion ? 0 : -10,
				duration: $prefersReducedMotion ? 100 : 250,
				easing: $prefersReducedMotion ? cubicOut : backOut,
			}}
			out:fade={{ duration: 100 }}
			role="listbox"
			aria-labelledby="button"
			class="absolute max-h-sm overflow-auto z-40 bg-white rounded-lg w-full shadow-card py-2"
		>
			{#each items as item, i}
				<li
					class="px-4 py-2 cursor-pointer hover:bg-grey-10 inline-flex items-center justify-between w-full text-sm
          {i === selected && 'bg-primary-10 text-primary font-semibold'}"
					tabindex="0"
					role="option"
					on:click={() => {
						selected = i;
						expanded = false;
						dispatch("change", item.value);
					}}
				>
					<span class="flex-1 truncate">
						{item.label}
					</span>
					{#if i === selected}
						<Icon icon={check} width={20} height={20} class="ms-4" />
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
