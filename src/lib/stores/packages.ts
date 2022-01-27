import type { IPackage, IResponse } from "$lib/types/package";
import { writable } from "svelte/store";

export interface IDownloadOptions {
	scope?: "user" | "machine";
	installation?: "silent" | "interactive";
	acceptPackageAgreements?: boolean;
	acceptSourceAgreements?: boolean;
}

export interface IDownload {
	package: IPackage;
	version: IPackage["Versions"][0];
}

export const updatedPackages = writable<IResponse>(null);
export const downloads = writable<IDownload[]>([]);
export const downloadOptions = writable<IDownloadOptions>({
	scope: null,
	installation: null,
	acceptPackageAgreements: false,
	acceptSourceAgreements: false,
});
export const searchResults = writable<IResponse>(null);
