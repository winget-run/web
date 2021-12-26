<script lang="ts">
	import IconSortAmountDown from "~icons/uil/sort-amount-down";
	import IconSortAmountUp from "~icons/uil/sort-amount-up";
	import Dropdown from "./dropdown.svelte";

	export let sort: string;
	export let order: string;

	let sorts = [
		{ label: "Relevance", value: null },
		{ label: "Name", value: "Latest.Name" },
		{ label: "Publisher", value: "Latest.Publisher" },
		{ label: "Updated", value: "UpdatedAt" },
	];

	let orders = [
		{ label: "Ascending", value: "1", icon: IconSortAmountUp },
		{ label: "Descending", value: "-1", icon: IconSortAmountDown },
	];

	$: currentOrderOption = orders.find((x) => x.value === order) ?? orders[0];
</script>

<div class="flex flex-1 justify-end">
	<div class="flex flex-col max-w-40 w-full">
		<label class="text-sm text-sub font-semibold mb-1" for="button">Sort by</label>
		<Dropdown
			items={sorts}
			selected={sorts.findIndex((x) => x.value === sort)}
			on:change={({ detail }) => (sort = detail)}
			class="w-full"
		/>
	</div>
	{#if sort}
		<div class="flex flex-col max-w-40 w-full ml-3">
			<label class="text-sm text-sub font-semibold mb-1" for="order"> Order by </label>
			<button
				id="order"
				class="bg-primary-20 text-primary-60 h-10 px-4 rounded-lg leading-none text-left text-sm font-semibold inline-flex items-center justify-between focus:outline-none"
				on:click={() => (order === "1" ? (order = "-1") : (order = "1"))}
			>
				{currentOrderOption.label}
				<svelte:component this={currentOrderOption.icon} width={18} height={18} class="ms-4" />
			</button>
		</div>
	{/if}
</div>
