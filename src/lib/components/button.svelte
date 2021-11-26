<script lang="ts">
	export let href: string = null;
	export let size: "sm" | "md" | "lg" = "md";
	export let outlined = false;

	let baseButtonClasses =
		"inline-flex items-center justify-center rounded-lg focus:outline-none transition-colors font-semibold truncate";

	$: themeClasses = outlined
		? "border border-primary text-primary hover:(text-primary-dark border-primary-dark bg-primary-10)"
		: "bg-primary text-white hover:(bg-primary-dark)";

	$: sizeClasses =
		size === "sm" ? "py-2.5 px-4 text-sm" : size === "lg" ? "py-3 px-5 text-lg" : "py-3 px-5";

	$: iconSize = size === "sm" ? "1rem" : size === "lg" ? "1.5rem" : "1rem";

	$: finalClasses = [baseButtonClasses, themeClasses, sizeClasses, $$props.class].join(" ");
</script>

{#if href}
	<a {...$$props} class={finalClasses} {href}><slot {iconSize} /></a>
{:else}
	<button {...$$props} class={finalClasses}><slot {iconSize} /></button>
{/if}
