import { derived, writable } from "svelte/store";

export const sidebarOpen = writable(false);
export const searchOpen = writable(false);

const recent = () => {
	let previous: "sidebar" | "search" = undefined;
	return derived([sidebarOpen, searchOpen], ([$sidebar, $search]) => {
		if ($search) {
			previous = "search";
		}

		if ($sidebar) {
			previous = "sidebar";
		}

		return previous;
	});
};

export const mostRecentlyOpened = recent();
