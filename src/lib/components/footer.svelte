<script lang="ts">
	import Logo from "./svg/logo.svelte";

	let links = {
		"About winget": "https://docs.microsoft.com/en-us/windows/package-manager/",
		"API Documentation": "https://docs.winget.run/docs/introduction",
		GitHub: "https://github.com/winget-run/wingetdotrun",
		Twitter: "https://twitter.com/feinwaru",
		"Support Us": "https://ko-fi.com/wingetdotrun",
	};
</script>

<footer class="py-8 bg-grey-10 p-4 rounded-xl flex flex-col items-center text-body mt-10">
	<ul class="flex mb-8">
		{#each Object.entries(links) as [text, href]}
			<li>
				<a class="mx-2 hover:(underline)" {href}>{text}</a>
			</li>
		{/each}
	</ul>
	<Logo />
	<small class="text-sm text-sub mt-3">© 2017 - {new Date().getFullYear()} Feinwaru Software</small>
</footer>
