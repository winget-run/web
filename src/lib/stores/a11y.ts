import { browser } from "$app/env";
import { writable } from "svelte/store";

/*
	DARK MODE
*/
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

const getInitialThemePreference = () => {
	if (!browser) return "light";
	const stored = localStorage.getItem("theme");

	// Get stored first
	if (stored && (stored === "dark" || stored === "light")) return stored;

	// Get preference
	if (window.matchMedia(DARK_MODE_QUERY).matches) return "dark";

	return "light";
};

const setupTheme = () => {
	const { subscribe, set, update } = writable<"dark" | "light">(
		getInitialThemePreference(),
		(set) => {
			if (!browser) return;

			function setDark(event: MediaQueryListEvent) {
				set(event.matches ? "dark" : "light");
			}

			const mediaQueryList = window.matchMedia(DARK_MODE_QUERY);
			mediaQueryList.addEventListener("change", setDark);

			return () => {
				mediaQueryList.removeEventListener("change", setDark);
			};
		}
	);

	return {
		subscribe,
		dark: () => {
			localStorage.setItem("theme", "dark");
			set("dark");
		},
		light: () => {
			localStorage.setItem("theme", "light");
			set("light");
		},
		toggle: () =>
			update((x) => {
				localStorage.setItem("theme", x === "light" ? "dark" : "light");
				return x === "light" ? "dark" : "light";
			}),
	};
};

export const theme = setupTheme();
