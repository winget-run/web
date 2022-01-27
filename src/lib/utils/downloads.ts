import type { IDownload, IDownloadOptions } from "$lib/stores/packages";

export type DownloadType = "ps1" | "cmd" | "json";

export const mapDownloadArgs = (args: IDownloadOptions, version: string) => {
	let output: string[] = [];

	if (version && version !== "latest") output.push(`-v ${version}`);
	if (args?.scope) output.push(`--scope ${args.scope}`);
	if (args?.installation) output.push(args.installation === "interactive" ? "-i" : "-h");
	if (args?.acceptPackageAgreements) output.push("--accept-package-agreements");
	if (args?.acceptSourceAgreements) output.push("--accept-source-agreements");

	return output;
};

export const mapDownloadsToCommands = (
	downloads: IDownload[],
	options: IDownloadOptions,
	format: DownloadType = "ps1"
) => {
	switch (format) {
		case "json":
			return `winget import --import-file wingetdotrun.json`;
		case "ps1":
		case "cmd":
			return downloads
				.map(
					(x) =>
						`winget install -e --id ${x.package.Id} ${mapDownloadArgs(options, x.version).join(
							" "
						)}`
				)
				.join(format === "ps1" ? "; " : "& ");
	}
};

export const downloadText = (filename: string, text: string) => {
	const element = document.createElement("a");
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
	element.setAttribute("download", filename);

	element.style.display = "none";
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
};
