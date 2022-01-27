<script lang="ts">
	import clsx from "clsx";
	import IconCheck from "~icons/uil/check";

	export let labelClass: string = null;
	export let checked: boolean;
	export let type: "checkbox" | "radio" = "checkbox";
</script>

<div>
	<input {checked} on:click={() => (checked = !checked)} class="sr-only" {...$$restProps} {type} />
	<label
		class={clsx(
			"flex text-sm text-grey cursor-pointer mb-1 text-body dark:text-body-dark",
			labelClass
		)}
		for={$$props.id}
	>
		{#if $$props.type === "radio"}
			<span
				class="flex items-center justify-center w-5 h-5 mr-2 rounded-full border border-primary text-primary"
			>
				{#if $$props.checked}
					<IconCheck width="1.25rem" height="1.25rem" />
				{/if}
			</span>
		{:else}
			<span
				class="flex items-center justify-center w-5 h-5 mr-2 rounded border border-primary text-primary"
			>
				{#if $$props.checked}
					<IconCheck width="1.25rem" height="1.25rem" />
				{/if}
			</span>
		{/if}
		<slot />
	</label>
</div>
