<script lang="ts">
	import { clickoutside } from "$lib/utils/actions";
	import clsx from "clsx";
	import { createEventDispatcher } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import VirtualList from "svelte-tiny-virtual-list";
	import { cubicOut } from "svelte/easing";
	import { fade } from "svelte/transition";
	import IconCheck from "~icons/uil/check";
	import IconSort from "~icons/uil/sort";

	const dispatch = createEventDispatcher();

	export let offset = [0, 0];
	export let grey = false;

	const [popperRef, popper, getInstance] = createPopperActions();
	const popperOptions = {
		modifiers: [
			{ name: "offset", options: { offset } },
			{
				name: "preventOverflow",
				options: {
					altBoundary: true,
					padding: 8,
				},
			},
			{
				name: "flip",
				options: {
					fallbackPlacements: ["top", "bottom"],
					altBoundary: true,
				},
			},
		],
	};

	let expanded = false;
	export let selected: number;

	export let items: {
		label: string;
		value: any;
	}[];
</script>

<div class="relative text-primary-60" use:clickoutside={() => (expanded = false)}>
	<button
		use:popperRef
		on:click={() => (expanded = !expanded)}
		class={clsx(
			"dark:(bg-dark-700 text-white) h-10 px-4 rounded-lg leading-none text-left text-sm font-semibold inline-flex items-center justify-between focus:outline-none",
			grey ? "bg-primary-10" : "bg-primary-20",
			$$props.class
		)}
		aria-haspopup="listbox"
		id="button"
	>
		<span class="flex-1 truncate">{items[selected].label}</span>
		<IconSort class="ml-4" width={18} height={18} />
	</button>
	{#if expanded}
		<div
			in:fade={{
				duration: 250,
				easing: cubicOut,
			}}
			out:fade={{ duration: 100 }}
			use:popper={popperOptions}
			role="listbox"
			aria-labelledby="button"
			class="absolute max-h-sm overflow-auto z-40 bg-primary-10 dark:(bg-dark-800 text-body-dark) rounded-lg w-full shadow-lg p-2 dropdown-list"
		>
			<VirtualList
				width="100%"
				height={Math.min(32 * 9, items.length * 32)}
				itemCount={items.length}
				itemSize={32}
				scrollToIndex={selected}
				scrollToAlignment="center"
			>
				<div
					slot="item"
					tabindex="0"
					role="option"
					let:index
					let:style
					{style}
					on:click={() => {
						selected = index;
						expanded = false;
						dispatch("change", items[index].value);
					}}
					class={clsx(
						"py-1.5 px-2 rounded cursor-default inline-flex items-center justify-between w-full text-sm",
						index === selected
							? "bg-primary-30 text-primary-60 dark:(bg-primary text-white) font-semibold"
							: "hover:bg-primary-20 dark:hover:bg-dark-700"
					)}
				>
					<span class="flex-1 truncate">
						{items[index].label}
					</span>
					{#if index === selected}
						<IconCheck class="ml-4" width={20} height={20} />
					{/if}
				</div>
			</VirtualList>
		</div>
	{/if}
</div>

<style lang="scss">
	.dropdown-list :global(.virtual-list-wrapper) {
		overflow-x: hidden;
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
			background: #f5f5f5;
			border-radius: 30px;
		}
	}
</style>
