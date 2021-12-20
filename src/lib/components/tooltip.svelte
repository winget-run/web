<script lang="ts">
	import { createPopperActions } from "svelte-popperjs";

	export let content: string;
	export let offset = [0, 6];
	export let wrapperClass = "";

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
			{
				name: "arrow",
				options: {
					padding: 4,
				},
			},
		],
	};

	async function update() {
		const instance = getInstance();
		if (instance) await instance.update();
	}

	$: content, update();

	let show = false;
</script>

<span
	use:popperRef
	class="relative {wrapperClass}"
	on:mouseenter={() => (show = true)}
	on:mouseleave={() => (show = false)}
>
	<slot />
</span>
{#if show}
	<span
		class="tooltip absolute px-2 py-1 rounded bg-title text-white text-sm font-medium whitespace-nowrap z-20 font-sans"
		use:popper={popperOptions}
	>
		<div class="arrow" data-popper-arrow />
		<span>{content}</span>
	</span>
{/if}

<style lang="scss">
	.tooltip {
		box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
	}

	.arrow {
		height: 8px;
		width: 8px;
		pointer-events: none;
	}

	.arrow::before {
		@apply bg-title;
		content: "";
		position: absolute;
		width: 8px;
		height: 8px;
		border-radius: 2px;
		transform: rotate(45deg);
	}

	:global([data-popper-placement^="top"]) > .arrow {
		bottom: -3px;
	}

	:global([data-popper-placement^="bottom"]) > .arrow {
		top: -3px;
	}
	:global([data-popper-placement^="left"]) > .arrow {
		right: -3px;
	}

	:global([data-popper-placement^="right"]) > [data-popper-arrow] {
		left: -3px;
	}
</style>
