<script lang="ts">
	import Search from "$lib/components/search.svelte";
	import Github from "$lib/components/svg/github.svelte";
	import Kofi from "$lib/components/svg/kofi.svelte";
	import Logo from "$lib/components/svg/logo.svelte";
	import Tooltip from "$lib/components/tooltip.svelte";
	import { theme } from "$lib/stores/a11y";
	import { t } from "svelte-intl-precompile";
	import IconMoon from "~icons/uil/moon";
	import IconSun from "~icons/uil/sun";
	import LanguagePicker from "./language_picker.svelte";
</script>

<nav class="pb-4">
	<div
		class="flex w-full items-center justify-between h-full w-full rounded-[1.25rem] py-4 px-5 | bg-primary-20 dark:(bg-dark-700)"
	>
		<h1 class="font-bold text-3xl pl-4 | text-primary-60 dark:(text-primary)">
			<a aria-label="Home" href="/"> <Logo /> </a>
		</h1>
		<Search />
		<div class="flex items-center">
			<Tooltip
				wrapperClass="mr-3"
				content={$theme === "dark" ? $t("nav.light_mode") : $t("nav.dark_mode")}
			>
				<button
					on:click={() => theme.toggle()}
					href="https://github.com/winget-run/wingetdotrun"
					class="w-11 h-11 inline-flex items-center justify-center rounded-lg focus:outline-none transition-colors font-semibold text-lg | bg-primary-30 hover:(bg-primary-dark) text-primary-60 | dark:(bg-dark-600 text-white)"
				>
					<svelte:component this={$theme === "dark" ? IconMoon : IconSun} />
				</button>
			</Tooltip>
			<LanguagePicker />
			<Tooltip wrapperClass="mr-3" content={$t("nav.view_on_github")}>
				<a
					href="https://github.com/winget-run/wingetdotrun"
					class="w-11 h-11 inline-flex items-center justify-center rounded-lg focus:outline-none transition-colors font-semibold text-lg | bg-primary-30 hover:(bg-primary-dark) text-primary-60 | dark:(bg-dark-600 text-white)"
				>
					<Github />
				</a>
			</Tooltip>
			<Tooltip wrapperClass="mr-3" content={$t("nav.buy_us_a_coffee")}>
				<a
					href="https://ko-fi.com/wingetdotrun"
					class="w-11 h-11 inline-flex items-center justify-center rounded-lg focus:outline-none transition-colors font-semibold text-lg | bg-primary-30 hover:(bg-primary-dark) text-primary-60 | dark:(bg-dark-600 text-white)"
				>
					<Kofi />
				</a>
			</Tooltip>
			<a
				href="ms-appinstaller:?source=https://aka.ms/getwinget"
				class="h-11 inline-flex px-4 items-center justify-center rounded-lg focus:outline-none transition-colors font-semibold text-lg | bg-primary hover:bg-grey-10 text-white hover:text-primary-dark"
			>
				{$t("nav.install_winget")}
			</a>
		</div>
	</div>
</nav>
