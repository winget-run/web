import { readable } from "svelte/store";
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
	function setReducedMotion(event: MediaQueryListEvent) {
		set(event.matches);
	}

	const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
	mediaQueryList.addEventListener("change", setReducedMotion);

	return () => {
		mediaQueryList.removeEventListener("change", setReducedMotion);
	};
});
