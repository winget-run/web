import type { IResponse } from "$lib/types/package";
import { writable } from "svelte/store";

export const searchResults = writable<IResponse>(null);
