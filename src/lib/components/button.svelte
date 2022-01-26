<script lang="ts">
	export let href: string = null;
	export let size: "sm" | "md" | "lg" = "md";
	export let outlined = false;

	let baseButtonClasses =
		"inline-flex items-center justify-center rounded-lg border focus:outline-none transition-colors font-semibold truncate";

	$: themeClasses = outlined
		? "border-primary text-primary hover:(text-primary-60 border-primary-60 bg-primary-20) dark:hover:(text-white border-white bg-dark-700)"
		: "border-primary bg-primary text-white hover:(bg-primary-60 border-primary-60)";

	$: sizeClasses =
		size === "sm" ? "py-2.5 px-4 text-sm" : size === "lg" ? "py-3 px-5 text-lg" : "py-3 px-5";

	$: iconSize = size === "sm" ? "1rem" : size === "lg" ? "1.5rem" : "1rem";

	$: finalClasses = [baseButtonClasses, themeClasses, sizeClasses, $$props.class].join(" ");
</script>

{#if href}
	<a {...$$restProps} on:click class={finalClasses} {href}><slot {iconSize} /></a>
{:else}
	<button {...$$restProps} on:click class={finalClasses}><slot {iconSize} /></button>
{/if}
