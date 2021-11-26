import type { ISearchFilters } from "$lib/types/search";
import type { IStat } from "$lib/types/stats";

export const parseTagMatches = (query: string): string[] => {
	const taglist = ["name", "publisher", "description", "tags"];

	const tags = taglist
		.map((e) => query.indexOf(`${e}:`))
		.filter((e) => e !== -1)
		.sort((a, b) => a - b);
	if (tags.length === 0) {
		return [`query:${query}`];
	}

	return tags.map((e, i, a) => query.slice(e, a[i + 1] ?? query.length).trim());
};

export const parseTags = (q: string): ISearchFilters => {
	const data = parseTagMatches(q);

	const final = data.reduce((a, c) => {
		const [tag, query] = c.split(":");
		return { ...a, [tag.trim()]: query.trim() };
	}, {});

	return final;
};

export const padDate = (stats: IStat[], period: number, sampleAmount: number) => {
	const currentDateInMs = Date.now() - period;
	const paddedStats = [...new Array(sampleAmount).keys()].reverse().map((e) => {
		const time = new Date(currentDateInMs - e * period);
		time.setUTCHours(0, 0, 0, 0);

		return (
			stats.find((f) => f.Period === time.toISOString()) ?? {
				Period: time.toISOString(),
				Value: 0,
			}
		);
	});
	return paddedStats;
};
