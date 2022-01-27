import { browser } from "$app/env";
import { writable } from "svelte/store";

export const devMode = writable<string | null>(
	browser ? window.localStorage.getItem("winget_token") : null
);
