import { downloads } from "$lib/stores/packages";
import { get } from "svelte/store";

export const mapDownloadsToCommands = () => {
	const d = get(downloads);

	return d
		.map((x) =>
			x.version !== "latest"
				? `winget install -e --id ${x.package.Id} -v ${x.version}`
				: `winget install -e --id ${x.package.Id}`
		)
		.join(" & ");
};
