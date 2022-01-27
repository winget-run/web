<script type="ts">
	import clsx from "clsx";

	export let value: string;
	export let wrapperClass: string = null;
	export let label: string;

	$: id = label.split(" ").join("_");
</script>

<span class={clsx("relative flex flex-col text-primary-60", wrapperClass)}>
	<input
		{id}
		bind:value
		type="text"
		class={clsx(
			"w-full h-10 px-4 bg-primary-20 rounded-lg leading-none text-left text-sm placeholder-sub",
			$$props.class
		)}
		{...$$restProps}
	/>
	<label class="order-first" for={id}>
		{label}
	</label>
</span>
