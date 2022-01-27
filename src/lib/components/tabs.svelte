<script lang="ts">
	import clsx from "clsx";

	export let tabs: string[];

	export let selected = 0;
</script>

<div class="mb-3" role="tablist">
	{#each tabs as tab, i}
		<button
			on:click={() => (selected = i)}
			role="tab"
			id={tab.toLowerCase().replace(" ", "-")}
			aria-selected={selected === i}
			aria-controls="{tab.toLowerCase().replace(' ', '-')}-tab"
			tabindex={selected === i ? 0 : -1}
			class={clsx(
				"px-5 py-2.5 text-lg font-semibold text-primary rounded-t-lg border-bottom-2 focus:outline-none focus:bg-primary-20",
				selected === i ? "border-primary" : "border-transparent"
			)}
		>
			{tab}
		</button>
	{/each}
</div>
{#each tabs as _, index}
	<slot
		isSelected={selected === index}
		{index}
		props={{
			tabindex: 0,
			role: "tabpanel",
			id: `${tabs[index].toLowerCase().replace(" ", "-")}-tab`,
			"aria-labelled-by": tabs[index].toLowerCase().replace(" ", "-"),
		}}
	/>
{/each}
