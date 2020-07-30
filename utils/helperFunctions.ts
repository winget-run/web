import { IStat, IStatsResponse } from "../api/getStats";
import { ISearchFilters } from "./state/Search";

export const getIcon = (url: string | null, isSearch: boolean): string => {
  if (url) {
    let newUrl: string;

    // Edge Cases
    if (url.includes("github.com")) {
      if (isSearch) {
        newUrl = "https://github.githubassets.com/favicons/favicon.svg";
      } else {
        newUrl = "https://github.githubassets.com/favicons/favicon-dark.svg";
      }
    }

    if (newUrl) {
      return newUrl;
    }
    return `https://www.google.com/s2/favicons?sz=32&domain_url=${url}`;
  }
  return "/favicon.ico";
};

export const parseTagMatches = (query: string): string[] => {
  const taglist = ["name", "publisher", "description", "tags"];

  const tags = taglist
    .map((e) => query.indexOf(`${e}:`))
    .filter((e) => e !== -1);
  if (tags.length === 0) {
    return [`query:${query}`];
  }

  return tags.map((e, i, a) => query.slice(e, a[i + 1] ?? query.length).trim());
};

export const parseTags = (query: string): ISearchFilters => {
  const data = parseTagMatches(query);

  const final = data.reduce((a, c) => {
    const [tag, query] = c.split(":");
    return { ...a, [tag.trim()]: query.trim() };
  }, {});

  return final;
};

export const parseQueryString = (obj: ISearchFilters): string =>
  Object.entries(obj)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

export const padDate = (stats: IStat[]) => {
  console.log(stats);
  const SAMPLING_PERIOD = 1000 * 60 * 60 * 24;

  const CURRENT_DATE_MS = Date.now();
  const SAMPLE_COUNT = 7;

  const paddedStats = [...new Array(SAMPLE_COUNT).keys()].reverse().map((e) => {
    const time = new Date(CURRENT_DATE_MS - e * SAMPLING_PERIOD);
    time.setHours(0, 0, 0, 0);

    return (
      stats.find((f) => f.Period === time.toISOString()) ?? {
        Period: time,
        Value: 0,
      }
    );
  });
  console.warn(paddedStats);
  return paddedStats;
};
