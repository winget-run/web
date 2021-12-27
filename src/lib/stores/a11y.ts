import { readable, writable } from "svelte/store";
import { browser } from "$app/env";

/*
	PREFERS REDUCED MOTION
*/
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const getInitialMotionPreference = () => {
	if (!browser) return false;
	return window.matchMedia(REDUCED_MOTION_QUERY).matches;
};

export const prefersReducedMotion = readable(getInitialMotionPreference(), (set) => {
	if (!browser) return;

	function setReducedMotion(event: MediaQueryListEvent) {
		set(event.matches);
	}

	const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
	mediaQueryList.addEventListener("change", setReducedMotion);

	return () => {
		mediaQueryList.removeEventListener("change", setReducedMotion);
	};
});

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
