<script lang="ts">
	import { LOCALES } from "$lib/utils/constants";
	import cookies from "js-cookie";
	import { clickoutside } from "svaria";
	import { locale, t } from "svelte-intl-precompile";
	import { backOut } from "svelte/easing";
	import { fade, slide } from "svelte/transition";
	import IconCheck from "~icons/uil/check";
	import IconExternalLink from "~icons/uil/external-link-alt";
	import IconLanguage from "~icons/uil/language";

	let expanded = false;

	$: isActive = (code: string) => $locale.startsWith(code);
</script>

<span class="relative mr-3">
	<button
		{...$$restProps}
		id="nav-languages"
		class="w-11 h-11 inline-flex items-center justify-center rounded-lg focus:outline-none transition-colors font-semibold text-lg | bg-primary-30 hover:bg-primary-40 text-primary-60 | dark:(bg-dark-600 text-white) dark:hover:bg-dark-800"
		on:click={() => (expanded = !expanded)}
	>
		<IconLanguage />
	</button>

	{#if expanded}
		<ul
			use:clickoutside={() => (expanded = false)}
			in:slide={{ easing: backOut, duration: 250 }}
			out:fade={{ duration: 100 }}
			role="menu"
			aria-label={$t("nav.language_picker")}
			class="absolute right-0 -bottom-2 transform translate-y-full rounded-lg p-2 flex flex-col shadow-lg bg-primary-10 w-screen max-w-56 z-50 text-body text-sm | dark:(bg-dark-800 text-body-dark)"
		>
			{#each Object.entries(LOCALES) as [code, lang]}
				<li role="none">
					<button
						on:click={() => {
							expanded = false;
							locale.set(code);
							cookies.set("locale", code);
						}}
						class="py-1.5 px-2 rounded w-full inline-flex items-center justify-between font-medium cursor-auto focus:outline-none
			{isActive(code)
							? 'bg-primary-30 text-primary-60 dark:(bg-primary text-white)'
							: 'hover:bg-primary-20 dark:hover:bg-dark-700'}"
						role="menuitem"
						tabindex={isActive(code) ? -1 : 0}
					>
						<span>{lang}</span>
						{#if isActive(code)}
							<IconCheck class="ml-4" width={20} height={20} />
						{/if}
					</button>
				</li>
			{/each}
			<li role="none">
				<a
					class="py-1.5 px-2 rounded w-full inline-flex items-center font-medium focus-ring hover:bg-primary-20 dark:hover:bg-dark-700"
					href="https://github.com/"
					role="menuitem"
					tabindex="0"
				>
					{$t("nav.help_us_translate")}
					<IconExternalLink class="h-4 w-4 ml-2" />
				</a>
			</li>
		</ul>
	{/if}
</span>
