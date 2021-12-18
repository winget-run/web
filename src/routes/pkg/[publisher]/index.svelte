<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ page }) => {
		const publisher = page.params["publisher"];

		return {
			redirect: `/search?publisher=${encodeURIComponent(publisher)}`,
			status: 308,
		};
	};
</script>
