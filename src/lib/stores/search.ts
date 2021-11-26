import type { IResponse } from "$lib/types/package";
import { writable } from "svelte/store";

export const searchOpen = writable(false);
export const searchResults = writable<IResponse>(null);
