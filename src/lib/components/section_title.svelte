<script lang="ts">
	export let icon = null;
</script>

<div
	class="flex items-center | text-2xl font-bold text-primary-60 dark:text-primary uppercase {$$props.class}"
>
	<svelte:component this={icon} width="1.5rem" height="1.5rem" class="mr-2.5" />
	<slot />
</div>
