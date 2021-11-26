import type { IPackage, IResponse } from "$lib/types/package";
import { writable } from "svelte/store";

export interface IDownload {
	package: IPackage;
	version: IPackage["Versions"][0];
}

export const updatedPackages = writable<IResponse>(null);
export const downloads = writable<IDownload[]>([]);
