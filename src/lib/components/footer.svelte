<script lang="ts">
	import { t } from "svelte-intl-precompile";
	import Logo from "./svg/logo.svelte";

	$: links = {
		[$t("nav.about_winget")]: "https://docs.microsoft.com/en-us/windows/package-manager/",
		[$t("nav.api_documentation")]: "https://docs.winget.run/docs/introduction",
		GitHub: "https://github.com/winget-run/wingetdotrun",
		Twitter: "https://twitter.com/feinwaru",
		[$t("nav.buy_us_a_coffee")]: "https://ko-fi.com/wingetdotrun",
	};
</script>

<footer
	class="py-8 bg-primary-20 p-4 rounded-[1.25rem] flex flex-col items-center text-body mt-10 dark:(bg-dark-800 text-body-dark)"
>
	<ul class="flex mb-8">
		{#each Object.entries(links) as [text, href]}
			<li>
				<a class="mx-2 hover:(underline)" {href}>{text}</a>
			</li>
		{/each}
	</ul>
	<Logo />
	<small class="text-sm text-sub mt-3 dark:text-sub-dark">
		© 2017 - {new Date().getFullYear()} Feinwaru Software
	</small>
</footer>
